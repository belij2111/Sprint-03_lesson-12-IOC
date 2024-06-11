import {InputBlogType} from "../types/blog-types";
import {BlogDBType} from "../db/blog-db-type";
import {ObjectId} from "mongodb";
import {blogCollection} from "../db/mongo-db";
import {dateTimeIsoString} from "../helpers/date-time -iso-string";
import {blogsMongoRepository} from "../repositories/blogs-mongo-repository";

export const blogsService = {
    async createBlog(inputBlog: InputBlogType): Promise<{ id: string }> {
        const createNewBlog: BlogDBType = {
            ...inputBlog,
            _id: new ObjectId(),
            createdAt: dateTimeIsoString(),
            isMembership: false
        }
        return await blogsMongoRepository.create(createNewBlog)
    },

    async updateBlogById(id: string, inputBlog: InputBlogType): Promise<boolean | null> {
        const updateBlog = {
            name: inputBlog.name,
            description: inputBlog.description,
            websiteUrl: inputBlog.websiteUrl
        }
        return await blogsMongoRepository.updateById(id, updateBlog)
    },

    async deleteBlogById(id: string): Promise<boolean | null> {
        return await blogsMongoRepository.deleteById(id)
    },

    async findById(id: ObjectId): Promise<BlogDBType | null> {
        return await blogCollection.findOne({_id: id})
    }
}