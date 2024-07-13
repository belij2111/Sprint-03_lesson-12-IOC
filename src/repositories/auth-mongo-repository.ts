import {refreshTokenCollection} from "../db/mongo-db";
import {RefreshTokenDbType} from "../db/refresh-token-db-type";
import {ObjectId} from "mongodb";

export const authMongoRepository = {
    async findInBlackList(refreshToken: string) {
        return await refreshTokenCollection.findOne({refreshToken})
    },

    async addToBlackList(refreshToken: string) {
        const tokenWithId: RefreshTokenDbType = {
            _id: new ObjectId(),
            refreshToken
        }
        return await refreshTokenCollection.insertOne(tokenWithId)
    }
}