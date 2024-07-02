import {Router} from "express";
import {
    createCommentByPostIdController,
    createPostController, deletePostByIdController, getCommentsByPostIdController,
    getPostByIdController,
    getPostController,
    updatePostController
} from "../controllers/posts-controller";
import {authBasicMiddleware} from "../common/middlewares/auth-basic-middleware";
import {inputValidationMiddleware} from "../common/middlewares/input-validation-middlware";
import {postsInputValidationMiddleware} from "../validators/posts-input-validation-middleware";
import {authBearerMiddleware} from "../common/middlewares/auth-bearer-middleware";
import {commentsInputValidationMiddleware} from "../validators/comments-input-validation-middleware";

export const postsRouter = Router()

postsRouter.post('/', authBasicMiddleware, postsInputValidationMiddleware, inputValidationMiddleware, createPostController)
postsRouter.get('/', getPostController)
postsRouter.get('/:id', getPostByIdController)
postsRouter.put('/:id', authBasicMiddleware, postsInputValidationMiddleware, inputValidationMiddleware, updatePostController)
postsRouter.delete('/:id', authBasicMiddleware, inputValidationMiddleware, deletePostByIdController)
postsRouter.post('/:postId/comments', authBearerMiddleware, commentsInputValidationMiddleware, inputValidationMiddleware, createCommentByPostIdController)
postsRouter.get('/:postId/comments', getCommentsByPostIdController)