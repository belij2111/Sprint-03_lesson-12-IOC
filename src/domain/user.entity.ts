import mongoose, {Schema} from "mongoose";
import {SETTINGS} from "../settings";
import {UserDbType} from "../db/user-db-type";

const EmailConfirmation = new mongoose.Schema({
    confirmationCode: {type: String, required: true},
    expirationDate: {type: Date, required: true},
    isConfirmed: {type: String, required: true}
})

export const UserSchema = new mongoose.Schema<UserDbType>({
    _id: {type: Schema.Types.ObjectId, required: true},
    login: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    createdAt: {type: String, required: true},
    emailConfirmation: {type: EmailConfirmation}
})

export const UserModel = mongoose.model<UserDbType>(SETTINGS.USER_COLLECTION_NAME, UserSchema)