import {Request, Response} from "express";
import {authService} from "../services/auth-service";
import {ResultStatus} from "../common/types/result-code";
import {usersMongoQueryRepository} from "../repositories/users-mongo-query-repository";
import {LoginServiceOutputType} from "../types/auth-types";
import {CustomJwtPayload} from "../common/types/custom-jwt-payload-type";

export const authController = {
    async registration(req: Request, res: Response) {
        try {
            const result = await authService.registerUser(req.body)
            if (result.status === ResultStatus.BadRequest) {
                res
                    .status(400)
                    .json({errorsMessages: result.extensions || []})
                return
            }
            res
                .status(204)
                .json({})
        } catch (error) {
            res
                .status(500)
                .json({message: 'authController.registration'})
        }
    },

    async registrationConfirmation(req: Request, res: Response) {
        try {
            const result = await authService.confirmationRegistrationUser(req.body)
            if (result.status === ResultStatus.BadRequest) {
                res
                    .status(400)
                    .json({errorsMessages: result.extensions || []})
                return
            }
            res
                .status(204)
                .json({})
        } catch (error) {
            res
                .status(500)
                .json({message: 'authController.registrationConfirmation'})
        }
    },

    async registrationEmailResending(req: Request, res: Response) {
        try {
            const result = await authService.registrationEmailResending(req.body)
            if (result.status === ResultStatus.BadRequest) {
                res
                    .status(400)
                    .json({errorsMessages: result.extensions || []})
                return
            }
            res
                .status(204)
                .json({})
        } catch (error) {
            res
                .status(500)
                .json({message: 'authController.registrationEmailResending'})
        }
    },

    async passwordRecovery(req: Request, res: Response) {
        try {
            const result = await authService.passwordRecovery(req.body)
            res
                .status(204)
                .json({})
        } catch (error) {
            res
                .status(500)
                .json({message: 'authController.passwordRecovery'})
        }
    },

    async login(req: Request, res: Response) {
        try {
            if (!req.ip) {
                res
                    .status(400)
                    .json({error: "IP address is required"})
                return
            }
            if (!req.headers['user-agent']) {
                res
                    .status(400)
                    .json({error: "IP address is required"})
                return
            }
            const ip = req.ip
            const deviceName = req.headers['user-agent']
            const result = await authService.loginUser(req.body, ip, deviceName)
            if (result.status === ResultStatus.Unauthorized) {
                res
                    .status(401)
                    .json({errorsMessages: result.extensions || []})
                return
            }
            if (result.status === ResultStatus.Success) {
                const {accessToken, refreshToken} = result.data as LoginServiceOutputType
                res
                    .cookie("refreshToken", refreshToken, {httpOnly: true, secure: true})
                    .status(200)
                    .json({accessToken})
                return
            }
        } catch (error) {
            res
                .status(500)
                .json({message: 'authController.login'})
        }
    },

    async get(req: Request, res: Response) {
        try {
            if (!req.user) {
                res
                    .status(401)
                    .json({})
                return
            }
            const user = await usersMongoQueryRepository.getAuthUserById(req.user.id)
            if (!user) {
                res
                    .status(401)
                    .json({})
                return
            }
            res
                .status(200)
                .json(user)
        } catch (error) {
            res
                .status(500)
                .json({message: 'authController.get'})
        }
    },

    async refreshToken(req: Request, res: Response) {
        try {
            const payload: CustomJwtPayload = {
                userId: req.user.id,
                deviceId: req.deviceId
            }
            const result = await authService.refreshToken(payload)
            if (result.status === ResultStatus.Unauthorized) {
                res
                    .status(401)
                    .json({errorsMessages: result.extensions || []})
                return
            }
            if (result.status === ResultStatus.Success) {
                const {accessToken, refreshToken} = result.data as LoginServiceOutputType
                res
                    .cookie("refreshToken", refreshToken, {httpOnly: true, secure: true})
                    .status(200)
                    .json({accessToken})
                return
            }
        } catch (error) {
            res
                .status(500)
                .json({message: 'authController.refreshToken'})
        }
    },

    async logout(req: Request, res: Response) {
        try {
            const deviceId = req.deviceId
            const result = await authService.logout(deviceId)
            if (result.status === ResultStatus.Success) {
                res
                    .clearCookie("refreshToken")
                    .status(204)
                    .json({})
                return
            }
        } catch (error) {
            res
                .status(500)
                .json({message: 'authController.logout'})
        }
    }
}