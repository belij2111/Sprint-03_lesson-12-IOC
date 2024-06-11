import {InputBlogType} from "../types/blog-types";
import {BlogDBType} from "../db/blog-db-type";
import {ObjectId} from "mongodb";
import {blogCollection} from "../db/mongo-db";

export const blogsMongoRepository = {
    async create(inputBlog: BlogDBType): Promise<{ id: string }> {
        const result = await blogCollection.insertOne(inputBlog)
        return {id: result.insertedId.toString()}
    },

    async updateById(id: string, inputBlog: InputBlogType): Promise<boolean | null> {
        const filterBlog = await this.findById(new ObjectId(id))
        if (!filterBlog) return null
        await blogCollection.updateOne(filterBlog, {$set: inputBlog})
        return true
    },

    async deleteById(id: string): Promise<boolean | null> {
        const filterBlog = await this.findById(new ObjectId(id))
        if (!filterBlog) return null
        await blogCollection.deleteOne(filterBlog)
        return true
    },

    async findById(id: ObjectId): Promise<BlogDBType | null> {
        return await blogCollection.findOne({_id: id})
    }
}