import {usersMongoRepository} from "../repositories/users-mongo-repository";
import {
    LoginInputType,
    LoginSuccessOutputType,
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

export const authService = {
    async registerUser(inputUser: InputUserType): Promise<Result> {
        if (!inputUser.login || !inputUser.password || !inputUser.email) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'login,password,email', message: 'All fields are required'}],
                data: null
            }
        }
        const existingUserByLogin = await usersMongoRepository.findByLoginOrEmail({
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
        const existingUserByEmail = await usersMongoRepository.findByLoginOrEmail({
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
        await usersMongoRepository.create(createNewUser)
        nodemailerAdapter.sendEmail(
            createNewUser.email,
            createNewUser.emailConfirmation.confirmationCode
        ).catch((error) => {
            console.error('Send email error', error)
        })
        return {
            status: ResultStatus.Success,
            data: null
        }
    },

    async confirmationRegistrationUser(inputCode: RegistrationConfirmationCodeInputType): Promise<Result<boolean | null>> {
        const verifiedUser = await usersMongoRepository.findByConfirmationCode(inputCode)
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
        await usersMongoRepository.updateEmailConfirmation(verifiedUser._id, isConfirmed)
        return {
            status: ResultStatus.Success,
            data: null
        }
    },

    async registrationEmailResending(inputEmail: RegistrationEmailResendingInputType): Promise<Result> {
        const existingUserByEmail = await usersMongoRepository.findByEmail(inputEmail)
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
        await usersMongoRepository.updateRegistrationConfirmation(existingUserByEmail._id, newConfirmationCode, newExpirationDate)
        await nodemailerAdapter.sendEmail(
            inputEmail.email,
            newConfirmationCode
        )
        return {
            status: ResultStatus.Success,
            data: null
        }
    },

    async loginUser(inputAuth: LoginInputType): Promise<Result<LoginSuccessOutputType | null>> {
        const userAuth = await this.authenticateUser(inputAuth)
        if (userAuth.status === ResultStatus.Unauthorized) {
            return {
                status: ResultStatus.Unauthorized,
                extensions: userAuth.extensions,
                data: null
            }
        }
        const accessToken = await jwtService.createToken(userAuth.data)
        return {
            status: ResultStatus.Success,
            data: {accessToken}
        }
    },

    async authenticateUser(inputAuth: LoginInputType): Promise<Result<string | null>> {
        const userAuth: UserDbType | null = await usersMongoRepository.findByLoginOrEmail(inputAuth)
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