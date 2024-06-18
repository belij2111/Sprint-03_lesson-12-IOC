import {Request, Response} from "express"
import {InputPostType, OutputPostType} from "../types/post-types";
import {postsMongoQueryRepository} from "../repositories/posts-mongo-query-repository";
import {Paginator} from "../types/paginator-types";
import {SortQueryFieldsType, sortQueryFieldsUtil} from "../common/helpers/sort-query-fields-util";
import {postsService} from "../services/posts-service";

export const createPostController = async (req: Request, res: Response) => {
    const createdInfo = await postsService.createPost(req.body)
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

export const getPostController = async (req: Request<{}, {}, {}, SortQueryFieldsType>, res: Response<Paginator<OutputPostType[]>>) => {
    const inputQuery = {
        ...sortQueryFieldsUtil(req.query)
    }
    const allPosts = await postsMongoQueryRepository.getPost(inputQuery)
    res
        .status(200)
        .json(allPosts)
}

export const getPostByIdController = async (req: Request, res: Response<OutputPostType>) => {
    const postId = req.params.id
    const post = await postsMongoQueryRepository.getPostById(postId)
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
    const updatePost = await postsService.updatePostById(req.params.id, req.body)
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
    const deletePost = await postsService.deletePostById(req.params.id)
    if (!deletePost) {
        res
            .status(404)
            .json({message: 'Post not found'})
        return
    }
    res
        .status(204)
        .json({message: 'Post deleted successfully'})
}