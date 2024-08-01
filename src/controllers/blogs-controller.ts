import {Request, Response} from "express";
import {InputBlogType, OutputBlogType} from "../types/blog-types";
import {blogsMongoQueryRepository} from "../repositories/blogs-mongo-query-repository";
import {OutputPostType} from "../types/post-types";
import {postsMongoQueryRepository} from "../repositories/posts-mongo-query-repository";
import {Paginator} from "../common/types/paginator-types";
import {
    SearchNameTermFieldsType,
    searchNameTermUtil,
    SortQueryFieldsType,
    sortQueryFieldsUtil
} from "../common/helpers/sort-query-fields-util";
import {blogsService} from "../services/blogs-service";
import {postsService} from "../services/posts-service";
import {ResultStatus} from "../common/types/result-code";
import {ErrorResponse} from "../common/types/error-response";

export const blogsController = {
    async create(req: Request, res: Response) {
        try {
            const createdInfo = await blogsService.createBlog(req.body)
            if (createdInfo.data && createdInfo.status === ResultStatus.Success) {
                const newBlog = await blogsMongoQueryRepository.getBlogById(createdInfo.data.id)
                res
                    .status(201)
                    .json(newBlog)
                return
            }
        } catch (error) {
            res
                .status(500)
                .json({message: 'blogsController.create'})
        }
    },

    async createPostByBlogId(req: Request, res: Response) {
        try {
            const createdInfo = await postsService.createPostByBlogId(req.params.blogId, req.body)
            if (!createdInfo) {
                res
                    .status(404)
                    .json({message: 'Blog not found'})
                return
            }
            const newPost = await postsMongoQueryRepository.getPostById(createdInfo.id)
            res
                .status(201)
                .json(newPost)
        } catch (error) {
            res
                .status(500)
                .json({message: 'blogsController.createPostByBlogId'})
        }
    },

    async get(req: Request<SortQueryFieldsType & SearchNameTermFieldsType>, res: Response<Paginator<OutputBlogType[]> | ErrorResponse>) {
        try {
            const inputQuery = {
                ...sortQueryFieldsUtil(req.query),
                ...searchNameTermUtil(req.query)
            }
            const allBlogs = await blogsMongoQueryRepository.getBlogs(inputQuery)
            res
                .status(200)
                .json(allBlogs)
        } catch (error) {
            res
                .status(500)
                .json({message: 'blogsController.get'})
        }
    },

    async getById(req: Request, res: Response<OutputBlogType | ErrorResponse>) {
        try {
            const blogId = req.params.id
            const blog = await blogsMongoQueryRepository.getBlogById(blogId)
            if (!blog) {
                res
                    .sendStatus(404)
                return
            }
            res
                .status(200)
                .json(blog)
        } catch (error) {
            res
                .status(500)
                .json({message: 'blogsController.getById'})
        }
    },

    async getPostsByBlogId(req: Request, res: Response<Paginator<OutputPostType[]> | ErrorResponse>) {
        try {
            const postBlogId = req.params.blogId
            const inputQuery = {
                ...sortQueryFieldsUtil(req.query)
            }
            const posts = await postsMongoQueryRepository.getPostsByBlogId(postBlogId, inputQuery)
            if (!posts) {
                res
                    .sendStatus(404)
                return
            }
            res
                .status(200)
                .json(posts)
        } catch (error) {
            res
                .status(500)
                .json({message: 'blogsController.getPostsByBlogId'})
        }
    },

    async updateById(req: Request<{ id: string }, {}, InputBlogType>, res: Response) {
        try {
            const updateBlog = await blogsService.updateBlogById(req.params.id, req.body)
            if (updateBlog.status === ResultStatus.NotFound) {
                res
                    .status(404)
                    .json({errorsMessages: updateBlog.extensions || []})
                return
            }
            res
                .status(204)
                .json({errorsMessages: updateBlog.extensions || []})
        } catch (error) {
            res
                .status(500)
                .json({message: 'blogsController.updateById'})
        }
    },

    async deleteById(req: Request<{ id: string }>, res: Response) {
        try {
            const deleteBlog = await blogsService.deleteBlogById(req.params.id)
            if (deleteBlog.status === ResultStatus.NotFound) {
                res
                    .status(404)
                    .json({errorsMessages: deleteBlog.extensions || []})
                return
            }
            res
                .status(204)
                .json({errorsMessages: deleteBlog.extensions || []})
        } catch (error) {
            res
                .status(500)
                .json({message: 'blogsController.deleteById'})
        }
    }
}


