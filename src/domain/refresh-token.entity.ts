import mongoose, {Schema} from "mongoose";
import {SETTINGS} from "../settings";
import {RefreshTokenDbType} from "../db/refresh-token-db-type";

export const RefreshTokenSchema = new mongoose.Schema<RefreshTokenDbType>({
    _id: {type: Schema.Types.ObjectId, required: true},
    refreshToken: {type: String, required: true},
})

export const RefreshTokenModel = mongoose.model<RefreshTokenDbType>(SETTINGS.COLLECTION_NAME.REFRESH_TOKEN, RefreshTokenSchema)