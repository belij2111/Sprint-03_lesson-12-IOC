import {InputBlogType} from "../types/blog-types";
import {BlogDBType} from "../db/blog-db-type";
import {ObjectId} from "mongodb";
import {blogCollection} from "../db/mongo-db";

export const blogsMongoRepository = {
    async create(inputBlog: BlogDBType): Promise<{ id: string }> {
        const result = await blogCollection.insertOne(inputBlog)
        return {id: result.insertedId.toString()}
    },

    async updateById(findBlog: BlogDBType, inputBlog: InputBlogType): Promise<boolean | null> {
        await blogCollection.updateOne(findBlog, {$set: inputBlog})
        return true
    },

    async deleteById(findBlog: BlogDBType): Promise<boolean | null> {
        await blogCollection.deleteOne(findBlog)
        return true
    },

    async findById(id: ObjectId): Promise<BlogDBType | null> {
        return await blogCollection.findOne({_id: id})
    }
}