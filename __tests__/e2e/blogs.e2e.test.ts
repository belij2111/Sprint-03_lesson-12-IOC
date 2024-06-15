import {blogCollection, connectToDb} from "../../src/db/mongo-db";
import {SETTINGS} from "../../src/settings";
import {blogDto} from "../tests-dtos/blog-dto";
import {blogsTestManager} from "./tests-managers/blogs-test-Manager";
import {startMongoServer, stopMongoServer} from "../mongo-memory-setup";
import {req} from "../test-helpers";
import {Response} from "supertest";

describe('/blogs', () => {
    beforeAll(async () => {
        await connectToDb(await startMongoServer())
        // await connectToDb(SETTINGS.MONGO_URL)
        await blogCollection.deleteMany()
    })

    afterAll(async () => {
        await blogCollection.deleteMany()
        await stopMongoServer()
    })

    it('should return version number', async () => {
        await req
            .get('/')
            .expect({version: '1.0'})
    })

    it(`should create new blog : STATUS 201`, async () => {
        const validBlog = blogDto.createValidBlogDto()
        const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.ADMIN_AUTH)
        const result: Response = await req
            .post(SETTINGS.PATH.BLOGS)
            .set(authorizationHeader)
            .send(validBlog)
            .expect(201)
        expect(result.body).toEqual({
            id: expect.any(String),
            name: validBlog.name,
            description: validBlog.description,
            websiteUrl: validBlog.websiteUrl,
            createdAt: expect.any(String),
            isMembership: expect.any(Boolean)
        })
    })

    it(`shouldn't create new blog with incorrect input data : STATUS 400`, async () => {
        const invalidBlog = blogDto.createInvalidBlogDto()
        const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.ADMIN_AUTH)
        await req
            .post(SETTINGS.PATH.BLOGS)
            .set(authorizationHeader)
            .send(invalidBlog)
            .expect(400)
    })

    it(`shouldn't create new blog if the request is unauthorized : STATUS 401`, async () => {
        const validBlog = blogDto.createValidBlogDto()
        const invalidAuthorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', 'invalid');
        await req
            .post(SETTINGS.PATH.BLOGS)
            .set(invalidAuthorizationHeader)
            .send(validBlog)
            .expect(401)
    })

    it(`should return blogs with paging : STATUS 200`, async () => {
        await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(200)
    });
})