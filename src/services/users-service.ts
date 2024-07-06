import {ObjectId} from "mongodb";
import {dateTimeIsoString} from "../common/helpers/date-time-iso-string";
import {InputUserType} from "../types/user-types";
import {UserDbType} from "../db/user-db-type";
import {usersMongoRepository} from "../repositories/users-mongo-repository";
import {bcryptService} from "../common/adapters/bcrypt-service";
import {Result} from "../common/types/result-type";
import {ResultStatus} from "../common/types/result-code";
import {randomUUID} from "node:crypto";
import {add} from "date-fns/add"

export const usersService = {
    async createUser(inputUser: InputUserType): Promise<Result<{ id: string } | null>> {
        if (!inputUser.login || !inputUser.password || !inputUser.email) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'login,password,email', message: 'All fields are required'}],
                data: null
            }
        }

        const existingUser = await usersMongoRepository.findByLoginOrEmail({
            loginOrEmail: inputUser.login || inputUser.email,
            password: inputUser.password
        })
        if (existingUser) {
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'login or email', message: 'Login or email is not unique'}],
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
                isConfirmed: true
            }
        }
        const result = await usersMongoRepository.create(createNewUser)
        return {
            status: ResultStatus.Success,
            data: result
        }
    },

    async deleteUserById(id: string): Promise<Result<boolean | null>> {
        const checkId = usersMongoRepository.checkObjectId(id)
        if (!checkId)
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'checkId', message: 'Invalid id'}],
                data: null
            }
        const findUser = await usersMongoRepository.findById(new ObjectId(id))
        if (!findUser)
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'findUser', message: 'User not found'}],
                data: null
            }
        const result = await usersMongoRepository.deleteById(findUser)
        return {
            status: ResultStatus.Success,
            data: result
        }
    }
}