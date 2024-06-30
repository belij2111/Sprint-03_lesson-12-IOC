import {Router} from "express"
import {commentsController} from "../controllers/comments-controller";

export const commentsRouter = Router()

commentsRouter.get('/:id', commentsController.getById)