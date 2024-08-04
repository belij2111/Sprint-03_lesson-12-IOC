import {Db, MongoClient} from "mongodb"
import {SETTINGS} from "../settings"
import {BlogDBType} from "./blog-db-type";
import {PostDbType} from "./post-db-type";
import {UserDbType} from "./user-db-type";
import {CommentDbType} from "./comment-db-type";
import {RefreshTokenDbType} from "./refresh-token-db-type";
import {ApiCallDbType} from "./api-call-db-type";
import {DeviceSessionsDbType} from "./device-sessions-db-type";

export const db = {
    client: {} as MongoClient,
    getDbName(): Db {
        return this.client.db(SETTINGS.DB_NAME)
    },

    async run(DB_URL: string): Promise<boolean> {
        try {
            this.client = new MongoClient(DB_URL)
            await this.client.connect()
            await this.getDbName().command({ping: 1})
            console.log('Connected to db')
            return true
        } catch (e) {
            console.log(e)
            await this.client.close()
            return false
        }
    },

    async stop() {
        await this.client.close()
        console.log('Connected  successfully closed')
    },

    async drop() {
        try {
            const collections = await this.getDbName().listCollections().toArray()
            for (const collection of collections) {
                const collectionName = collection.name
                await this.getDbName().collection(collectionName).deleteMany({})
            }
        } catch (e) {
            console.error('Error in drop db', e)
            await this.stop()
        }
    },

    getCollections() {
        return {
            blogCollection: this.getDbName().collection<BlogDBType>(SETTINGS.BLOG_COLLECTION_NAME as string),
            postCollection: this.getDbName().collection<PostDbType>(SETTINGS.POST_COLLECTION_NAME as string),
            userCollection: this.getDbName().collection<UserDbType>(SETTINGS.USER_COLLECTION_NAME as string),
            commentCollection: this.getDbName().collection<CommentDbType>(SETTINGS.COMMENT_COLLECTION_NAME as string),
            refreshTokenCollection: this.getDbName().collection<RefreshTokenDbType>(SETTINGS.REFRESH_TOKEN_COLLECTION_NAME as string),
            apiCallsCollection: this.getDbName().collection<ApiCallDbType>(SETTINGS.API_CALLS_COLLECTION_NAME as string),
            deviceSessionsCollection: this.getDbName().collection<DeviceSessionsDbType>(SETTINGS.DEVICE_SESSIONS_COLLECTION_NAME as string)
        }
    }
}