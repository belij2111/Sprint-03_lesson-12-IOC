import {req} from "../../test-helpers";
import {SETTINGS} from "../../../src/settings";
import {Response} from "supertest";
import {postDto} from "../../tests-dtos/post-dto";
import {OutputPostType} from "../../../src/types/post-types";

export const postsTestManager = {
    async createPost(authorizationHeader: { [key: string]: string; }, id: string, count?: number) {
        const response: Response = await req
            .post(SETTINGS.PATH.POSTS)
            .set(authorizationHeader || {})
            .send(postDto.validPostDto(id, count))
            .expect(201)
        return response.body
    },

    async createPosts(authorizationHeader: { [key: string]: string; }, id: string, count: number) {
        const posts: OutputPostType[] = []
        for (let i = 1; i <= count; i++) {
            const response: Response = await req
                .post(SETTINGS.PATH.POSTS)
                .set(authorizationHeader || {})
                .send(postDto.validPostDto(id, i))
                .expect(201)
            posts.push(response.body)
        }
        return posts
    }
}