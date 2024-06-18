import {InputPostType} from "../types/post-types";
import {PostDbType} from "../db/post-db-type";
import {ObjectId} from "mongodb";
import {dateTimeIsoString} from "../common/helpers/date-time-iso-string";
import {postsMongoRepository} from "../repositories/posts-mongo-repository";

export const postsService = {
    async createPost(inputPost: InputPostType): Promise<{ id: string } | null> {
        const findBlog = await postsMongoRepository.findBlogById(inputPost.blogId)
        if (!findBlog) return null
        const createNewPost: PostDbType = {
            ...inputPost,
            _id: new ObjectId(),
            blogId: findBlog._id,
            blogName: findBlog.name,
            createdAt: dateTimeIsoString()
        }
        return await postsMongoRepository.create(createNewPost)
    },

    async createPostByBlogId(blogId: string, inputPost: InputPostType): Promise<{ id: string } | null> {
        const findBlog = await postsMongoRepository.findBlogById(blogId)
        if (!findBlog) return null
        const createNewPost: PostDbType = {
            ...inputPost,
            _id: new ObjectId(),
            blogId: findBlog._id,
            blogName: findBlog.name,
            createdAt: dateTimeIsoString()
        }
        return await postsMongoRepository.createByBlogId(createNewPost)
    },

    async updatePostById(id: string, inputPost: InputPostType): Promise<boolean | null> {
        const findPost = await postsMongoRepository.findById(new ObjectId(id))
        if (!findPost) return null
        const updatePost = {
            title: inputPost.title,
            shortDescription: inputPost.shortDescription,
            content: inputPost.content
        }
        return await postsMongoRepository.updateById(findPost, updatePost)
    },

    async deletePostById(id: string): Promise<boolean | null> {
        const findPost = await postsMongoRepository.findById(new ObjectId(id))
        if (!findPost) return null
        return await postsMongoRepository.deleteById(findPost)
    },
}