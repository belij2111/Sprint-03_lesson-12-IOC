import {db} from "../db/mongo-db";
import {ApiCallDataInputType} from "../types/auth-types";
import {ApiCallDbType} from "../db/api-call-db-type";

export const authMongoRepository = {
    async addApiCall(apiCall: ApiCallDbType) {
        await db.getCollections().apiCallsCollection.insertOne(apiCall)
    },

    async findApiCalls(apiCallData: ApiCallDataInputType, timeLimit: Date) {
        const filter = {
            ip: apiCallData.ip,
            url: apiCallData.url,
            date: {$gte: timeLimit}
        }
        return await db.getCollections().apiCallsCollection.countDocuments(filter)
    }
}