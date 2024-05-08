import {Router} from "express";
import {
    createPostController, deletePostByIdController,
    getPostByIdController,
    getPostController,
    updatePostController
} from "../controllers/posts-controller";
import {authMiddleware} from "../middlewares/auth-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middlware";
import {postsInputValidationMiddleware} from "../middlewares/posts-input-validation-middleware";

export const postsRouter = Router()

postsRouter.post('/', authMiddleware, postsInputValidationMiddleware, inputValidationMiddleware, createPostController)
postsRouter.get('/', getPostController)
postsRouter.get('/:id', getPostByIdController)
postsRouter.put('/:id', authMiddleware, postsInputValidationMiddleware, inputValidationMiddleware, updatePostController)
postsRouter.delete('/:id', authMiddleware, inputValidationMiddleware, deletePostByIdController)