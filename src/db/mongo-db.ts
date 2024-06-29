import {Collection, Db, MongoClient} from "mongodb"
import {SETTINGS} from "../settings"
import {BlogDBType} from "./blog-db-type";
import {PostDbType} from "./post-db-type";
import {UserDbType} from "./user-db-type";
import {CommentDbType} from "./comment-db-type";

let client = {} as MongoClient
export let db = {} as Db

export let blogCollection: Collection<BlogDBType> = {} as Collection<BlogDBType>
export let postCollection: Collection<PostDbType> = {} as Collection<PostDbType>
export let userCollection: Collection<UserDbType> = {} as Collection<UserDbType>
export let commentCollection: Collection<CommentDbType> = {} as Collection<CommentDbType>

export const connectToDb = async (DB_URL: string) => {
    try {
        client = new MongoClient(DB_URL)
        db = client.db(SETTINGS.DB_NAME)
        blogCollection = db.collection<BlogDBType>(SETTINGS.BLOG_COLLECTION_NAME)
        postCollection = db.collection<PostDbType>(SETTINGS.POST_COLLECTION_NAME)
        userCollection = db.collection<UserDbType>(SETTINGS.USER_COLLECTION_NAME)
        commentCollection = db.collection<CommentDbType>(SETTINGS.COMMENT_COLLECTION_NAME)
        await client.connect()
        console.log('Connected to db')
        return true
    } catch (e) {
        console.log(e)
        await client.close()
        return false
    }
}