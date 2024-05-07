import {postsMongoRepository} from "../repositories/posts-mongo-repository"
import {Request, Response} from "express"
import {InputPostType, OutputPostType} from "../types/post-types";

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

export const updatePostController = async (req: Request<{ id: string }, {}, InputPostType>, res: Response) => {
    const updatePost = await postsMongoRepository.updatePostById(req.params.id, req.body)
    if (!updatePost) {
        res
            .status(404)
            .json({message: 'Post not found'})
        return
    }
    res
        .status(204)
        .json({message: "successfully updated"})
}

export const deletePostByIdController = async (req: Request<{ id: string }>, res: Response) => {
    const deletePost = await postsMongoRepository.deletePostById(req.params.id)
    if (!deletePost) {
        res
            .status(404)
            .json({message: 'Post not found'})
        return
    }
    res
        .status(204)
        .json({message: 'Blog deleted successfully'})
}