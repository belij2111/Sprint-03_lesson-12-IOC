import {Router} from "express"
import {authController} from "../controllers/auth-controller";
import {authBearerMiddleware} from "../common/middlewares/auth-bearer-middleware";

export const authRouter = Router()

authRouter.post('/login', authController.login)
authRouter.get('/me', authBearerMiddleware, authController.get)