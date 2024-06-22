import {Request, Response} from "express";
import {authService} from "../services/auth-service";
import {ResultStatus} from "../common/types/result-code";

export const authController = {
    async login(req: Request, res: Response) {
        try {
            const result = await authService.loginUser(req.body)
            if (result.status === ResultStatus.Unauthorized) {
                res
                    .status(401)
                    .json({errorsMessages: result.extensions || []})
                return
            }
            if (result.status === ResultStatus.Success) {
                res
                    .status(204)
                    .json({})
                return
            }
        } catch (error) {
            res
                .status(500)
                .json({message: 'authController.login'})
        }
    }
}