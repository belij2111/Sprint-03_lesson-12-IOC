import {Router} from "express";
import {PostsController} from "../controllers/posts-controller";
import {AuthBasicMiddleware} from "../common/middlewares/auth-basic-middleware";
import {inputValidationMiddleware} from "../common/middlewares/input-validation-middlware";
import {postsInputValidationMiddleware} from "../validators/posts-input-validation-middleware";
import {AuthBearerMiddleware} from "../common/middlewares/auth-bearer-middleware";
import {commentsInputValidationMiddleware} from "../validators/comments-input-validation-middleware";
import {
    UserIdentificationMiddleware
} from "../common/middlewares/user-identification-middleware";
import {likeStatusInputValidationMiddleware} from "../validators/like-status-input-validation-middleware";
import {container} from "../composition-root";

const postsController = container.resolve(PostsController)
const authBasicMiddleware = container.resolve(AuthBasicMiddleware)
const userIdentificationMiddleware = container.resolve(UserIdentificationMiddleware)
const authBearerMiddleware = container.resolve(AuthBearerMiddleware)
export const postsRouter = Router()

postsRouter.post('/', authBasicMiddleware.checkAuth.bind(authBasicMiddleware), postsInputValidationMiddleware, inputValidationMiddleware, postsController.create.bind(postsController))
postsRouter.get('/', userIdentificationMiddleware.identifyUser.bind(userIdentificationMiddleware), postsController.get.bind(postsController))
postsRouter.get('/:id', userIdentificationMiddleware.identifyUser.bind(userIdentificationMiddleware), postsController.getById.bind(postsController))
postsRouter.put('/:id', authBasicMiddleware.checkAuth.bind(authBasicMiddleware), postsInputValidationMiddleware, inputValidationMiddleware, postsController.update.bind(postsController))
postsRouter.delete('/:id', authBasicMiddleware.checkAuth.bind(authBasicMiddleware), inputValidationMiddleware, postsController.deleteById.bind(postsController))
postsRouter.post('/:postId/comments', authBearerMiddleware.checkAuth.bind(authBearerMiddleware), commentsInputValidationMiddleware, inputValidationMiddleware, postsController.createCommentByPostId.bind(postsController))
postsRouter.get('/:postId/comments', userIdentificationMiddleware.identifyUser.bind(userIdentificationMiddleware), postsController.getCommentsByPostId.bind(postsController))
postsRouter.put('/:postId/like-status', authBearerMiddleware.checkAuth.bind(authBearerMiddleware), likeStatusInputValidationMiddleware, inputValidationMiddleware, postsController.updateLikeStatus.bind(postsController))