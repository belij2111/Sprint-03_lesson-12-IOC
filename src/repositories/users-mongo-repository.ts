import {ObjectId} from "mongodb";
import {UserDbType} from "../db/user-db-type";
import {
    LoginInputType,
    RegistrationConfirmationCodeInputType,
    RegistrationEmailResendingInputType
} from "../types/auth-types";
import {UserModel} from "../domain/user.entity";
import {injectable} from "inversify";

@injectable()
export class UsersMongoRepository {
    async create(inputUser: UserDbType): Promise<{ id: string }> {
        const result = await UserModel.create(inputUser)
        return {id: result._id.toString()}
    }

    async deleteById(findUser: UserDbType): Promise<boolean | null> {
        await UserModel.deleteOne(findUser)
        return true
    }

    async findByLoginOrEmail(inputAuth: LoginInputType): Promise<UserDbType | null> {
        const filter = {
            $or: [
                {login: inputAuth.loginOrEmail},
                {email: inputAuth.loginOrEmail},
            ]
        }
        return UserModel.findOne(filter)
    }

    async findByEmail(inputEmail: RegistrationEmailResendingInputType): Promise<UserDbType | null> {
        const filter = {
            email: inputEmail.email
        }
        return UserModel.findOne(filter)
    }

    async findByConfirmationCode(inputCode: RegistrationConfirmationCodeInputType): Promise<UserDbType | null> {
        const filter = {
            'emailConfirmation.confirmationCode': inputCode.code,
            'emailConfirmation.expirationDate': {$gt: new Date()},
            'emailConfirmation.isConfirmed': false
        }
        return UserModel.findOne(filter)
    }

    async findByRecoveryCode(inputCode: string): Promise<UserDbType | null> {
        const filter = {
            'emailConfirmation.confirmationCode': inputCode
        }
        return UserModel.findOne(filter)
    }

    async updateEmailConfirmation(userId: ObjectId, isConfirmed: boolean): Promise<boolean> {
        const result = await UserModel.updateOne(
            {_id: userId},
            {$set: {'emailConfirmation.isConfirmed': isConfirmed}}
        )
        return result.modifiedCount !== 0
    }

    async updateRegistrationConfirmation(userId: ObjectId, code: string, expirationDate: Date) {
        const result = await UserModel.updateOne(
            {_id: userId},
            {
                $set: {
                    'emailConfirmation.confirmationCode': code,
                    'emailConfirmation.expirationDate': expirationDate
                }
            }
        )
        return result.modifiedCount !== 0
    }

    async updatePassword(userId: ObjectId, password: string): Promise<boolean> {
        const result = await UserModel.updateOne(
            {_id: userId},
            {$set: {password: password}}
        )
        return result.modifiedCount !== 0
    }

    async findById(id: ObjectId): Promise<UserDbType | null> {
        return UserModel.findOne({_id: id})
    }

    checkObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    }
}