import {Router} from "express"
import {usersController} from "../controllers/users-controller";
import {authMiddleware} from "../middlewares/auth-middleware";
import {inputValidationMiddleware} from "../middlewares/input-validation-middlware";
import {usersInputValidationMiddleware} from "../middlewares/users-input-validation-middleware";

export const usersRouter = Router()

usersRouter.post('/', authMiddleware, usersInputValidationMiddleware, inputValidationMiddleware, usersController.create)
usersRouter.get('/', authMiddleware, inputValidationMiddleware, usersController.get)
usersRouter.delete('/:id', authMiddleware, inputValidationMiddleware, usersController.delete)