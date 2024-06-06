import {blogCollection, connectToDb} from "../../src/db/mongo-db";
import {SETTINGS} from "../../src/settings";
import {blogDto} from "../tests-dtos/blog-dto";
import {blogsTestManager} from "./tests-managers/blogs-test-Manager";
import {startMongoServer, stopMongoServer} from "../mongo-memory-setup";

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

    it(`should create new blog : STATUS 201`, async () => {
        const validBlog = blogDto.createValidBlogDto()
        const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.ADMIN_AUTH)
        const result = await blogsTestManager.createBlog(validBlog, authorizationHeader)
        console.log(result.body)
        console.log(result.status)

        expect(result.status).toBe(201)
        expect(result.body.name).toBe(validBlog.name)
        expect(result.body.description).toBe(validBlog.description)
        expect(result.body.websiteUrl).toBe(validBlog.websiteUrl)
    })

    it(`shouldn't create new blog with incorrect input data : STATUS 400`, async () => {
        const invalidBlog = blogDto.createInvalidBlogDto()
        const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.ADMIN_AUTH)
        const result = await blogsTestManager.createBlog(invalidBlog, authorizationHeader)
        console.log(result.body)
        console.log(result.status)

        expect(result.status).toBe(400)
    })

    it(`shouldn't create new blog if the request is unauthorized : STATUS 401`, async () => {
        const validBlog = blogDto.createValidBlogDto()
        const invalidAuthorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', '');
        const result = await blogsTestManager.createBlog(validBlog, invalidAuthorizationHeader)
        console.log(result.body)
        console.log(result.status)

        expect(result.status).toBe(401)
    })
})