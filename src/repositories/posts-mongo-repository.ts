import {PostDbType} from "../db/post-db-type";
import {db} from "../db/mongo-db";
import {BlogDBType} from "../db/blog-db-type";
import {ObjectId} from "mongodb";

export const postsMongoRepository = {
    async create(inputPost: PostDbType): Promise<{ id: string } | null> {
        const result = await db.getCollections().postCollection.insertOne(inputPost)
        return {id: result.insertedId.toString()}
    },

    async createByBlogId(findBlog: PostDbType): Promise<{ id: string } | null> {
        const result = await db.getCollections().postCollection.insertOne(findBlog)
        return {id: result.insertedId.toString()}
    },

    async updateById(findPost: PostDbType, updatePost: Object): Promise<boolean | null> {
        const result = await db.getCollections().postCollection.updateOne(findPost, {$set: updatePost})
        return result.modifiedCount !== 0
    },

    async deleteById(findPost: PostDbType): Promise<boolean | null> {
        await db.getCollections().postCollection.deleteOne(findPost)
        return true
    },

    async findById(id: ObjectId): Promise<PostDbType | null> {
        return await db.getCollections().postCollection.findOne({_id: id})
    },

    async findBlogById(blogId: string): Promise<BlogDBType | null> {
        return await db.getCollections().blogCollection.findOne({_id: new ObjectId(blogId)})
    }
}