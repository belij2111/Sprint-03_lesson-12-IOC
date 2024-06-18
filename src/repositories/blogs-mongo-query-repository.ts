import {OutputBlogType, QueryBlogFilterType} from "../types/blog-types";
import {BlogDBType} from "../db/blog-db-type";
import {ObjectId} from "mongodb";
import {blogCollection} from "../db/mongo-db";
import {Paginator} from "../common/types/paginator-types";

export const blogsMongoQueryRepository = {
    async getBlogs(inputQuery: QueryBlogFilterType): Promise<Paginator<OutputBlogType[]>> {
        const search = inputQuery.searchNameTerm
            ? {name: {$regex: inputQuery.searchNameTerm, $options: 'i'}}
            : {}
        const filter = {
            ...search,
        }
        const items = await blogCollection
            .find(filter)
            .sort(inputQuery.sortBy, inputQuery.sortDirection)
            .skip((inputQuery.pageNumber - 1) * inputQuery.pageSize)
            .limit(inputQuery.pageSize)
            .map(this.blogMapToOutput)
            .toArray()
        const totalCount = await blogCollection.countDocuments(filter)
        return {
            pagesCount: Math.ceil(totalCount / inputQuery.pageSize),
            page: inputQuery.pageNumber,
            pageSize: inputQuery.pageSize,
            totalCount,
            items
        }
    },

    async getBlogById(id: string): Promise<OutputBlogType | null> {
        if (!this.checkObjectId(id)) return null
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
    },

    checkObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    }
}