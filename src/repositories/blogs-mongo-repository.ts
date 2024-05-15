import {InputBlogType} from "../types/blog-types";
import {BlogDBType} from "../db/blog-db-type";
import {ObjectId} from "mongodb";
import {blogCollection} from "../db/mongo-db";
import {dateTimeIsoString} from "../helpers/date-time -iso-string";

export const blogsMongoRepository = {
    async createBlog(inputBlog: InputBlogType): Promise<{ id: string }> {
        const createNewBlog: BlogDBType = {
            ...inputBlog,
            _id: new ObjectId(),
            createdAt: dateTimeIsoString(),
            isMembership: false
        }
        const result = await blogCollection.insertOne(createNewBlog)
        return {id: result.insertedId.toString()}
    },

    async updateBlogById(id: string, inputBlog: InputBlogType): Promise<boolean | null> {
        const filterBlog = await this.findById(new ObjectId(id))
        if (!filterBlog) return null
        const updateBlog = {
            $set: {
                name: inputBlog.name,
                description: inputBlog.description,
                websiteUrl: inputBlog.websiteUrl
            }
        }
        await blogCollection.updateOne(filterBlog, updateBlog)
        return true
    },

    async deleteBlogById(id: string): Promise<boolean | null> {
        const filterBlog = await this.findById(new ObjectId(id))
        if (!filterBlog) return null
        await blogCollection.deleteOne(filterBlog)
        return true
    },

    async findById(id: ObjectId): Promise<BlogDBType | null> {
        return await blogCollection.findOne({_id: id})
    }
}