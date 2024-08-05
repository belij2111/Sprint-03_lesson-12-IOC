import mongoose, {Schema} from "mongoose";
import {SETTINGS} from "../settings";
import {ApiCallDbType} from "../db/api-call-db-type";

export const ApiCallsSchema = new mongoose.Schema<ApiCallDbType>({
    ip: {type: String, required: true},
    url: {type: String, required: true},
    date: {type: Date, required: true},
})

export const ApiCallsModel = mongoose.model<ApiCallDbType>(SETTINGS.API_CALLS_COLLECTION_NAME, ApiCallsSchema)