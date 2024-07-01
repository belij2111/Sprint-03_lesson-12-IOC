import {body} from "express-validator";

const contentInputValidation = body('content')
    .trim()
    .isString()
    .withMessage("not string")
    .isLength({min: 20, max: 300})
    .withMessage("content length should be from 20 to 300 symbols")

export const commentsInputValidationMiddleware = [
    contentInputValidation
]