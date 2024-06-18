import {Router} from "express"
import {usersController} from "../controllers/users-controller";
import {authMiddleware} from "../validators/auth-middleware";
import {inputValidationMiddleware} from "../validators/input-validation-middlware";
import {usersInputValidationMiddleware} from "../validators/users-input-validation-middleware";

export const usersRouter = Router()

usersRouter.post('/', authMiddleware, usersInputValidationMiddleware, inputValidationMiddleware, usersController.create)
usersRouter.get('/', authMiddleware, inputValidationMiddleware, usersController.get)
usersRouter.delete('/:id', authMiddleware, inputValidationMiddleware, usersController.delete)