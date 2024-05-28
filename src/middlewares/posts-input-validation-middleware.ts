import {body, param} from "express-validator";
import {blogsMongoQueryRepository} from "../repositories/blogs-mongo-query-repository";

const blogIdInputValidation = body('blogId')
    .trim()
    .isString()
    .withMessage("not string")
    .custom(async (value) => {
        const blog = await blogsMongoQueryRepository.getBlogById(value);
        if (!blog) {
            throw new Error('Blog not found');
        }
        return true;
    })

export const paramsBlogIdInputValidation = param('blogId')
    .trim()
    .isString()
    .withMessage("not string")
    .custom(async (value) => {
        const blog = await blogsMongoQueryRepository.getBlogById(value);
        if (!blog) {
            throw new Error('Blog not found');
        }
        return true;
    })

const titleInputValidation = body('title')
    .trim()
    .isString()
    .withMessage("not string")
    .isLength({min: 3, max: 30})
    .withMessage("title length should be from 3 to 30 symbol")

const shortDescriptionInputValidation = body('shortDescription')
    .trim()
    .isString()
    .withMessage("not string")
    .isLength({min: 3, max: 100})
    .withMessage("shortDescription length should be from 3 to 100 symbol")

const contentInputValidation = body('content')
    .trim()
    .isString()
    .withMessage("not string")
    .isLength({min: 3, max: 1000})
    .withMessage("content length should be from 3 to 1000 symbol")

export const postsInputValidationMiddleware = [
    titleInputValidation,
    shortDescriptionInputValidation,
    contentInputValidation,
    blogIdInputValidation
]

export const postForBlogInputValidationMiddleware = [
    titleInputValidation,
    shortDescriptionInputValidation,
    contentInputValidation
]

