import {Request, Response} from "express";
import {blogsMongoRepository} from "../repositories/blogs-mongo-repository";

export const createBlogController = async (req: Request, res: Response) => {
    const createdInfo = await blogsMongoRepository.createBlog(req.body)
    const newBlog = await blogsMongoRepository.getBlogById(createdInfo.id)
    res
        .status(201)
        .json(newBlog)
}