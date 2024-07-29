import {blogCollection, connectToDb, postCollection} from "../../src/db/mongo-db";
import {startMongoServer, stopMongoServer} from "../mongo-memory-setup";
import {Response} from "supertest";
import {req} from "../test-helpers";
import {SETTINGS} from "../../src/settings";
import {blogsTestManager} from "./tests-managers/blogs-test-Manager";
import {postDto} from "../tests-dtos/post-dto";
import {sortParamsDto} from "../tests-dtos/sort-params-dto";
import {postsTestManager} from "./tests-managers/posts-test-Manager";

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

    describe('GET/posts', () => {
        it(`should return posts empty array : STATUS 200`, async () => {
            const result: Response = await req
                .get(SETTINGS.PATH.POSTS)
                .expect(200)
            expect(result.body.items.length).toBe(0)
            // console.log(result.body)
        })
        it(`should return posts with paging : STATUS 200`, async () => {
            const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.ADMIN_AUTH)
            const createBlog = await blogsTestManager.createBlog(authorizationHeader, 1)
            const createPost = await postsTestManager.createPosts(authorizationHeader, createBlog.id, 5)
            const {pageNumber, pageSize, sortBy, sortDirection} = sortParamsDto
            const result: Response = await req
                .get(SETTINGS.PATH.POSTS)
                .query({
                    pageNumber,
                    pageSize,
                    sortBy,
                    sortDirection
                })
                .expect(200)
            expect(result.body.items.length).toBe((createPost).length)
            expect(result.body.totalCount).toBe((createPost).length)
            expect(result.body.items).toEqual(createPost)
            expect(result.body.pagesCount).toBe(1)
            expect(result.body.page).toBe(1)
            expect(result.body.pageSize).toBe(10)
            // console.log(result.body.items)
        })
    })

    describe('GET/posts/:id', () => {
        it(`should return post by ID : STATUS 200`, async () => {
            const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.ADMIN_AUTH)
            const createBlog = await blogsTestManager.createBlog(authorizationHeader, 1)
            const createPost = await postsTestManager.createPost(authorizationHeader, createBlog.id, 1)
            const result: Response = await req
                .get(SETTINGS.PATH.POSTS + '/' + createPost.id)
                .expect(200)
            expect(result.body).toEqual(createPost)
            // console.log(result.body, createPost)
        })
        it(`shouldn't return post by ID if the post does not exist : STATUS 404`, async () => {
            const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.ADMIN_AUTH)
            const createBlog = await blogsTestManager.createBlog(authorizationHeader, 1)
            const createPost = await postsTestManager.createPost(authorizationHeader, createBlog.id, 1)
            const result: Response = await req
                .get(SETTINGS.PATH.POSTS + '/-100')
                .expect(404)
            // console.log(result.body, createPost)
        })
    })

})