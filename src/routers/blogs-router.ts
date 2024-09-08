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
import {userIdentificationMiddleware} from "../common/middlewares/user-identification-middleware";

export const blogsRouter = Router()

blogsRouter.post('/', authBasicMiddleware, blogsInputValidationMiddleware, inputValidationMiddleware, blogsController.create.bind(blogsController))
blogsRouter.get('/', blogsController.get.bind(blogsController))
blogsRouter.post('/:blogId/posts',
    authBasicMiddleware,
    postForBlogInputValidationMiddleware,
    inputValidationMiddleware,
    paramsBlogIdInputValidation,
    notFoundValidationMiddleware,
    blogsController.createPostByBlogId.bind(blogsController))
blogsRouter.get('/:blogId/posts', userIdentificationMiddleware.identifyUser.bind(userIdentificationMiddleware), blogsController.getPostsByBlogId.bind(blogsController))
blogsRouter.get('/:id', blogsController.getById.bind(blogsController))
blogsRouter.put('/:id', authBasicMiddleware, blogsInputValidationMiddleware, inputValidationMiddleware, blogsController.updateById.bind(blogsController))
blogsRouter.delete('/:id', authBasicMiddleware, inputValidationMiddleware, blogsController.deleteById.bind(blogsController))
