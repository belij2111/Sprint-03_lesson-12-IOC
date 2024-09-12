import {Router} from "express"
import {UsersController} from "../controllers/users-controller";
import {AuthBasicMiddleware} from "../common/middlewares/auth-basic-middleware";
import {inputValidationMiddleware} from "../common/middlewares/input-validation-middlware";
import {usersInputValidationMiddleware} from "../validators/users-input-validation-middleware";
import {container} from "../composition-root";

const usersController = container.resolve(UsersController)
const authBasicMiddleware = container.resolve(AuthBasicMiddleware)
export const usersRouter = Router()

usersRouter.post('/', authBasicMiddleware.checkAuth.bind(authBasicMiddleware), usersInputValidationMiddleware, inputValidationMiddleware, usersController.create.bind(usersController))
usersRouter.get('/', authBasicMiddleware.checkAuth.bind(authBasicMiddleware), inputValidationMiddleware, usersController.get.bind(usersController))
usersRouter.delete('/:id', authBasicMiddleware.checkAuth.bind(authBasicMiddleware), inputValidationMiddleware, usersController.delete.bind(usersController))