import {NextFunction, Request, Response} from "express";
import {AuthService} from "../../services/auth-service";
import {ApiCallDataInputType} from "../../types/auth-types";
import {ResultStatus} from "../types/result-code";
import {inject, injectable} from "inversify";

@injectable()
export class LogApiCallsMiddleware {
    constructor(@inject(AuthService) private authService: AuthService) {
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