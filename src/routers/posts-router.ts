import {Router} from "express";
import {
    createPostController,
    getPostByIdController,
    getPostController,
    updatePostController
} from "../controllers/posts-controller";

export const postsRouter = Router()

postsRouter.post('/', createPostController)
postsRouter.get('/', getPostController)
postsRouter.get('/:id', getPostByIdController)
postsRouter.put('/:id', updatePostController)