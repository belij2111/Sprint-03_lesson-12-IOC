import {Request, Response} from "express";
import {commentsMongoQueryRepository} from "../repositories/comments-mongo-query-repository";

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
    }
}