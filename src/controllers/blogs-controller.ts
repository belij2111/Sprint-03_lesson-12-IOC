import {Request, Response} from "express";
import {blogsMongoRepository} from "../repositories/blogs-mongo-repository";
import {InputBlogType, OutputBlogType} from "../types/blog-types";

export const createBlogController = async (req: Request, res: Response) => {
    const createdInfo = await blogsMongoRepository.createBlog(req.body)
    const newBlog = await blogsMongoRepository.getBlogById(createdInfo.id)
    res
        .status(201)
        .json(newBlog)
}

export const getBlogsController = async (req: Request, res: Response<OutputBlogType[]>) => {
    const allBlogs = await blogsMongoRepository.getBlogs()
    res
        .status(200)
        .json(allBlogs)
}

export const getBlogByIdController = async (req: Request, res: Response<OutputBlogType>) => {
    const blogId = req.params.id
    const blog = await blogsMongoRepository.getBlogById(blogId)
    if (!blog) {
        res
            .sendStatus(404)
        return
    }
    res
        .status(200)
        .json(blog)
}

export const updateBlogByIdController = async (req: Request<{ id: string }, {}, InputBlogType>, res: Response) => {
    const updateBlog = await blogsMongoRepository.updateBlogById(req.params.id, req.body)
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
    const deleteBlog = await blogsMongoRepository.deleteBlogById(req.params.id)
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
