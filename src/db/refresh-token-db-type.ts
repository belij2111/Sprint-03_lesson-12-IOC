import {ObjectId} from "mongodb";

export interface RefreshTokenDbType {
    _id: ObjectId,
    refreshToken: string
}