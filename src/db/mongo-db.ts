import mongoose from 'mongoose'
import {BlogModel} from "../domain/blog.entity";
import {PostModel, PostSchema} from "../domain/post.entity";
import {CommentModel, CommentSchema} from "../domain/comment.entity";
import {UserModel} from "../domain/user.entity";
import {RefreshTokenModel} from "../domain/refresh-token.entity";
import {ApiCallsModel} from "../domain/api-calls.entity";
import {DeviceSessionsModel} from "../domain/device-sessions.entity";

export const db = {
    async run(DB_URL: string): Promise<boolean> {
        try {
            await mongoose.connect(DB_URL)
            console.log('Connected to db')
            return true
        } catch (e) {
            console.log(e)
            await mongoose.disconnect()
            return false
        }
    },

    async stop() {
        await mongoose.disconnect()
        console.log('Connected  successfully closed')
    },

    async drop() {
        try {
            const collections = mongoose.connection.collections
            for (const key in collections) {
                await collections[key].deleteMany({})
            }
        } catch (e) {
            console.error('Error in drop db', e)
            await this.stop()
        }
    },

    getCollections() {
        return {
            blogCollection: BlogModel,
            postCollection: PostModel,
            userCollection: UserModel,
            commentCollection: CommentModel,
            refreshTokenCollection: RefreshTokenModel,
            apiCallsCollection: ApiCallsModel,
            deviceSessionsCollection: DeviceSessionsModel
        }
    }
}