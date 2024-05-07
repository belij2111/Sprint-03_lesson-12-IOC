import {postsMongoRepository} from "../repositories/posts-mongo-repository"
import {Request, Response} from "express"
import {OutputPostType} from "../types/post-types";

export const createPostController = async (req: Request, res: Response) => {
    const createdInfo = await postsMongoRepository.createPost(req.body)
    if (!createdInfo) {
        res
            .status(404)
            .json({message: 'Blog not found'})
        return
    }
    const newPost = await postsMongoRepository.getPostById(createdInfo.id)
    res
        .status(201)
        .json(newPost)
}

export const getPostController = async (req: Request, res: Response<OutputPostType[]>) => {
    const allPosts = await postsMongoRepository.getPost()
    res
        .status(200)
        .json(allPosts)
}

export const getPostByIdController = async (req: Request, res: Response<OutputPostType>) => {
    const postId = req.params.id
    const post = await postsMongoRepository.getPostById(postId)
    if (!post) {
        res
            .sendStatus(404)
        return
    }
    res
        .status(200)
        .json(post)
}