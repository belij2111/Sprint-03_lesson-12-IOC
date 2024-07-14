import {Request, Response} from "express";
import {authService} from "../services/auth-service";
import {ResultStatus} from "../common/types/result-code";
import {usersMongoQueryRepository} from "../repositories/users-mongo-query-repository";
import {LoginServiceOutputType} from "../types/auth-types";

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
            const refreshToken = req.cookies.refreshToken
            const userId = req.user.id
            const result = await authService.refreshToken(refreshToken, userId)
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
            const refreshToken = req.cookies.refreshToken
            const result = await authService.logout(refreshToken)
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