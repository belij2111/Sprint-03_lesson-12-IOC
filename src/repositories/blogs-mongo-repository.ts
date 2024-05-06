import {InputBlogType, OutputBlogType} from "../types/blog-types";
import {BlogDBType} from "../db/blog-db-type";
import {ObjectId} from "mongodb";
import {blogCollection} from "../db/mongo-db";
import {dateTimeIsoString} from "../helpers/date-time -iso-string";

export const blogsMongoRepository = {
    async getBlogs(): Promise<OutputBlogType[]> {
        const blogs = await blogCollection.find({}).toArray()
        return blogs.map(this.blogMapToOutput)
    },

    async createBlog(inputBlog: InputBlogType): Promise<{ id: string }> {
        const createNewBlog: BlogDBType = {
            ...inputBlog,
            _id: new ObjectId(),
            createdAt: dateTimeIsoString(),
            isMembership: true
        }
        console.log(createNewBlog)
        const result = await blogCollection.insertOne(createNewBlog)
        return {id: result.insertedId.toString()}
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
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }
    }
}