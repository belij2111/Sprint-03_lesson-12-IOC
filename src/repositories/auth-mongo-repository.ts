import {refreshTokenCollection} from "../db/mongo-db";
import {RefreshTokenDbType} from "../db/refresh-token-db-type";

export const authMongoRepository = {
    async findInBlackList(token: RefreshTokenDbType) {
        return await refreshTokenCollection.findOne(token)
    },

    async addToBlackList(token: RefreshTokenDbType) {
        return await refreshTokenCollection.insertOne(token)
    }
}