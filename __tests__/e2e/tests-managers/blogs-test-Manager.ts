import {OutputBlogType} from "../../../src/types/blog-types";
import {req} from "../../test-helpers";
import {SETTINGS} from "../../../src/settings";
import {Response} from "supertest";
import {blogDto} from "../../tests-dtos/blog-dto";

export const blogsTestManager = {
    async createBlog(authorizationHeader: { [key: string]: string; }) {
        const response: Response = await req
            .post(SETTINGS.PATH.BLOGS)
            .set(authorizationHeader || {})
            .send(blogDto.validBlogsDto())
            .expect(201)
        return response.body
    },

    async createBlogs(authorizationHeader: { [key: string]: string; }, count: number) {
        const blogs: OutputBlogType[] = []
        for (let i = 1; i <= count; i++) {
            const response: Response = await req
                .post(SETTINGS.PATH.BLOGS)
                .set(authorizationHeader || {})
                .send(blogDto.validBlogsDto(i))
                .expect(201)
            blogs.push(response.body)
        }
        return blogs
    },

    async createAuthorizationHeader(authType: string, token: string): Promise<{ [key: string]: string; }> {
        if (authType !== 'Basic') {
            throw new Error('Invalid authentication type')
        }
        const buff = Buffer.from(token, 'utf-8');
        const codedAuth = buff.toString('base64')
        return {
            'authorization': `${authType} ${codedAuth}`
        }
    }
}