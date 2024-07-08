import {Request, Response} from "express";
import {authService} from "../services/auth-service";
import {ResultStatus} from "../common/types/result-code";
import {usersMongoQueryRepository} from "../repositories/users-mongo-query-repository";

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
                res
                    .status(200)
                    .json(result.data)
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
    }
}