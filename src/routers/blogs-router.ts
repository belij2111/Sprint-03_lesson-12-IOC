import {Router} from "express"
import {
    createBlogController, deleteBlogByIdController,
    getBlogByIdController,
    getBlogsController, updateBlogByIdController,
} from "../controllers/blogs-controller"
import {authMiddleware} from "../middlewares/auth-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middlware";

export const blogsRouter = Router()

blogsRouter.post('/', authMiddleware, inputValidationMiddleware, createBlogController)
blogsRouter.get('/', getBlogsController)
blogsRouter.get('/:id', getBlogByIdController)
blogsRouter.put('/:id', authMiddleware, inputValidationMiddleware, updateBlogByIdController)
blogsRouter.delete('/:id', authMiddleware, inputValidationMiddleware, deleteBlogByIdController)
