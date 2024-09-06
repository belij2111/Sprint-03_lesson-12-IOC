import {NextFunction, Request, Response} from "express";
import {AuthService} from "../../services/auth-service";
import {ApiCallDataInputType} from "../../types/auth-types";
import {ResultStatus} from "../types/result-code";
import {UsersMongoRepository} from "../../repositories/users-mongo-repository";
import {SecurityDevicesMongoRepository} from "../../repositories/security-devices-mongo-repository";
import {AuthMongoRepository} from "../../repositories/auth-mongo-repository";

class LogApiCallsMiddleware {
    // private authService: AuthService

    constructor(private authService: AuthService) {
        // this.authService = new AuthService()
    }

    async logApiCall(req: Request, res: Response, next: NextFunction) {
        if (!req.ip) {
            return next(new Error("IP address is undefined"));
        }
        if (!req.originalUrl) {
            return next(new Error("Original url is undefined"));
        }
        const apiCallData: ApiCallDataInputType = {
            ip: req.ip,
            url: req.originalUrl
        }
        const result = await this.authService.checkApiCalls(apiCallData)
        if (result.status === ResultStatus.TooManyRequests) {
            res
                .status(429)
                .json({errorsMessages: result.extensions || []})
            return
        }
        next()
    }
}

const usersMongoRepository = new UsersMongoRepository()
const securityDevicesMongoRepository = new SecurityDevicesMongoRepository()
const authMongoRepository = new AuthMongoRepository()
const authService = new AuthService(usersMongoRepository, securityDevicesMongoRepository, authMongoRepository)
export const logApiCallsMiddleware = new LogApiCallsMiddleware(authService)