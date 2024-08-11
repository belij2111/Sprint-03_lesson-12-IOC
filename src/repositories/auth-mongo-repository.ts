import {ApiCallDataInputType} from "../types/auth-types";
import {ApiCallDbType} from "../db/api-call-db-type";
import {ApiCallsModel} from "../domain/api-calls.entity";

export class AuthMongoRepository {
    async addApiCall(apiCall: ApiCallDbType) {
        await ApiCallsModel.create(apiCall)
    }

    async findApiCalls(apiCallData: ApiCallDataInputType, timeLimit: Date) {
        const filter = {
            ip: apiCallData.ip,
            url: apiCallData.url,
            date: {$gte: timeLimit}
        }
        return ApiCallsModel.countDocuments(filter);
    }
}