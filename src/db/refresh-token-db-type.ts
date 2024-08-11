import {ObjectId} from "mongodb";

export class RefreshTokenDbType {
    constructor(
        public _id: ObjectId,
        public refreshToken: string
    ) {
    }
}