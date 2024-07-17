import {blogCollection, connectToDb} from "../../src/db/mongo-db";
import {SETTINGS} from "../../src/settings";
import {blogDto} from "../tests-dtos/blog-dto";
import {blogsTestManager} from "./tests-managers/blogs-test-Manager";
import {startMongoServer, stopMongoServer} from "../mongo-memory-setup";
import {req} from "../test-helpers";
import {Response} from "supertest";
import {sortParamsDto} from "../tests-dtos/sort-params-dto";
import {ObjectId} from "mongodb";

describe('Blogs Components', () => {
    beforeAll(async () => {
        await connectToDb(await startMongoServer())
        // await connectToDb(SETTINGS.MONGO_URL)
    })
    afterAll(async () => {
        await blogCollection.deleteMany()
        await stopMongoServer()
    })
    beforeEach(async () => {
        await blogCollection.deleteMany()
    })
    afterEach(async () => {
        await blogCollection.deleteMany()
    })
    it('should return version number', async () => {
        await req
            .get('/')
            .expect({version: '1.0'})
    })

    describe('GET/blogs', () => {
        it(`should return blogs empty array : STATUS 200`, async () => {
            const result: Response = await req
                .get(SETTINGS.PATH.BLOGS)
                .expect(200)
            expect(result.body.items.length).toBe(0)
            // console.log(result.body)
        })
        it(`should return blogs with paging : STATUS 200`, async () => {
            const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.ADMIN_AUTH)
            const createBlogs = await blogsTestManager.createBlogs(authorizationHeader, 4)
            const {pageNumber, pageSize, sortBy, sortDirection} = sortParamsDto
            const searchNameTerm = "Blog"
            const result: Response = await req
                .get(SETTINGS.PATH.BLOGS)
                .query({
                    searchNameTerm,
                    pageNumber,
                    pageSize,
                    sortBy,
                    sortDirection
                })
                .expect(200)
            expect(result.body.items.length).toBe(createBlogs.length)
            expect(result.body.totalCount).toBe(createBlogs.length)
            expect(result.body.items).toEqual(createBlogs)
            expect(result.body.pagesCount).toBe(1)
            expect(result.body.page).toBe(1)
            expect(result.body.pageSize).toBe(10)
            // console.log(result.body.items)
        })
    })

    describe('POST/blogs', () => {
        it(`should create new blog : STATUS 201`, async () => {
            const validBlog = blogDto.validBlogsDto(1)
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
            // console.log(result.body)
        })
        it(`shouldn't create new blog with incorrect input data : STATUS 400`, async () => {
            const invalidBlog = blogDto.invalidBlogsDto(777)
            const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.ADMIN_AUTH)
            const result: Response = await req
                .post(SETTINGS.PATH.BLOGS)
                .set(authorizationHeader)
                .send(invalidBlog)
                .expect(400)
            // console.log(result.body)
        })
        it(`shouldn't create new blog if the request is unauthorized : STATUS 401`, async () => {
            const validBlog = blogDto.validBlogsDto(1)
            const invalidAuthorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', 'invalid')
            const result: Response = await req
                .post(SETTINGS.PATH.BLOGS)
                .set(invalidAuthorizationHeader)
                .send(validBlog)
                .expect(401)
            // console.log(result.status)
        })
    })

    describe('GET/blogs/:id', () => {
        it(`should return blog by ID : STATUS 200`, async () => {
            const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.ADMIN_AUTH)
            const createBlog = await blogsTestManager.createBlog(authorizationHeader, 1)
            const result: Response = await req
                .get(SETTINGS.PATH.BLOGS + '/' + createBlog.id)
                .expect(200)
            expect(result.body).toEqual(createBlog)
            // console.log(result.body, createBlog)
        })
        it(`shouldn't return blog by ID if the blog does not exist : STATUS 404`, async () => {
            const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.ADMIN_AUTH)
            const createBlog = await blogsTestManager.createBlog(authorizationHeader, 1)
            const result: Response = await req
                .get(SETTINGS.PATH.BLOGS + '/-100')
                .expect(404)
            // console.log(result.body, createBlog)
        })
    })

    describe('PUT/blogs/:id', () => {
        it(`should update blog by ID : STATUS 204`, async () => {
            const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.ADMIN_AUTH)
            const createBlog = await blogsTestManager.createBlog(authorizationHeader, 1)
            const updateBlog = blogDto.validBlogsDto(555)
            const result: Response = await req
                .put(SETTINGS.PATH.BLOGS + '/' + createBlog.id)
                .set(authorizationHeader)
                .send(updateBlog)
                .expect(204)
            expect(result.body).toEqual({})
            // console.log(createBlog, updateBlog, result.status)
        })
        it(`shouldn't update blog by ID with incorrect input data : STATUS 400`, async () => {
            const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.ADMIN_AUTH)
            const createBlog = await blogsTestManager.createBlog(authorizationHeader, 2)
            const invalidUpdateBlog = blogDto.invalidBlogsDto(0)
            const result: Response = await req
                .put(SETTINGS.PATH.BLOGS + '/' + createBlog.id)
                .set(authorizationHeader)
                .send(invalidUpdateBlog)
                .expect(400)
            expect(result.body.errorsMessages).toEqual([{message: expect.any(String), field: 'websiteUrl'},])
            // console.log(createBlog, invalidUpdateBlog, result.body.errorsMessages)
        })
        it(`shouldn't update blog by ID : STATUS 401`, async () => {
            const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.ADMIN_AUTH)
            const createBlog = await blogsTestManager.createBlog(authorizationHeader, 1)
            const invalidAuthorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', 'invalid')
            const updateBlog = blogDto.validBlogsDto(333)
            const result: Response = await req
                .put(SETTINGS.PATH.BLOGS + '/' + createBlog.id)
                .set(invalidAuthorizationHeader)
                .send(updateBlog)
                .expect(401)
            // console.log(createBlog, updateBlog, result.status)
        })
        it(`shouldn't update blog by ID if the blog does not exist : STATUS 404`, async () => {
            const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.ADMIN_AUTH)
            const createBlog = await blogsTestManager.createBlog(authorizationHeader, 1)
            const updateBlog = blogDto.validBlogsDto(2)
            const result: Response = await req
                .put(SETTINGS.PATH.BLOGS + '/' + new ObjectId())
                .set(authorizationHeader)
                .send(updateBlog)
                .expect(404)
            // console.log(createBlog, updateBlog, result.status)
        })
    })

    describe('DELETE/blogs/:id', () => {
        it(`should delete blog by ID : STATUS 204`, async () => {
            const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.ADMIN_AUTH)
            const createBlog = await blogsTestManager.createBlog(authorizationHeader, 1)
            const result: Response = await req
                .delete(SETTINGS.PATH.BLOGS + '/' + createBlog.id)
                .set(authorizationHeader)
                .expect(204)
            // console.log(result.body, result.status)
        })
        it(`shouldn't delete blog by ID if the request is unauthorized : STATUS 401`, async () => {
            const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.ADMIN_AUTH)
            const createBlog = await blogsTestManager.createBlog(authorizationHeader, 1)
            const invalidAuthorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', 'invalid')
            const result: Response = await req
                .delete(SETTINGS.PATH.BLOGS + '/' + createBlog.id)
                .set(invalidAuthorizationHeader)
                .expect(401)
            // console.log(result.status)
        })
        it(`shouldn't delete blog by ID if the blog does not exist : STATUS 404`, async () => {
            const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.ADMIN_AUTH)
            const createBlog = await blogsTestManager.createBlog(authorizationHeader, 1)
            const result: Response = await req
                .delete(SETTINGS.PATH.BLOGS + '/' + new ObjectId())
                .set(authorizationHeader)
                .expect(404)
            expect(result.body).toHaveProperty('message', 'Blog not found')
            // console.log(result.body)
        })
    })

})