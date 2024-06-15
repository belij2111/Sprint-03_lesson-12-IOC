import {Request, Response} from "express";
import {authService} from "../services/auth-service";

export const authController = {
    async login(req: Request, res: Response) {
        try {
            const result = await authService.loginUser(req.body)
            if (!result) {
                res
                    .status(401)
                    .json({
                        errorsMessages: [
                            {
                                message: 'Password or login is wrong',
                                field: 'loginOrEmail'
                            },
                        ]
                    })
                return
            }
            res
                .status(204)
                .json({})
        } catch (error) {
            res
                .status(400)
                .json({
                    errorsMessages: [
                        {
                            message: 'InputModel has incorrect values',
                            field: "loginOrEmail"
                        },
                    ]
                })
        }

    }
}