import {body} from "express-validator";

const likeStatusInputValidation = body('likeStatus')
    .trim()
    .isString()
    .withMessage("not string")
    .isIn(['None', 'Like', 'Dislike'])
    .withMessage("likeStatus must be one of 'None', 'Like', or 'Dislike'")

export const likeStatusInputValidationMiddleware = [
    likeStatusInputValidation
]