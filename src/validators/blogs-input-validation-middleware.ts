import {body} from "express-validator";

const nameInputValidation = body('name')
    .trim()
    .isString()
    .withMessage("not string")
    .isLength({min: 3, max: 15})
    .withMessage("name length should be from 3 to 15 symbol")

const descriptionInputValidation = body('description')
    .trim()
    .isString()
    .withMessage("not string")
    .isLength({min: 3, max: 500})
    .withMessage("description length should be from 3 to 500 symbol")

const websiteUrlInputValidation = body('websiteUrl')
    .trim()
    .isString()
    .withMessage("not string")
    .isLength({min: 3, max: 100})
    .withMessage("websiteUrl length should be from 3 to 100 symbol")
    .isURL()
    .withMessage("websiteUrl has invalid format")
    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)


export const blogsInputValidationMiddleware = [
    nameInputValidation,
    descriptionInputValidation,
    websiteUrlInputValidation
]

