import {Router} from "express";
import {
    createCommentByPostIdController,
    createPostController, deletePostByIdController,
    getPostByIdController,
    getPostController,
    updatePostController
} from "../controllers/posts-controller";
import {authBasicMiddleware} from "../common/middlewares/auth-basic-middleware";
import {inputValidationMiddleware} from "../common/middlewares/input-validation-middlware";
import {postsInputValidationMiddleware} from "../validators/posts-input-validation-middleware";
import {authBearerMiddleware} from "../common/middlewares/auth-bearer-middleware";

export const postsRouter = Router()

postsRouter.post('/', authBasicMiddleware, postsInputValidationMiddleware, inputValidationMiddleware, createPostController)
postsRouter.get('/', getPostController)
postsRouter.get('/:id', getPostByIdController)
postsRouter.put('/:id', authBasicMiddleware, postsInputValidationMiddleware, inputValidationMiddleware, updatePostController)
postsRouter.delete('/:id', authBasicMiddleware, inputValidationMiddleware, deletePostByIdController)
postsRouter.post('/:postId/comments', authBearerMiddleware, inputValidationMiddleware, createCommentByPostIdController)