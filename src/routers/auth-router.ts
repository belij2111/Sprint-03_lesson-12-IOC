import {Router} from "express"
import {authController} from "../controllers/auth-controller";
import {authBearerMiddleware} from "../common/middlewares/auth-bearer-middleware";
import {
    emailInputValidation,
    passwordInputValidation,
    usersInputValidationMiddleware
} from "../validators/users-input-validation-middleware";
import {inputValidationMiddleware} from "../common/middlewares/input-validation-middlware";
import {refreshTokenMiddleware} from "../common/middlewares/refresh-token-middleware";
import {logApiCallsMiddleware} from "../common/middlewares/log-api-calls-middleware";

export const authRouter = Router()

authRouter.post('/login', logApiCallsMiddleware, inputValidationMiddleware, authController.login)
authRouter.get('/me', authBearerMiddleware, authController.get)
authRouter.post('/registration', logApiCallsMiddleware, usersInputValidationMiddleware, inputValidationMiddleware, authController.registration)
authRouter.post('/registration-confirmation', logApiCallsMiddleware, authController.registrationConfirmation)
authRouter.post('/registration-email-resending', logApiCallsMiddleware, authController.registrationEmailResending)
authRouter.post('/password-recovery', logApiCallsMiddleware, emailInputValidation, inputValidationMiddleware, authController.passwordRecovery)
authRouter.post('/new-password', logApiCallsMiddleware, passwordInputValidation('newPassword'), inputValidationMiddleware, authController.newPassword)
authRouter.post('/refresh-token', refreshTokenMiddleware, authController.refreshToken)
authRouter.post('/logout', refreshTokenMiddleware, authController.logout)