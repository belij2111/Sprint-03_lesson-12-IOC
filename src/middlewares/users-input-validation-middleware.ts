import {body} from "express-validator";

const loginInputValidation = body('login')
    .trim()
    .isString()
    .withMessage("not string")
    .isLength({min: 3, max: 10})
    .withMessage("login length should be from 3 to 10 symbols")
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage("login should contain only letters, numbers, underscores, and hyphens")

const passwordInputValidation = body('password')
    .trim()
    .isString()
    .withMessage("not string")
    .isLength({min: 6, max: 20})
    .withMessage("password length should be from 6 to 20 symbols")

const emailInputValidation = body('email')
    .trim()
    .isString()
    .withMessage("not string")
    .isEmail()
    .withMessage("email has invalid format")
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage("email should follow the pattern: example@example.com")


export const usersInputValidationMiddleware = [
    loginInputValidation,
    passwordInputValidation,
    emailInputValidation
]