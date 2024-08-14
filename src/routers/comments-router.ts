import {Router} from "express"
import {commentsController} from "../controllers/comments-controller";
import {authBearerMiddleware} from "../common/middlewares/auth-bearer-middleware";
import {commentsInputValidationMiddleware} from "../validators/comments-input-validation-middleware";
import {inputValidationMiddleware} from "../common/middlewares/input-validation-middlware";
import {likeStatusInputValidationMiddleware} from "../validators/like-status-input-validation-middleware";

export const commentsRouter = Router()

commentsRouter.get('/:id', commentsController.getById.bind(commentsController))
commentsRouter.put('/:commentId', authBearerMiddleware.checkAuth.bind(authBearerMiddleware), commentsInputValidationMiddleware, inputValidationMiddleware, commentsController.update.bind(commentsController))
commentsRouter.delete('/:commentId', authBearerMiddleware.checkAuth.bind(authBearerMiddleware), inputValidationMiddleware, commentsController.delete.bind(commentsController))
commentsRouter.put('/:commentId/like-status', authBearerMiddleware.checkAuth.bind(authBearerMiddleware), likeStatusInputValidationMiddleware, inputValidationMiddleware, commentsController.updateLikeStatus.bind(commentsController))