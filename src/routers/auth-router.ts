import {Router} from "express"
import {authController} from "../controllers/auth-controller";
import {authBearerMiddleware} from "../common/middlewares/auth-bearer-middleware";
import {usersInputValidationMiddleware} from "../validators/users-input-validation-middleware";
import {inputValidationMiddleware} from "../common/middlewares/input-validation-middlware";

export const authRouter = Router()

authRouter.post('/login', authController.login)
authRouter.get('/me', authBearerMiddleware, authController.get)
authRouter.post('/registration', usersInputValidationMiddleware, inputValidationMiddleware, authController.registration)
authRouter.post('/registration-confirmation', authController.registrationConfirmation)
authRouter.post('/registration-email-resending', authController.registrationEmailResending)