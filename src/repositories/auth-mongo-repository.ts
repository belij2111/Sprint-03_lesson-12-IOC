import {apiCallsCollection, refreshTokenCollection} from "../db/mongo-db";
import {RefreshTokenDbType} from "../db/refresh-token-db-type";
import {ObjectId} from "mongodb";
import {ApiCallDataInputType} from "../types/auth-types";
import {ApiCallDbType} from "../db/api-call-db-type";

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
    },

    async addApiCall(apiCall: ApiCallDbType) {
        await apiCallsCollection.insertOne(apiCall)
    },

    async findApiCalls(apiCallData: ApiCallDataInputType, timeLimit: Date) {
        const filter = {
            ip: apiCallData.ip,
            url: apiCallData.url,
            date: {$gte: timeLimit}
        }
        return await apiCallsCollection.countDocuments(filter)
    }
}