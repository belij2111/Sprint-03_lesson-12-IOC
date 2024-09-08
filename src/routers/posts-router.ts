import {Router} from "express";
import {postsController} from "../controllers/posts-controller";
import {authBasicMiddleware} from "../common/middlewares/auth-basic-middleware";
import {inputValidationMiddleware} from "../common/middlewares/input-validation-middlware";
import {postsInputValidationMiddleware} from "../validators/posts-input-validation-middleware";
import {authBearerMiddleware} from "../common/middlewares/auth-bearer-middleware";
import {commentsInputValidationMiddleware} from "../validators/comments-input-validation-middleware";
import {userIdentificationMiddleware} from "../common/middlewares/user-identification-middleware";
import {likeStatusInputValidationMiddleware} from "../validators/like-status-input-validation-middleware";

export const postsRouter = Router()

postsRouter.post('/', authBasicMiddleware, postsInputValidationMiddleware, inputValidationMiddleware, postsController.create.bind(postsController))
postsRouter.get('/', userIdentificationMiddleware.identifyUser.bind(userIdentificationMiddleware), postsController.get.bind(postsController))
postsRouter.get('/:id', userIdentificationMiddleware.identifyUser.bind(userIdentificationMiddleware), postsController.getById.bind(postsController))
postsRouter.put('/:id', authBasicMiddleware, postsInputValidationMiddleware, inputValidationMiddleware, postsController.update.bind(postsController))
postsRouter.delete('/:id', authBasicMiddleware, inputValidationMiddleware, postsController.deleteById.bind(postsController))
postsRouter.post('/:postId/comments', authBearerMiddleware.checkAuth.bind(authBearerMiddleware), commentsInputValidationMiddleware, inputValidationMiddleware, postsController.createCommentByPostId.bind(postsController))
postsRouter.get('/:postId/comments', userIdentificationMiddleware.identifyUser.bind(userIdentificationMiddleware), postsController.getCommentsByPostId.bind(postsController))
postsRouter.put('/:postId/like-status', authBearerMiddleware.checkAuth.bind(authBearerMiddleware), likeStatusInputValidationMiddleware, inputValidationMiddleware, postsController.updateLikeStatus.bind(postsController))