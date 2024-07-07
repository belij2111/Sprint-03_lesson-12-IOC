import {ObjectId} from "mongodb";
import {userCollection} from "../db/mongo-db";
import {UserDbType} from "../db/user-db-type";
import {LoginInputType, RegistrationConfirmationCodeInputType} from "../types/auth-types";

export const usersMongoRepository = {
    async create(inputUser: UserDbType): Promise<{ id: string }> {
        const result = await userCollection.insertOne(inputUser)
        return {id: result.insertedId.toString()}
    },

    async deleteById(findUser: UserDbType): Promise<boolean | null> {
        await userCollection.deleteOne(findUser)
        return true
    },

    async findByLoginOrEmail(inputAuth: LoginInputType): Promise<UserDbType | null> {
        const filter = {
            $or: [
                {login: inputAuth.loginOrEmail},
                {email: inputAuth.loginOrEmail},
            ]
        }
        return await userCollection.findOne(filter)
    },

    async findByConfirmationCode(inputCode: RegistrationConfirmationCodeInputType): Promise<UserDbType | null> {
        const filter = {
            confirmationCode: inputCode.code
        }
        return await userCollection.findOne(filter)
    },

    async updateEmailConfirmation(userId: ObjectId, isConfirmed: boolean): Promise<boolean> {
        const result = await userCollection.updateOne(
            {_id: userId},
            {$set: {'emailConfirmation.isConfirmed': isConfirmed}}
        )
        return result.modifiedCount !== 0
    },

    async findById(id: ObjectId): Promise<UserDbType | null> {
        return await userCollection.findOne({_id: id})
    },

    checkObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    }
}