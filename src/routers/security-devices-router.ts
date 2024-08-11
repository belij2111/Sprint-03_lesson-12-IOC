import {Router} from "express"
import {securityDevicesController} from "../controllers/security-devices-controller";
import {refreshTokenMiddleware} from "../common/middlewares/refresh-token-middleware";

export const securityDevicesRouter = Router()

securityDevicesRouter.get('/devices', refreshTokenMiddleware.refreshToken.bind(refreshTokenMiddleware), securityDevicesController.get.bind(securityDevicesController))
securityDevicesRouter.delete('/devices', refreshTokenMiddleware.refreshToken.bind(refreshTokenMiddleware), securityDevicesController.delete.bind(securityDevicesController))
securityDevicesRouter.delete('/devices/:deviceId', refreshTokenMiddleware.refreshToken.bind(refreshTokenMiddleware), securityDevicesController.deleteByDeviceId.bind(securityDevicesController))