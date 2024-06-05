import {InputBlogType} from "../../../src/types/blog-types";
import {req} from "../../test-helpers";
import {SETTINGS} from "../../../src/settings";
import {Response} from "supertest";

export const blogsTestManager = {
    async createBlog(blog: InputBlogType, authorizationHeader: { [key: string]: string; }) {
        const response: Response = await req
            .post(SETTINGS.PATH.BLOGS)
            .set(authorizationHeader || {})
            .send(blog)
        return response
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