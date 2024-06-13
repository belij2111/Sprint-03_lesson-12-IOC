import {ObjectId} from "mongodb";
import {userCollection} from "../db/mongo-db";
import {UserDbType} from "../db/user-db-type";

export const usersMongoRepository = {
    async create(inputUser: UserDbType): Promise<{ id: string }> {
        const result = await userCollection.insertOne(inputUser)
        return {id: result.insertedId.toString()}
    },

    async deleteById(findUser: UserDbType): Promise<boolean | null> {
        await userCollection.deleteOne(findUser)
        return true
    },

    async findById(id: ObjectId): Promise<UserDbType | null> {
        return await userCollection.findOne({_id: id})
    }
}