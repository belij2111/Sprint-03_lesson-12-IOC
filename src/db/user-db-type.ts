import {ObjectId} from "mongodb";

export class UserDbType {
    constructor(
        public _id: ObjectId,
        public login: string,
        public password: string,
        public email: string,
        public createdAt: string,
        public emailConfirmation: {
            confirmationCode: string,
            expirationDate: Date,
            isConfirmed: boolean
        }
    ) {
    }
}