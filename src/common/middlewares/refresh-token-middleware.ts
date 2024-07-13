import {NextFunction, Request, Response} from "express";
import {jwtService} from "../adapters/jwt-service";
import {JwtPayload} from "jsonwebtoken";
import {authMongoRepository} from "../../repositories/auth-mongo-repository";

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
    const tokenInBlacklist = await authMongoRepository.findInBlackList(refreshToken)
    if (tokenInBlacklist) {
        res
            .status(401)
            .json({})
        return
    }
    req.user = {id: payload.userId}
    next()
}