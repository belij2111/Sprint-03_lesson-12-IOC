import {UsersMongoRepository} from "../repositories/users-mongo-repository";
import {
    ApiCallDataInputType,
    LoginInputType,
    LoginServiceOutputType, NewPasswordInputType, PasswordRecoveryInputType,
    RegistrationConfirmationCodeInputType,
    RegistrationEmailResendingInputType
} from "../types/auth-types";
import {bcryptService} from "../common/adapters/bcrypt-service";
import {UserDbType} from "../db/user-db-type";
import {Result} from "../common/types/result-type";
import {ResultStatus} from "../common/types/result-code";
import {jwtService} from "../common/adapters/jwt-service";
import {InputUserType} from "../types/user-types";
import {ObjectId} from "mongodb";
import {dateTimeIsoString} from "../common/helpers/date-time-iso-string";
import {randomUUID} from "node:crypto";
import {add} from "date-fns/add";
import {nodemailerAdapter} from "../common/adapters/nodemailer-adapter";
import {SETTINGS} from "../settings";
import {AuthMongoRepository} from "../repositories/auth-mongo-repository";
import {DeviceSessionsDbType} from "../db/device-sessions-db-type";
import {CustomJwtPayload} from "../common/types/custom-jwt-payload-type";
import {SecurityDevicesMongoRepository} from "../repositories/security-devices-mongo-repository";

export class AuthService {
    constructor(
        private usersMongoRepository: UsersMongoRepository,
        private securityDevicesMongoRepository: SecurityDevicesMongoRepository,
        private authMongoRepository: AuthMongoRepository
    ) {
    }

    async registerUser(inputUser: InputUserType): Promise<Result> {
        if (!inputUser.login || !inputUser.password || !inputUser.email) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'login,password,email', message: 'All fields are required'}],
                data: null
            }
        }
        const existingUserByLogin = await this.usersMongoRepository.findByLoginOrEmail({
            loginOrEmail: inputUser.login,
            password: inputUser.password
        })
        if (existingUserByLogin) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'login', message: 'Login is not unique'}],
                data: null
            }
        }
        const existingUserByEmail = await this.usersMongoRepository.findByLoginOrEmail({
            loginOrEmail: inputUser.email,
            password: inputUser.password
        })
        if (existingUserByEmail) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'email', message: 'Email is not unique'}],
                data: null
            }
        }
        const passHash = await bcryptService.generateHash(inputUser.password)
        const createNewUser: UserDbType = {
            ...inputUser,
            password: passHash,
            _id: new ObjectId(),
            createdAt: dateTimeIsoString(),
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {
                    hours: 1
                }),
                isConfirmed: false
            }
        }
        await this.usersMongoRepository.create(createNewUser)
        nodemailerAdapter.sendEmail(
            createNewUser.email,
            createNewUser.emailConfirmation.confirmationCode,
            'registration'
        ).catch((error) => {
            console.error('Send email error', error)
        })
        return {
            status: ResultStatus.Success,
            data: null
        }
    }

    async confirmationRegistrationUser(inputCode: RegistrationConfirmationCodeInputType): Promise<Result<boolean | null>> {
        const verifiedUser = await this.usersMongoRepository.findByConfirmationCode(inputCode)
        if (!verifiedUser) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'code', message: 'Confirmation code is incorrect'}],
                data: null
            }
        }
        if (verifiedUser.emailConfirmation.isConfirmed) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'code', message: 'The account has already been confirmed'}],
                data: null
            }
        }
        if (verifiedUser.emailConfirmation.expirationDate < new Date()) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'code', message: 'The confirmation code has expired'}],
                data: null
            }
        }
        const isConfirmed = true
        await this.usersMongoRepository.updateEmailConfirmation(verifiedUser._id, isConfirmed)
        return {
            status: ResultStatus.Success,
            data: null
        }
    }

    async registrationEmailResending(inputEmail: RegistrationEmailResendingInputType): Promise<Result> {
        const existingUserByEmail = await this.usersMongoRepository.findByEmail(inputEmail)
        if (!existingUserByEmail) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'email', message: 'User with this email does not exist'}],
                data: null
            }
        }
        if (existingUserByEmail.emailConfirmation.isConfirmed) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'email', message: 'The account has already been confirmed'}],
                data: null
            }
        }
        const newConfirmationCode = randomUUID()
        const newExpirationDate = add(new Date(), {
            hours: 1
        })
        await this.usersMongoRepository.updateRegistrationConfirmation(existingUserByEmail._id, newConfirmationCode, newExpirationDate)
        await nodemailerAdapter.sendEmail(
            inputEmail.email,
            newConfirmationCode,
            'registration'
        )
        return {
            status: ResultStatus.Success,
            data: null
        }
    }

    async passwordRecovery(inputEmail: PasswordRecoveryInputType): Promise<Result> {
        const existingUserByEmail = await this.usersMongoRepository.findByEmail(inputEmail)
        if (!existingUserByEmail) {
            return {
                status: ResultStatus.Success,
                data: null
            }
        }
        const recoveryCode = randomUUID()
        const newExpirationDate = add(new Date(), {
            hours: 1
        })
        await this.usersMongoRepository.updateRegistrationConfirmation(existingUserByEmail._id, recoveryCode, newExpirationDate)
        await nodemailerAdapter.sendEmail(
            inputEmail.email,
            recoveryCode,
            'passwordRecovery'
        )
        return {
            status: ResultStatus.Success,
            data: null
        }
    }

    async newPassword(inputData: NewPasswordInputType): Promise<Result> {
        const {newPassword, recoveryCode} = inputData
        const existingUserByRecoveryCode = await this.usersMongoRepository.findByRecoveryCode(recoveryCode)
        if (!existingUserByRecoveryCode) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'recoveryCode', message: 'Recovery Code is incorrect'}],
                data: null
            }
        }
        const newPasswordHash = await bcryptService.generateHash(newPassword)
        await this.usersMongoRepository.updatePassword(existingUserByRecoveryCode._id, newPasswordHash)
        return {
            status: ResultStatus.Success,
            data: null
        }

    }

    async loginUser(inputAuth: LoginInputType, ip: string, deviceName: string): Promise<Result<LoginServiceOutputType | null>> {
        const userAuth = await this.authenticateUser(inputAuth)
        if (userAuth.status === ResultStatus.Unauthorized) {
            return {
                status: ResultStatus.Unauthorized,
                extensions: userAuth.extensions,
                data: null
            }
        }
        const payload: Pick<DeviceSessionsDbType, 'userId' | 'deviceId'> = {
            userId: userAuth.data!,
            deviceId: randomUUID()
        }
        const accessToken = await jwtService.createToken(payload, SETTINGS.TOKEN.ACCESS_TOKEN_DURATION)
        const refreshToken = await jwtService.createToken(payload, SETTINGS.TOKEN.REFRESH_TOKEN_DURATION)
        const decodePayload = await jwtService.decodeToken(refreshToken) as CustomJwtPayload
        const deviceSession: DeviceSessionsDbType = {
            userId: decodePayload.userId,
            deviceId: decodePayload.deviceId,
            ip: ip,
            deviceName: deviceName,
            iatDate: new Date(decodePayload.iat! * 1000).toISOString(),
            expDate: new Date(decodePayload.exp! * 1000).toISOString()
        }
        await this.securityDevicesMongoRepository.create(deviceSession)
        return {
            status: ResultStatus.Success,
            data: {accessToken, refreshToken}
        }
    }

    async refreshToken(payload: CustomJwtPayload): Promise<Result<LoginServiceOutputType | null>> {
        const newPayload: Pick<DeviceSessionsDbType, 'userId' | 'deviceId'> = {
            userId: payload.userId,
            deviceId: payload.deviceId
        }
        const accessToken = await jwtService.createToken(newPayload, SETTINGS.TOKEN.ACCESS_TOKEN_DURATION)
        const refreshToken = await jwtService.createToken(newPayload, SETTINGS.TOKEN.REFRESH_TOKEN_DURATION)
        const decodeNewPayload = await jwtService.decodeToken(refreshToken) as CustomJwtPayload
        const deviceId = decodeNewPayload.deviceId
        const iatDate = new Date(decodeNewPayload.iat! * 1000).toISOString()
        await this.securityDevicesMongoRepository.updateByDeviceId(deviceId, iatDate)
        return {
            status: ResultStatus.Success,
            data: {accessToken, refreshToken}
        }
    }

    async logout(deviceId: string): Promise<Result<boolean | null>> {
        const findDevice = await this.securityDevicesMongoRepository.findByDeviceId(deviceId)
        if (!findDevice) {
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'deviceId', message: 'The device was not found'}],
                data: null
            }
        }
        const result = await this.securityDevicesMongoRepository.deleteByDeviceId(findDevice.deviceId)
        return {
            status: ResultStatus.Success,
            data: result
        }
    }

    async checkApiCalls(apiCallData: ApiCallDataInputType): Promise<Result> {
        const timeLimit = add(new Date(), {seconds: -SETTINGS.API_CALLS.TIME_LIMIT})
        const numberLimit = parseInt(SETTINGS.API_CALLS.NUMBER_LIMIT, 10)
        const countApiCalls = await this.authMongoRepository.findApiCalls(apiCallData, timeLimit)
        if (countApiCalls >= numberLimit) {
            return {
                status: ResultStatus.TooManyRequests,
                extensions: [{field: 'rateLimit', message: 'Too many requests in a short period'}],
                data: null
            }
        }
        const apiCall = {
            ip: apiCallData.ip,
            url: apiCallData.url,
            date: new Date()
        }
        await this.authMongoRepository.addApiCall(apiCall)
        return {
            status: ResultStatus.Success,
            data: null
        }
    }

    async authenticateUser(inputAuth: LoginInputType): Promise<Result<string | null>> {
        const userAuth: UserDbType | null = await this.usersMongoRepository.findByLoginOrEmail(inputAuth)
        if (!userAuth) {
            return {
                status: ResultStatus.Unauthorized,
                extensions: [{field: 'login or email', message: 'Login or email is not unique'}],
                data: null
            }
        }
        const result = await bcryptService.checkPassword(inputAuth.password, userAuth.password)
        if (!result) {
            return {
                status: ResultStatus.Unauthorized,
                extensions: [{field: 'password', message: 'Password is wrong'}],
                data: null
            }
        }
        return {
            status: ResultStatus.Success,
            data: userAuth._id.toString()
        }
    }
}