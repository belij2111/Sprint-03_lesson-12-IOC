import {Router} from "express"
import {authController} from "../controllers/auth-controller";
import {authBearerMiddleware} from "../common/middlewares/auth-bearer-middleware";
import {usersInputValidationMiddleware} from "../validators/users-input-validation-middleware";
import {inputValidationMiddleware} from "../common/middlewares/input-validation-middlware";
import {refreshTokenMiddleware} from "../common/middlewares/refresh-token-middleware";
import {logApiCallsMiddleware} from "../common/middlewares/log-api-calls-middleware";
import {emailInputValidationMiddleware} from "../validators/email-input-validation-middleware";

export const authRouter = Router()

authRouter.post('/login', logApiCallsMiddleware, inputValidationMiddleware, authController.login)
authRouter.get('/me', authBearerMiddleware, authController.get)
authRouter.post('/registration', logApiCallsMiddleware, usersInputValidationMiddleware, inputValidationMiddleware, authController.registration)
authRouter.post('/registration-confirmation', logApiCallsMiddleware, authController.registrationConfirmation)
authRouter.post('/registration-email-resending', logApiCallsMiddleware, authController.registrationEmailResending)
authRouter.post('/password-recovery', logApiCallsMiddleware, emailInputValidationMiddleware, inputValidationMiddleware, authController.passwordRecovery)
authRouter.post('/refresh-token', refreshTokenMiddleware, authController.refreshToken)
authRouter.post('/logout', refreshTokenMiddleware, authController.logout)