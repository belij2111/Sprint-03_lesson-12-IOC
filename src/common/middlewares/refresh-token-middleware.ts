import {NextFunction, Request, Response} from "express";
import {jwtService} from "../adapters/jwt-service";
import {JwtPayload} from "jsonwebtoken";
import {securityDevicesMongoRepository} from "../../repositories/security-devices-mongo-repository";

export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        res
            .status(401)
            .json({})
        return
    }
    const payload = await jwtService.verifyToken(refreshToken) as JwtPayload
    if (!payload) {
        res
            .status(401)
            .json({})
        return
    }
    const deviceSession = await securityDevicesMongoRepository.findByDeviceId(payload.deviceId)
    if (!deviceSession) {
        res
            .status(401)
            .json({})
        return
    }
    const tokenVersionFromPayload = new Date(payload.iat! * 1000).toISOString()
    const tokenVersionInDB = deviceSession.iatDate
    if (tokenVersionFromPayload !== tokenVersionInDB) {
        res
            .status(401)
            .json({})
        return
    }
    req.user = {id: payload.userId}
    req.deviceId = payload.deviceId
    next()
}