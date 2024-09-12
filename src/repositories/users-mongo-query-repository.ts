import {ObjectId} from "mongodb";
import {Paginator} from "../common/types/paginator-types";
import {OutputUserType, QueryUserFilterType} from "../types/user-types";
import {UserDbType} from "../db/user-db-type";
import {MeOutputType} from "../types/auth-types";
import {UserModel} from "../domain/user.entity";
import {injectable} from "inversify";

@injectable()
export class UsersMongoQueryRepository {
    async getUsers(inputQuery: QueryUserFilterType): Promise<Paginator<OutputUserType[]>> {
        const filter = {
            $or: [
                {
                    login: {
                        $regex: inputQuery.searchLoginTerm,
                        $options: 'i'
                    }
                },
                {
                    email: {
                        $regex: inputQuery.searchEmailTerm,
                        $options: 'i'
                    }
                },
            ]
        }
        const items = await UserModel
            .find(filter)
            .sort({[inputQuery.sortBy]: inputQuery.sortDirection})
            .skip((inputQuery.pageNumber - 1) * inputQuery.pageSize)
            .limit(inputQuery.pageSize)
            .lean()
            .exec()
        const totalCount = await UserModel.countDocuments(filter)
        return {
            pagesCount: Math.ceil(totalCount / inputQuery.pageSize),
            page: inputQuery.pageNumber,
            pageSize: inputQuery.pageSize,
            totalCount,
            items: items.map(this.userMapToOutput)
        }
    }

    async getUserById(id: string): Promise<OutputUserType | null> {
        if (!this.checkObjectId(id)) return null
        const user = await this.findById(new ObjectId(id))
        if (!user) return null
        return this.userMapToOutput(user)
    }

    async getAuthUserById(id: string): Promise<MeOutputType | null> {
        if (!this.checkObjectId(id)) return null
        const user = await this.findById(new ObjectId(id))
        if (!user) return null
        return this.authUserMapToOutput(user)
    }

    async findById(id: ObjectId): Promise<UserDbType | null> {
        return UserModel.findOne({_id: id})
    }

    userMapToOutput(user: UserDbType): OutputUserType {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    }

    authUserMapToOutput(user: UserDbType): MeOutputType {
        return {
            userId: user._id.toString(),
            login: user.login,
            email: user.email
        }
    }

    checkObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    }
}