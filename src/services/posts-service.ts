import {InputPostType} from "../types/post-types";
import {PostDbType} from "../db/post-db-type";
import {ObjectId} from "mongodb";
import {dateTimeIsoString} from "../common/helpers/date-time-iso-string";
import {postsMongoRepository} from "../repositories/posts-mongo-repository";
import {Result} from "../common/types/result-type";
import {ResultStatus} from "../common/types/result-code";

export const postsService = {
    async createPost(inputPost: InputPostType): Promise<Result<{ id: string } | null>> {
        const findBlog = await postsMongoRepository.findBlogById(inputPost.blogId)
        if (!findBlog)
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'findBlog', message: 'Blog not found'}],
                data: null
            }
        const createNewPost: PostDbType = {
            ...inputPost,
            _id: new ObjectId(),
            blogId: findBlog._id,
            blogName: findBlog.name,
            createdAt: dateTimeIsoString()
        }
        const result = await postsMongoRepository.create(createNewPost)
        return {
            status: ResultStatus.Success,
            data: result
        }
    },

    async createPostByBlogId(blogId: string, inputPost: InputPostType): Promise<Result<{ id: string } | null>> {
        const findBlog = await postsMongoRepository.findBlogById(blogId)
        if (!findBlog)
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'findBlog', message: 'Blog not found'}],
                data: null
            }
        const createNewPost: PostDbType = {
            ...inputPost,
            _id: new ObjectId(),
            blogId: findBlog._id,
            blogName: findBlog.name,
            createdAt: dateTimeIsoString()
        }
        const result = await postsMongoRepository.createByBlogId(createNewPost)
        return {
            status: ResultStatus.Success,
            data: result
        }
    },

    async updatePostById(id: string, inputPost: InputPostType): Promise<Result<boolean | null>> {
        const findPost = await postsMongoRepository.findById(new ObjectId(id))
        if (!findPost)
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'findBlog', message: 'Blog not found'}],
                data: null
            }
        const updatePost = {
            title: inputPost.title,
            shortDescription: inputPost.shortDescription,
            content: inputPost.content
        }
        const result = await postsMongoRepository.updateById(findPost, updatePost)
        return {
            status: ResultStatus.Success,
            data: result
        }
    },

    async deletePostById(id: string): Promise<Result<boolean | null>> {
        const findPost = await postsMongoRepository.findById(new ObjectId(id))
        if (!findPost)
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'findPost', message: 'Post not found'}],
                data: null
            }
        const result = await postsMongoRepository.deleteById(findPost)
        return {
            status: ResultStatus.Success,
            data: result
        }
    },
}