import {InputBlogType} from "../types/blog-types";
import {BlogDBType} from "../db/blog-db-type";
import {ObjectId} from "mongodb";
import {BlogModel} from "../domain/blog.entity";

export const blogsMongoRepository = {
    async create(inputBlog: BlogDBType): Promise<{ id: string }> {
        const result = await BlogModel.create(inputBlog)
        return {id: result._id.toString()}
    },

    async updateById(findBlog: BlogDBType, inputBlog: InputBlogType): Promise<boolean | null> {
        await BlogModel.updateOne(findBlog, {$set: inputBlog})
        return true
    },

    async deleteById(findBlog: BlogDBType): Promise<boolean | null> {
        await BlogModel.deleteOne(findBlog)
        return true
    },

    async findById(id: ObjectId): Promise<BlogDBType | null> {
        return BlogModel.findOne({_id: id})
    }
}