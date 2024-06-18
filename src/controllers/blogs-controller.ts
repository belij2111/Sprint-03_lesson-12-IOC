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

export const createBlogController = async (req: Request, res: Response) => {
    const createdInfo = await blogsService.createBlog(req.body)
    const newBlog = await blogsMongoQueryRepository.getBlogById(createdInfo.id)
    res
        .status(201)
        .json(newBlog)
}

export const createPostByBlogIdController = async (req: Request, res: Response) => {
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
}

export const getBlogsController = async (req: Request<SortQueryFieldsType & SearchNameTermFieldsType>, res: Response<Paginator<OutputBlogType[]>>) => {
    const inputQuery = {
        ...sortQueryFieldsUtil(req.query),
        ...searchNameTermUtil(req.query)
    }
    const allBlogs = await blogsMongoQueryRepository.getBlogs(inputQuery)
    res
        .status(200)
        .json(allBlogs)
}

export const getBlogByIdController = async (req: Request, res: Response<OutputBlogType>) => {
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
}

export const getPostsByBlogIdController = async (req: Request, res: Response<Paginator<OutputPostType[]>>) => {
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
}

export const updateBlogByIdController = async (req: Request<{ id: string }, {}, InputBlogType>, res: Response) => {
    const updateBlog = await blogsService.updateBlogById(req.params.id, req.body)
    if (!updateBlog) {
        res
            .status(404)
            .json({message: 'Blog not found'})
        return
    }
    res
        .status(204)
        .json({message: "successfully updated"})
}

export const deleteBlogByIdController = async (req: Request<{ id: string }>, res: Response) => {
    const deleteBlog = await blogsService.deleteBlogById(req.params.id)
    if (!deleteBlog) {
        res
            .status(404)
            .json({message: 'Blog not found'})
        return
    }
    res
        .status(204)
        .json({message: 'Blog deleted successfully'})
}
