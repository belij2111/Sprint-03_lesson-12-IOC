import {ObjectId} from "mongodb";
import {dateTimeIsoString} from "../helpers/date-time -iso-string";
import {InputUserType} from "../types/user-types";
import {UserDbType} from "../db/user-db-type";
import {usersMongoRepository} from "../repositories/users-mongo-repository";

export const usersService = {
    async createUser(inputUser: InputUserType): Promise<{ id: string }> {
        const createNewUser: UserDbType = {
            ...inputUser,
            _id: new ObjectId(),
            createdAt: dateTimeIsoString()
        }
        return await usersMongoRepository.create(createNewUser)
    },

    async deleteUserById(id: string): Promise<boolean | null> {
        const findUser = await usersMongoRepository.findById(new ObjectId(id))
        if (!findUser) return null
        return await usersMongoRepository.deleteById(findUser)
    }
}