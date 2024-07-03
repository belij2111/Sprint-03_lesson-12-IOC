import {Request, Response} from "express";
import {commentsMongoQueryRepository} from "../repositories/comments-mongo-query-repository";
import {InputCommentType} from "../types/comment-types";
import {commentsService} from "../services/comments-service";
import {ResultStatus} from "../common/types/result-code";

export const commentsController = {
    async getById(req: Request<{ id: string }>, res: Response) {
        try {
            const getComment = await commentsMongoQueryRepository.getCommentById(req.params.id)
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
    },

    async update(req: Request<{ commentId: string }, {}, InputCommentType>, res: Response) {
        try {
            const updateComment = await commentsService.updateComment(req.params.commentId, req.body, req.user.id)
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
}