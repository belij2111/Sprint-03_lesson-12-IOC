import {ObjectId} from "mongodb";
import {userCollection} from "../db/mongo-db";
import {Paginator} from "../common/types/paginator-types";
import {OutputUserType, QueryUserFilterType} from "../types/user-types";
import {UserDbType} from "../db/user-db-type";
import {MeOutputType} from "../types/auth-types";

export const usersMongoQueryRepository = {
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
        const items = await userCollection
            .find(filter)
            .sort(inputQuery.sortBy, inputQuery.sortDirection)
            .skip((inputQuery.pageNumber - 1) * inputQuery.pageSize)
            .limit(inputQuery.pageSize)
            .map(this.userMapToOutput)
            .toArray()
        const totalCount = await userCollection.countDocuments(filter)
        return {
            pagesCount: Math.ceil(totalCount / inputQuery.pageSize),
            page: inputQuery.pageNumber,
            pageSize: inputQuery.pageSize,
            totalCount,
            items
        }
    },

    async getUserById(id: string): Promise<OutputUserType | null> {
        if (!this.checkObjectId(id)) return null
        const user = await this.findById(new ObjectId(id))
        if (!user) return null
        return this.userMapToOutput(user)
    },

    async getAuthUserById(id: string): Promise<MeOutputType | null> {
        if (!this.checkObjectId(id)) return null
        const user = await this.findById(new ObjectId(id))
        if (!user) return null
        return this.authUserMapToOutput(user)
    },

    async findById(id: ObjectId): Promise<UserDbType | null> {
        return await userCollection.findOne({_id: id})
    },

    userMapToOutput(user: UserDbType): OutputUserType {
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    },

    authUserMapToOutput(user: UserDbType): MeOutputType {
        return {
            userId: user._id.toString(),
            login: user.login,
            email: user.email
        }
    },

    checkObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    }
}