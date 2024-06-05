import {InputBlogType} from "../../src/types/blog-types";

export const blogDto = {
    createValidBlogDto(): InputBlogType {
        return {
            name: 'Blog 1',
            description: 'This is a new blog',
            websiteUrl: 'https://www.example.com'
        }
    },
    createInvalidBlogDto(): InputBlogType {
        return {
            name: 'Blog 1',
            description: 'This is a new blog',
            websiteUrl: 'invalid url'
        }
    }
}