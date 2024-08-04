import {InputBlogType} from "../types/blog-types";
import {BlogDBType} from "../db/blog-db-type";
import {ObjectId} from "mongodb";
import {db} from "../db/mongo-db";

export const blogsMongoRepository = {
    async create(inputBlog: BlogDBType): Promise<{ id: string }> {
        const result = await db.getCollections().blogCollection.insertOne(inputBlog)
        return {id: result.insertedId.toString()}
    },

    async updateById(findBlog: BlogDBType, inputBlog: InputBlogType): Promise<boolean | null> {
        await db.getCollections().blogCollection.updateOne(findBlog, {$set: inputBlog})
        return true
    },

    async deleteById(findBlog: BlogDBType): Promise<boolean | null> {
        await db.getCollections().blogCollection.deleteOne(findBlog)
        return true
    },

    async findById(id: ObjectId): Promise<BlogDBType | null> {
        return await db.getCollections().blogCollection.findOne({_id: id})
    }
}