import {NextFunction, Request, Response} from "express";
import {authService} from "../../services/auth-service";
import {ApiCallDataInputType} from "../../types/auth-types";
import {ResultStatus} from "../types/result-code";

export const logApiCallsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
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
    const result = await authService.checkApiCalls(apiCallData)
    if (result.status === ResultStatus.TooManyRequests) {
        res
            .status(429)
            .json({errorsMessages: result.extensions || []})
        return
    }
    next()
}