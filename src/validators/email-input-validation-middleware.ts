import {body} from "express-validator";

const emailInputValidation = body('email')
    .trim()
    .isString()
    .withMessage("not string")
    .isEmail()
    .withMessage("email has invalid format")
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage("email should follow the pattern: example@example.com")

export const emailInputValidationMiddleware = [
    emailInputValidation
]