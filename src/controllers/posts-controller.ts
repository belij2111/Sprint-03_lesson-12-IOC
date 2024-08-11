import {Request, Response} from "express"
import {InputPostType, OutputPostType} from "../types/post-types";
import {PostsMongoQueryRepository} from "../repositories/posts-mongo-query-repository";
import {Paginator} from "../common/types/paginator-types";
import {SortQueryFieldsType, sortQueryFieldsUtil} from "../common/helpers/sort-query-fields-util";
import {PostsService} from "../services/posts-service";
import {CommentsService} from "../services/comments-service";
import {ResultStatus} from "../common/types/result-code";
import {
    CommentsMongoQueryRepository
} from "../repositories/comments-mongo-query-repository";
import {OutputCommentType} from "../types/comment-types";

class PostsController {
    private postsService: PostsService
    private postsMongoQueryRepository: PostsMongoQueryRepository
    private commentsService: CommentsService
    private commentsMongoQueryRepository: CommentsMongoQueryRepository

    constructor() {
        this.postsService = new PostsService()
        this.postsMongoQueryRepository = new PostsMongoQueryRepository()
        this.commentsService = new CommentsService()
        this.commentsMongoQueryRepository = new CommentsMongoQueryRepository()
    }

    async create(req: Request, res: Response) {
        try {
            const createdInfo = await this.postsService.createPost(req.body)
            if (createdInfo.status === ResultStatus.NotFound) {
                res
                    .status(404)
                    .json({errorsMessages: createdInfo.extensions || []})
                return
            }
            if (createdInfo.data && createdInfo.status === ResultStatus.Success) {
                const newPost = await this.postsMongoQueryRepository.getPostById(createdInfo.data.id)
                res
                    .status(201)
                    .json(newPost)
                return
            }
        } catch (error) {
            res
                .status(500)
                .json({message: 'postsController.create'})
        }
    }

    async get(req: Request<{}, {}, {}, SortQueryFieldsType>, res: Response<Paginator<OutputPostType[]>>) {
        const inputQuery = {
            ...sortQueryFieldsUtil(req.query)
        }
        const allPosts = await this.postsMongoQueryRepository.getPost(inputQuery)
        res
            .status(200)
            .json(allPosts)
    }

    async getById(req: Request, res: Response<OutputPostType>) {
        const postId = req.params.id
        const post = await this.postsMongoQueryRepository.getPostById(postId)
        if (!post) {
            res
                .sendStatus(404)
            return
        }
        res

            .status(200)
            .json(post)
    }

    async update(req: Request<{ id: string }, {}, InputPostType>, res: Response) {
        try {
            const updatePost = await this.postsService.updatePostById(req.params.id, req.body)
            if (updatePost.status === ResultStatus.NotFound) {
                res
                    .status(404)
                    .json({errorsMessages: updatePost.extensions || []})
                return
            }
            res
                .status(204)
                .json({})
        } catch (error) {
            res
                .status(500)
                .json({message: 'postsController.update'})
        }
    }

    async deleteById(req: Request<{ id: string }>, res: Response) {
        try {
            const deletePost = await this.postsService.deletePostById(req.params.id)
            if (deletePost.status === ResultStatus.NotFound) {
                res
                    .status(404)
                    .json({errorsMessages: deletePost.extensions || []})
                return
            }
            res
                .status(204)
                .json({})
        } catch (error) {
            res
                .status(500)
                .json({message: 'postsController.deleteById'})
        }
    }

    async createCommentByPostId(req: Request, res: Response) {
        try {
            const createdInfo = await this.commentsService.createComment(req.params.postId, req.user.id, req.body)
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
                const newComment = await this.commentsMongoQueryRepository.getCommentById(createdInfo.data.id)
                res
                    .status(201)
                    .json(newComment)
                return
            }
        } catch (error) {
            res
                .status(500)
                .json({message: 'postController.createCommentByPostId'})
        }
    }

    async getCommentsByPostId(req: Request<{
        postId: string
    }, {}, {}, SortQueryFieldsType>, res: Response<Paginator<OutputCommentType[]>>) {
        const inputQuery = {
            ...sortQueryFieldsUtil(req.query)
        }
        const postId = req.params.postId
        const comments = await this.commentsMongoQueryRepository.getCommentsByPostId(postId, inputQuery)
        if (!comments) {
            res
                .sendStatus(404)
            return
        }
        res
            .status(200)
            .json(comments)
    }
}

export const postsController = new PostsController()