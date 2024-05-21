import {OutputPostType} from "../types/post-types";
import {PostDbType} from "../db/post-db-type";
import {blogCollection, postCollection} from "../db/mongo-db";
import {BlogDBType} from "../db/blog-db-type";
import {ObjectId} from "mongodb";
import {Paginator} from "../types/paginator-types";

export const postsMongoQueryRepository = {
    async getPost(): Promise<OutputPostType[]> {
        const posts = await postCollection.find({}).toArray()
        return posts.map(this.postMapToOutput)
    },

    async getPostById(id: string): Promise<OutputPostType | null> {
        const post = await this.findById(new ObjectId(id))
        if (!post) return null
        return this.postMapToOutput(post)
    },

    async getPostsByBlogId(blogId: string): Promise<Paginator<OutputPostType[]> | null> {
        const blog = await this.findBlogById(blogId)
        if (!blog) return null
        const byId = blogId ? {blogId: new ObjectId(blogId)} : {}
        const filter = {
            ...byId
        }
        const items = await postCollection
            .find(filter)
            .toArray()
        return {
            // pagesCount: 1,
            // page: 1,
            // pageSize: items.length,
            // totalCount: items.length,
            items: items.map(this.postMapToOutput)
        }
    },

    async findById(id: ObjectId): Promise<PostDbType | null> {
        return await postCollection.findOne({_id: id})
    },

    async findBlogById(blogId: string): Promise<BlogDBType | null> {
        return await blogCollection.findOne({_id: new ObjectId(blogId)})
    },

    postMapToOutput(post: PostDbType): OutputPostType {
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId.toString(),
            blogName: post.blogName,
            createdAt: post.createdAt
        }
    }
}