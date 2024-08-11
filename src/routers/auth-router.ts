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

authRouter.post('/login', logApiCallsMiddleware.logApiCall.bind(logApiCallsMiddleware), inputValidationMiddleware, authController.login.bind(authController))
authRouter.get('/me', authBearerMiddleware.checkAuth.bind(authBearerMiddleware), authController.get.bind(authController))
authRouter.post('/registration', logApiCallsMiddleware.logApiCall.bind(logApiCallsMiddleware), usersInputValidationMiddleware, inputValidationMiddleware, authController.registration.bind(authController))
authRouter.post('/registration-confirmation', logApiCallsMiddleware.logApiCall.bind(logApiCallsMiddleware), authController.registrationConfirmation.bind(authController))
authRouter.post('/registration-email-resending', logApiCallsMiddleware.logApiCall.bind(logApiCallsMiddleware), authController.registrationEmailResending.bind(authController))
authRouter.post('/password-recovery', logApiCallsMiddleware.logApiCall.bind(logApiCallsMiddleware), emailInputValidation, inputValidationMiddleware, authController.passwordRecovery.bind(authController))
authRouter.post('/new-password', logApiCallsMiddleware.logApiCall.bind(logApiCallsMiddleware), passwordInputValidation('newPassword'), inputValidationMiddleware, authController.newPassword.bind(authController))
authRouter.post('/refresh-token', refreshTokenMiddleware.refreshToken.bind(refreshTokenMiddleware), authController.refreshToken.bind(authController))
authRouter.post('/logout', refreshTokenMiddleware.refreshToken.bind(refreshTokenMiddleware), authController.logout.bind(authController))