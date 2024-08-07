import {PostDbType} from "../db/post-db-type";
import {BlogDBType} from "../db/blog-db-type";
import {ObjectId} from "mongodb";
import {PostModel} from "../domain/post.entity";
import {BlogModel} from "../domain/blog.entity";

export const postsMongoRepository = {
    async create(inputPost: PostDbType): Promise<{ id: string } | null> {
        const result = await PostModel.create(inputPost)
        return {id: result._id.toString()}
    },

    async createByBlogId(findBlog: PostDbType): Promise<{ id: string } | null> {
        const result = await PostModel.create(findBlog)
        return {id: result._id.toString()}
    },

    async updateById(findPost: PostDbType, updatePost: Object): Promise<boolean | null> {
        const result = await PostModel.updateOne(findPost, {$set: updatePost})
        return result.modifiedCount !== 0
    },

    async deleteById(findPost: PostDbType): Promise<boolean | null> {
        await PostModel.deleteOne(findPost)
        return true
    },

    async findById(id: ObjectId): Promise<PostDbType | null> {
        return PostModel.findOne({_id: id})
    },

    async findBlogById(blogId: string): Promise<BlogDBType | null> {
        return BlogModel.findOne({_id: new ObjectId(blogId)})
    }
}