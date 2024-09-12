import {Router} from "express"
import {CommentsController} from "../controllers/comments-controller";
import {AuthBearerMiddleware} from "../common/middlewares/auth-bearer-middleware";
import {commentsInputValidationMiddleware} from "../validators/comments-input-validation-middleware";
import {inputValidationMiddleware} from "../common/middlewares/input-validation-middlware";
import {likeStatusInputValidationMiddleware} from "../validators/like-status-input-validation-middleware";
import {
    UserIdentificationMiddleware
} from "../common/middlewares/user-identification-middleware";
import {container} from "../composition-root";

const commentsController = container.resolve(CommentsController)
const userIdentificationMiddleware = container.resolve(UserIdentificationMiddleware)
const authBearerMiddleware = container.resolve(AuthBearerMiddleware)
export const commentsRouter = Router()

commentsRouter.get('/:id', userIdentificationMiddleware.identifyUser.bind(userIdentificationMiddleware), commentsController.getById.bind(commentsController))
commentsRouter.put('/:commentId', authBearerMiddleware.checkAuth.bind(authBearerMiddleware), commentsInputValidationMiddleware, inputValidationMiddleware, commentsController.update.bind(commentsController))
commentsRouter.delete('/:commentId', authBearerMiddleware.checkAuth.bind(authBearerMiddleware), inputValidationMiddleware, commentsController.delete.bind(commentsController))
commentsRouter.put('/:commentId/like-status', authBearerMiddleware.checkAuth.bind(authBearerMiddleware), likeStatusInputValidationMiddleware, inputValidationMiddleware, commentsController.updateLikeStatus.bind(commentsController))