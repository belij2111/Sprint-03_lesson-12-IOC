import {Router} from "express"
import {
    createBlogController, createPostByBlogIdController, deleteBlogByIdController,
    getBlogByIdController,
    getBlogsController, getPostsByBlogIdController, updateBlogByIdController,
} from "../controllers/blogs-controller"
import {authBasicMiddleware} from "../common/middlewares/auth-basic-middleware";
import {inputValidationMiddleware, notFoundValidationMiddleware} from "../common/middlewares/input-validation-middlware";
import {blogsInputValidationMiddleware} from "../validators/blogs-input-validation-middleware";
import {
    paramsBlogIdInputValidation,
    postForBlogInputValidationMiddleware
} from "../validators/posts-input-validation-middleware";

export const blogsRouter = Router()

blogsRouter.post('/', authBasicMiddleware, blogsInputValidationMiddleware, inputValidationMiddleware, createBlogController)
blogsRouter.get('/', getBlogsController)
blogsRouter.post('/:blogId/posts',
    authBasicMiddleware,
    postForBlogInputValidationMiddleware,
    inputValidationMiddleware,
    paramsBlogIdInputValidation,
    notFoundValidationMiddleware,
    createPostByBlogIdController)
blogsRouter.get('/:blogId/posts', getPostsByBlogIdController)
blogsRouter.get('/:id', getBlogByIdController)
blogsRouter.put('/:id', authBasicMiddleware, blogsInputValidationMiddleware, inputValidationMiddleware, updateBlogByIdController)
blogsRouter.delete('/:id', authBasicMiddleware, inputValidationMiddleware, deleteBlogByIdController)
