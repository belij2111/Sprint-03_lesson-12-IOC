import {ObjectId} from "mongodb";

export interface UserDbType {
    _id: ObjectId,
    login: string,
    password: string,
    email: string,
    createdAt: string
}