import {InputBlogType, OutputBlogType} from "../types/blog-types";
import {BlogDBType} from "../db/blog-db-type";
import {ObjectId} from "mongodb";
import {blogCollection} from "../db/mongo-db";

export const blogsMongoRepository = {

    async createBlog(inputBlog: InputBlogType): Promise<{ id: string }> {
        const createNewBlog: BlogDBType = {
            ...inputBlog,
            _id: new ObjectId(),
            createdAt: new Date().toISOString(),
            isMembership: true
        }
        console.log(createNewBlog)
        const result = await blogCollection.insertOne(createNewBlog)
        return {id: result.insertedId.toHexString()}
    },

    async getBlogById(id: string): Promise<OutputBlogType | null> {
        const blog = await this.findById(new ObjectId(id))
        if (!blog) return null
        return this.blogMapToOutput(blog)
    },

    async findById(id: ObjectId): Promise<BlogDBType | null> {
        return await blogCollection.findOne({_id: id})
    },

    blogMapToOutput(blog: BlogDBType): OutputBlogType {
        return {
            id: blog._id.toHexString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }
    }
}