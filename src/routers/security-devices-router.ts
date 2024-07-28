import {Router} from "express"
import {securityDevicesController} from "../controllers/security-devices-controller";
import {refreshTokenMiddleware} from "../common/middlewares/refresh-token-middleware";

export const securityDevicesRouter = Router()

securityDevicesRouter.get('/devices', refreshTokenMiddleware, securityDevicesController.get)
securityDevicesRouter.delete('/devices', refreshTokenMiddleware, securityDevicesController.delete)