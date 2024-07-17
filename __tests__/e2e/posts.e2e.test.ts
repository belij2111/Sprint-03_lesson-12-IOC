import {blogCollection, connectToDb, postCollection} from "../../src/db/mongo-db";
import {startMongoServer, stopMongoServer} from "../mongo-memory-setup";
import {Response} from "supertest";
import {req} from "../test-helpers";
import {SETTINGS} from "../../src/settings";
import {blogsTestManager} from "./tests-managers/blogs-test-Manager";
import {postDto} from "../tests-dtos/post-dto";

describe('Posts Components', () => {
    beforeAll(async () => {
        await connectToDb(await startMongoServer())
        // await connectToDb(SETTINGS.MONGO_URL)
    })
    afterAll(async () => {
        await stopMongoServer()
    })
    beforeEach(async () => {
        await blogCollection.deleteMany()
        await postCollection.deleteMany()
    })
    afterEach(async () => {
        await blogCollection.deleteMany()
        await postCollection.deleteMany()
    })

    describe('POST/posts', () => {
        it(`should create new post : STATUS 201`, async () => {
            const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.ADMIN_AUTH)
            const createBlog = await blogsTestManager.createBlog(authorizationHeader, 1)
            const validPost = postDto.validPostDto(createBlog.id, 1)

            const result: Response = await req
                .post(SETTINGS.PATH.POSTS)
                .set(authorizationHeader)
                .send(validPost)
                .expect(201)
            expect(result.body).toEqual({
                id: expect.any(String),
                title: validPost.title,
                shortDescription: validPost.shortDescription,
                content: validPost.content,
                blogId: createBlog.id,
                blogName: createBlog.name,
                createdAt: expect.any(String)
            })
            // console.log(result.body, createBlog.name)
        })
        it(`shouldn't create new post with incorrect input data : STATUS 400`, async () => {
            const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.ADMIN_AUTH)
            const createBlog = await blogsTestManager.createBlog(authorizationHeader, 1)
            const invalidPost = postDto.invalidBlogsDto(createBlog.id, 777)
            const result: Response = await req
                .post(SETTINGS.PATH.POSTS)
                .set(authorizationHeader)
                .send(invalidPost)
                .expect(400)
            // console.log(result.body)
        })
        it(`shouldn't create new post if the request is unauthorized : STATUS 401`, async () => {
            const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.ADMIN_AUTH)
            const createBlog = await blogsTestManager.createBlog(authorizationHeader, 1)
            const validPost = postDto.validPostDto(createBlog.id, 1)
            const invalidAuthorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', 'invalid')
            const result: Response = await req
                .post(SETTINGS.PATH.POSTS)
                .set(invalidAuthorizationHeader)
                .send(validPost)
                .expect(401)
            // console.log(result.status)
        })
    })

})