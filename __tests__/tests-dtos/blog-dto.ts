import {InputBlogType} from "../../src/types/blog-types";

export const blogDto = {
    validBlogsDto(count?: number): InputBlogType {
        return {
            name: `Blog${count}`,
            description: `This is a new blog${count}`,
            websiteUrl: `https://www.example${count}.com`
        }
    },
    invalidBlogsDto(count?: number): InputBlogType {
        return {
            name: `Blog${count}`,
            description: `This is a new blog${count}`,
            websiteUrl: `invalid url${count}`
        }
    }
}