import {Router} from "express"
import {commentsController} from "../controllers/comments-controller";
import {authBearerMiddleware} from "../common/middlewares/auth-bearer-middleware";
import {commentsInputValidationMiddleware} from "../validators/comments-input-validation-middleware";
import {inputValidationMiddleware} from "../common/middlewares/input-validation-middlware";

export const commentsRouter = Router()

commentsRouter.get('/:id', commentsController.getById)
commentsRouter.put('/:commentId', authBearerMiddleware, commentsInputValidationMiddleware, inputValidationMiddleware, commentsController.update)
commentsRouter.delete('/:commentId', authBearerMiddleware, inputValidationMiddleware, commentsController.delete)