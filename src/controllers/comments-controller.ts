import {Request, Response} from "express";
import {
    CommentsMongoQueryRepository
} from "../repositories/comments-mongo-query-repository";
import {InputCommentType} from "../types/comment-types";
import {CommentsService} from "../services/comments-service";
import {ResultStatus} from "../common/types/result-code";
import {InputLikeType} from "../types/like-types";
import {inject, injectable} from "inversify";

@injectable()
export class CommentsController {
    constructor(
        @inject(CommentsMongoQueryRepository) private commentsMongoQueryRepository: CommentsMongoQueryRepository,
        @inject(CommentsService) private commentsService: CommentsService
    ) {
    }

    async getById(req: Request<{ id: string }>, res: Response) {
        try {
            const userId = req.user ? req.user.id : null
            const getComment = await this.commentsMongoQueryRepository.getCommentById(req.params.id, userId)
            if (!getComment) {
                res
                    .status(404)
                    .json({})
                return
            }
            res
                .status(200)
                .json(getComment)

        } catch (error) {
            res
                .status(500)
                .json({message: 'commentsController.getById'})
        }
    }

    async update(req: Request<{ commentId: string }, {}, InputCommentType>, res: Response) {
        try {
            const updateComment = await this.commentsService.updateComment(req.params.commentId, req.body, req.user.id)
            if (updateComment.status === ResultStatus.NotFound) {
                res
                    .status(404)
                    .json({errorsMessages: updateComment.extensions || []})
                return
            }
            if (updateComment.status === ResultStatus.Forbidden) {
                res
                    .status(403)
                    .json({errorsMessages: updateComment.extensions || []})
                return
            }
            res
                .status(204)
                .json({})
        } catch (error) {
            res
                .status(500)
                .json({message: 'commentController.update'})
        }
    }

    async delete(req: Request<{ commentId: string }>, res: Response) {
        try {
            const deleteComment = await this.commentsService.deleteCommentById(req.params.commentId, req.user.id)
            if (deleteComment.status === ResultStatus.BadRequest) {
                res
                    .status(400)
                    .json({errorsMessages: deleteComment.extensions || []})
                return
            }
            if (deleteComment.status === ResultStatus.NotFound) {
                res
                    .status(404)
                    .json({errorsMessages: deleteComment.extensions || []})
                return
            }
            if (deleteComment.status === ResultStatus.Forbidden) {
                res
                    .status(403)
                    .json({errorsMessages: deleteComment.extensions || []})
                return
            }
            res
                .status(204)
                .json({})
        } catch (error) {
            res
                .status(500)
                .json({message: 'commentController.update'})
        }
    }

    async updateLikeStatus(req: Request<{ commentId: string }, {}, InputLikeType>, res: Response) {
        try {
            const updateStatus = await this.commentsService.updateLikeStatus(req.params.commentId, req.body, req.user.id)
            if (updateStatus.status === ResultStatus.NotFound) {
                res
                    .status(404)
                    .json({errorsMessages: updateStatus.extensions || []})
                return
            }
            res
                .status(204)
                .json({})
        } catch (error) {
            res
                .status(500)
                .json({message: 'commentController.updateLikeStatus'})
        }
    }
}