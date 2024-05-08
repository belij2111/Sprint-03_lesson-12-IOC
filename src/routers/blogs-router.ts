import {Router} from "express"
import {
    createBlogController, deleteBlogByIdController,
    getBlogByIdController,
    getBlogsController, updateBlogByIdController,
} from "../controllers/blogs-controller"
import {authMiddleware} from "../middlewares/auth-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middlware";
import {blogsInputValidationMiddleware} from "../middlewares/blogs-input-validation-middleware";

export const blogsRouter = Router()

blogsRouter.post('/', authMiddleware, blogsInputValidationMiddleware, inputValidationMiddleware, createBlogController)
blogsRouter.get('/', getBlogsController)
blogsRouter.get('/:id', getBlogByIdController)
blogsRouter.put('/:id', authMiddleware, blogsInputValidationMiddleware, inputValidationMiddleware, updateBlogByIdController)
blogsRouter.delete('/:id', authMiddleware, inputValidationMiddleware, deleteBlogByIdController)
