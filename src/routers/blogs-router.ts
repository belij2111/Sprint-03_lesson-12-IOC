import {Router} from "express"
import {blogsController} from "../controllers/blogs-controller"
import {authBasicMiddleware} from "../common/middlewares/auth-basic-middleware";
import {
    inputValidationMiddleware,
    notFoundValidationMiddleware
} from "../common/middlewares/input-validation-middlware";
import {blogsInputValidationMiddleware} from "../validators/blogs-input-validation-middleware";
import {
    paramsBlogIdInputValidation,
    postForBlogInputValidationMiddleware
} from "../validators/posts-input-validation-middleware";

export const blogsRouter = Router()

blogsRouter.post('/', authBasicMiddleware, blogsInputValidationMiddleware, inputValidationMiddleware, blogsController.create)
blogsRouter.get('/', blogsController.get)
blogsRouter.post('/:blogId/posts',
    authBasicMiddleware,
    postForBlogInputValidationMiddleware,
    inputValidationMiddleware,
    paramsBlogIdInputValidation,
    notFoundValidationMiddleware,
    blogsController.createPostByBlogId)
blogsRouter.get('/:blogId/posts', blogsController.getPostsByBlogId)
blogsRouter.get('/:id', blogsController.getById)
blogsRouter.put('/:id', authBasicMiddleware, blogsInputValidationMiddleware, inputValidationMiddleware, blogsController.updateById)
blogsRouter.delete('/:id', authBasicMiddleware, inputValidationMiddleware, blogsController.deleteById)
