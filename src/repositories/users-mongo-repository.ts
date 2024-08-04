import {ObjectId} from "mongodb";
import {db} from "../db/mongo-db";
import {UserDbType} from "../db/user-db-type";
import {
    LoginInputType,
    RegistrationConfirmationCodeInputType,
    RegistrationEmailResendingInputType
} from "../types/auth-types";

export const usersMongoRepository = {
    async create(inputUser: UserDbType): Promise<{ id: string }> {
        const result = await db.getCollections().userCollection.insertOne(inputUser)
        return {id: result.insertedId.toString()}
    },

    async deleteById(findUser: UserDbType): Promise<boolean | null> {
        await db.getCollections().userCollection.deleteOne(findUser)
        return true
    },

    async findByLoginOrEmail(inputAuth: LoginInputType): Promise<UserDbType | null> {
        const filter = {
            $or: [
                {login: inputAuth.loginOrEmail},
                {email: inputAuth.loginOrEmail},
            ]
        }
        return await db.getCollections().userCollection.findOne(filter)
    },

    async findByEmail(inputEmail: RegistrationEmailResendingInputType): Promise<UserDbType | null> {
        const filter = {
            email: inputEmail.email
        }
        return await db.getCollections().userCollection.findOne(filter)
    },

    async findByConfirmationCode(inputCode: RegistrationConfirmationCodeInputType): Promise<UserDbType | null> {
        const filter = {
            'emailConfirmation.confirmationCode': inputCode.code,
            'emailConfirmation.expirationDate': {$gt: new Date()},
            'emailConfirmation.isConfirmed': false
        }
        return await db.getCollections().userCollection.findOne(filter)
    },

    async findByRecoveryCode(inputCode: string): Promise<UserDbType | null> {
        const filter = {
            'emailConfirmation.confirmationCode': inputCode
        }
        return await db.getCollections().userCollection.findOne(filter)
    },

    async updateEmailConfirmation(userId: ObjectId, isConfirmed: boolean): Promise<boolean> {
        const result = await db.getCollections().userCollection.updateOne(
            {_id: userId},
            {$set: {'emailConfirmation.isConfirmed': isConfirmed}}
        )
        return result.modifiedCount !== 0
    },

    async updateRegistrationConfirmation(userId: ObjectId, code: string, expirationDate: Date) {
        const result = await db.getCollections().userCollection.updateOne(
            {_id: userId},
            {
                $set: {
                    'emailConfirmation.confirmationCode': code,
                    'emailConfirmation.expirationDate': expirationDate
                }
            }
        )
        return result.modifiedCount !== 0
    },

    async updatePassword(userId: ObjectId, password: string): Promise<boolean> {
        const result = await db.getCollections().userCollection.updateOne(
            {_id: userId},
            {$set: {password: password}}
        )
        return result.modifiedCount !== 0
    },

    async findById(id: ObjectId): Promise<UserDbType | null> {
        return await db.getCollections().userCollection.findOne({_id: id})
    },

    checkObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    }
}