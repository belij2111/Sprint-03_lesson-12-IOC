import {Router} from "express"
import {
    createBlogController, createPostByBlogIdController, deleteBlogByIdController,
    getBlogByIdController,
    getBlogsController, getPostsByBlogIdController, updateBlogByIdController,
} from "../controllers/blogs-controller"
import {authMiddleware} from "../middlewares/auth-middleware";
import {inputValidationMiddleware, notFoundValidationMiddleware} from "../middlewares/input-validation-middlware";
import {blogsInputValidationMiddleware} from "../middlewares/blogs-input-validation-middleware";
import {
    paramsBlogIdInputValidation,
    postForBlogInputValidationMiddleware
} from "../middlewares/posts-input-validation-middleware";

export const blogsRouter = Router()

blogsRouter.post('/', authMiddleware, blogsInputValidationMiddleware, inputValidationMiddleware, createBlogController)
blogsRouter.get('/', getBlogsController)
blogsRouter.post('/:blogId/posts',
    authMiddleware,
    postForBlogInputValidationMiddleware,
    inputValidationMiddleware,
    paramsBlogIdInputValidation,
    notFoundValidationMiddleware,
    createPostByBlogIdController)
blogsRouter.get('/:blogId/posts', getPostsByBlogIdController)
blogsRouter.get('/:id', getBlogByIdController)
blogsRouter.put('/:id', authMiddleware, blogsInputValidationMiddleware, inputValidationMiddleware, updateBlogByIdController)
blogsRouter.delete('/:id', authMiddleware, inputValidationMiddleware, deleteBlogByIdController)
