import {Request, Response} from "express"
import {InputPostType, OutputPostType} from "../types/post-types";
import {postsMongoQueryRepository} from "../repositories/posts-mongo-query-repository";
import {Paginator} from "../common/types/paginator-types";
import {SortQueryFieldsType, sortQueryFieldsUtil} from "../common/helpers/sort-query-fields-util";
import {postsService} from "../services/posts-service";
import {commentsService} from "../services/comments-service";
import {ResultStatus} from "../common/types/result-code";
import {commentsMongoQueryRepository} from "../repositories/comments-mongo-query-repository";
import {OutputCommentType} from "../types/comment-types";

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

export const createCommentByPostIdController = async (req: Request, res: Response) => {
    try {
        const createdInfo = await commentsService.createComment(req.params.postId, req.user.id, req.body)
        if (createdInfo.status === ResultStatus.Unauthorized) {
            res
                .status(401)
                .json({errorsMessages: createdInfo.extensions || []})
            return
        }
        if (createdInfo.status === ResultStatus.NotFound) {
            res
                .status(404)
                .json({errorsMessages: createdInfo.extensions || []})
            return
        }
        if (createdInfo.data && createdInfo.status === ResultStatus.Success) {
            const newComment = await commentsMongoQueryRepository.getCommentById(createdInfo.data.id)
            res
                .status(201)
                .json(newComment)
            return
        }
    } catch (error) {
        res
            .status(500)
            .json({message: 'createCommentByPostIdController'})
    }
}

export const getCommentsByPostIdController = async (req: Request<{
    postId: string
}, {}, {}, SortQueryFieldsType>, res: Response<Paginator<OutputCommentType[]>>) => {
    const inputQuery = {
        ...sortQueryFieldsUtil(req.query)
    }
    const postId = req.params.postId
    const comments = await commentsMongoQueryRepository.getCommentsByPostId(postId, inputQuery)
    if (!comments) {
        res
            .sendStatus(404)
        return
    }
    res
        .status(200)
        .json(comments)
}