import {ObjectId} from "mongodb";
import {userCollection} from "../db/mongo-db";
import {UserDbType} from "../db/user-db-type";
import {LoginInputType} from "../types/auth-types";

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

    async findById(id: ObjectId): Promise<UserDbType | null> {
        return await userCollection.findOne({_id: id})
    }
}