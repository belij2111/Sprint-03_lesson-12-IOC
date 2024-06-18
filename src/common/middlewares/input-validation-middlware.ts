import {NextFunction, Request, Response} from "express";
import {FieldValidationError, validationResult} from "express-validator"

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res
            .status(400)
            .json({
                errorsMessages: (errors.array({onlyFirstError: true}) as FieldValidationError[]).map(error => ({
                    message: error.msg,
                    field: error.path
                }))
            })
        return
    }
    next()
}

export const notFoundValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res
            .status(404)
            .json({
                errorsMessages: (errors.array({onlyFirstError: true}) as FieldValidationError[]).map(error => ({
                    message: error.msg,
                    field: error.path
                }))
            })
        return
    }
    next()
}