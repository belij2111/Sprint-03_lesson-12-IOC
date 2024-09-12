import {Router} from "express"
import {RefreshTokenMiddleware} from "../common/middlewares/refresh-token-middleware";
import {container} from "../composition-root";
import {SecurityDevicesController} from "../controllers/security-devices-controller";

const securityDevicesController = container.resolve(SecurityDevicesController)
const refreshTokenMiddleware = container.resolve(RefreshTokenMiddleware)
export const securityDevicesRouter = Router()

securityDevicesRouter.get('/devices', refreshTokenMiddleware.refreshToken.bind(refreshTokenMiddleware), securityDevicesController.get.bind(securityDevicesController))
securityDevicesRouter.delete('/devices', refreshTokenMiddleware.refreshToken.bind(refreshTokenMiddleware), securityDevicesController.delete.bind(securityDevicesController))
securityDevicesRouter.delete('/devices/:deviceId', refreshTokenMiddleware.refreshToken.bind(refreshTokenMiddleware), securityDevicesController.deleteByDeviceId.bind(securityDevicesController))