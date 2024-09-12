import {Router} from "express"
import {AuthBasicMiddleware} from "../common/middlewares/auth-basic-middleware";
import {
    inputValidationMiddleware,
    notFoundValidationMiddleware
} from "../common/middlewares/input-validation-middlware";
import {blogsInputValidationMiddleware} from "../validators/blogs-input-validation-middleware";
import {
    paramsBlogIdInputValidation,
    postForBlogInputValidationMiddleware
} from "../validators/posts-input-validation-middleware";
import {
    UserIdentificationMiddleware
} from "../common/middlewares/user-identification-middleware";
import {container} from "../composition-root";
import {BlogsController} from "../controllers/blogs-controller";

const authBasicMiddleware = container.resolve(AuthBasicMiddleware)
const userIdentificationMiddleware = container.resolve(UserIdentificationMiddleware)
const blogsController = container.resolve(BlogsController)
export const blogsRouter = Router()

blogsRouter.post('/', authBasicMiddleware.checkAuth.bind(authBasicMiddleware), blogsInputValidationMiddleware, inputValidationMiddleware, blogsController.create.bind(blogsController))
blogsRouter.get('/', blogsController.get.bind(blogsController))
blogsRouter.post('/:blogId/posts',
    authBasicMiddleware.checkAuth.bind(authBasicMiddleware),
    postForBlogInputValidationMiddleware,
    inputValidationMiddleware,
    paramsBlogIdInputValidation,
    notFoundValidationMiddleware,
    blogsController.createPostByBlogId.bind(blogsController))
blogsRouter.get('/:blogId/posts', userIdentificationMiddleware.identifyUser.bind(userIdentificationMiddleware), blogsController.getPostsByBlogId.bind(blogsController))
blogsRouter.get('/:id', blogsController.getById.bind(blogsController))
blogsRouter.put('/:id', authBasicMiddleware.checkAuth.bind(authBasicMiddleware), blogsInputValidationMiddleware, inputValidationMiddleware, blogsController.updateById.bind(blogsController))
blogsRouter.delete('/:id', authBasicMiddleware.checkAuth.bind(authBasicMiddleware), inputValidationMiddleware, blogsController.deleteById.bind(blogsController))
