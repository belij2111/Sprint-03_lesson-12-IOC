import {Router} from "express"
import {AuthController} from "../controllers/auth-controller";
import {AuthBearerMiddleware} from "../common/middlewares/auth-bearer-middleware";
import {
    emailInputValidation,
    passwordInputValidation,
    usersInputValidationMiddleware
} from "../validators/users-input-validation-middleware";
import {inputValidationMiddleware} from "../common/middlewares/input-validation-middlware";
import {RefreshTokenMiddleware} from "../common/middlewares/refresh-token-middleware";
import {LogApiCallsMiddleware} from "../common/middlewares/log-api-calls-middleware";
import {container} from "../composition-root";

const authController = container.resolve(AuthController)
const logApiCallsMiddleware = container.resolve(LogApiCallsMiddleware)
const authBearerMiddleware = container.resolve(AuthBearerMiddleware)
const refreshTokenMiddleware = container.resolve(RefreshTokenMiddleware)
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