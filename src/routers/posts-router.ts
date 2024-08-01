import {Router} from "express";
import {postsController} from "../controllers/posts-controller";
import {authBasicMiddleware} from "../common/middlewares/auth-basic-middleware";
import {inputValidationMiddleware} from "../common/middlewares/input-validation-middlware";
import {postsInputValidationMiddleware} from "../validators/posts-input-validation-middleware";
import {authBearerMiddleware} from "../common/middlewares/auth-bearer-middleware";
import {commentsInputValidationMiddleware} from "../validators/comments-input-validation-middleware";

export const postsRouter = Router()

postsRouter.post('/', authBasicMiddleware, postsInputValidationMiddleware, inputValidationMiddleware, postsController.create)
postsRouter.get('/', postsController.get)
postsRouter.get('/:id', postsController.getById)
postsRouter.put('/:id', authBasicMiddleware, postsInputValidationMiddleware, inputValidationMiddleware, postsController.update)
postsRouter.delete('/:id', authBasicMiddleware, inputValidationMiddleware, postsController.deleteById)
postsRouter.post('/:postId/comments', authBearerMiddleware, commentsInputValidationMiddleware, inputValidationMiddleware, postsController.createCommentByPostId)
postsRouter.get('/:postId/comments', postsController.getCommentsByPostId)