import {db} from "../../src/db/mongo-db";
import {startMongoServer, stopMongoServer} from "../mongo-memory-setup";
import {Response} from "supertest";
import {req} from "../test-helpers";
import {SETTINGS} from "../../src/settings";
import {blogsTestManager} from "./tests-managers/blogs-test-Manager";
import {postDto} from "../tests-dtos/post-dto";
import {sortParamsDto} from "../tests-dtos/sort-params-dto";
import {postsTestManager} from "./tests-managers/posts-test-Manager";
import {ObjectId} from "mongodb";

describe('Posts Components', () => {
    beforeAll(async () => {
        await db.run(await startMongoServer())
        // await db.run(SETTINGS.MONGO_URL)
    })
    afterAll(async () => {
        await stopMongoServer()
    })
    beforeEach(async () => {
        await db.drop()
    })
    afterEach(async () => {
        await db.drop()
    })

    describe('POST/posts', () => {
        it(`should create new post : STATUS 201`, async () => {
            const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.AUTH_SECRETS.ADMIN_AUTH)
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
            const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.AUTH_SECRETS.ADMIN_AUTH)
            const createBlog = await blogsTestManager.createBlog(authorizationHeader, 1)
            const invalidPost = postDto.invalidPostDto(createBlog.id, 777)
            const result: Response = await req
                .post(SETTINGS.PATH.POSTS)
                .set(authorizationHeader)
                .send(invalidPost)
                .expect(400)
            // console.log(result.body)
        })
        it(`shouldn't create new post if the request is unauthorized : STATUS 401`, async () => {
            const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.AUTH_SECRETS.ADMIN_AUTH)
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
            const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.AUTH_SECRETS.ADMIN_AUTH)
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
            const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.AUTH_SECRETS.ADMIN_AUTH)
            const createBlog = await blogsTestManager.createBlog(authorizationHeader, 1)
            const createPost = await postsTestManager.createPost(authorizationHeader, createBlog.id, 1)
            const result: Response = await req
                .get(SETTINGS.PATH.POSTS + '/' + createPost.id)
                .expect(200)
            expect(result.body).toEqual(createPost)
            // console.log(result.body, createPost)
        })
        it(`shouldn't return post by ID if the post does not exist : STATUS 404`, async () => {
            const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.AUTH_SECRETS.ADMIN_AUTH)
            const createBlog = await blogsTestManager.createBlog(authorizationHeader, 1)
            const createPost = await postsTestManager.createPost(authorizationHeader, createBlog.id, 1)
            const result: Response = await req
                .get(SETTINGS.PATH.POSTS + '/-100')
                .expect(404)
            // console.log(result.body, createPost)
        })
    })

    describe('PUT/posts/:id', () => {
        it(`should update post by ID : STATUS 204`, async () => {
            const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.AUTH_SECRETS.ADMIN_AUTH)
            const createBlog = await blogsTestManager.createBlog(authorizationHeader, 1)
            const createPost = await postsTestManager.createPost(authorizationHeader, createBlog.id, 1)
            const updatePost = postDto.validPostDto(createBlog.id, 555)
            const result: Response = await req
                .put(SETTINGS.PATH.POSTS + '/' + createPost.id)
                .set(authorizationHeader)
                .send(updatePost)
                .expect(204)
            expect(result.body).toEqual({})
            // console.log(createPost, updatePost, result.status)
        })
        it(`shouldn't update post by ID with incorrect input data : STATUS 400`, async () => {
            const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.AUTH_SECRETS.ADMIN_AUTH)
            const createBlog = await blogsTestManager.createBlog(authorizationHeader, 1)
            const createPost = await postsTestManager.createPost(authorizationHeader, createBlog.id, 1)
            const invalidUpdatePost = postDto.invalidPostDto(createBlog.id, 0)
            const result: Response = await req
                .put(SETTINGS.PATH.POSTS + '/' + createPost.id)
                .set(authorizationHeader)
                .send(invalidUpdatePost)
                .expect(400)
            expect(result.body.errorsMessages).toEqual([{message: expect.any(String), field: 'title'},])
            // console.log(createPost, invalidUpdatePost, result.body.errorsMessages)
        })
        it(`shouldn't update post by ID : STATUS 401`, async () => {
            const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.AUTH_SECRETS.ADMIN_AUTH)
            const createBlog = await blogsTestManager.createBlog(authorizationHeader, 1)
            const createPost = await postsTestManager.createPost(authorizationHeader, createBlog.id, 1)
            const invalidAuthorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', 'invalid')
            const updatePost = postDto.validPostDto(createBlog.id, 555)
            const result: Response = await req
                .put(SETTINGS.PATH.POSTS + '/' + createPost.id)
                .set(invalidAuthorizationHeader)
                .send(updatePost)
                .expect(401)
            // console.log(createPost, updatePost, result.status)
        })
        it(`shouldn't update post by ID if the post does not exist : STATUS 404`, async () => {
            const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.AUTH_SECRETS.ADMIN_AUTH)
            const createBlog = await blogsTestManager.createBlog(authorizationHeader, 1)
            const createPost = await postsTestManager.createPost(authorizationHeader, createBlog.id, 1)
            const updatePost = postDto.validPostDto(createBlog.id, 555)
            const result: Response = await req
                .put(SETTINGS.PATH.POSTS + '/' + new ObjectId())
                .set(authorizationHeader)
                .send(updatePost)
                .expect(404)
            // console.log(createPost, updatePost, result.status)
        })
    })

    describe('DELETE/post/:id', () => {
        it(`should delete post by ID : STATUS 204`, async () => {
            const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.AUTH_SECRETS.ADMIN_AUTH)
            const createBlog = await blogsTestManager.createBlog(authorizationHeader, 1)
            const createPost = await postsTestManager.createPost(authorizationHeader, createBlog.id, 1)
            const result: Response = await req
                .delete(SETTINGS.PATH.POSTS + '/' + createPost.id)
                .set(authorizationHeader)
                .expect(204)
            // console.log(result.body, result.status)
        })
        it(`shouldn't delete post by ID if the request is unauthorized : STATUS 401`, async () => {
            const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.AUTH_SECRETS.ADMIN_AUTH)
            const createBlog = await blogsTestManager.createBlog(authorizationHeader, 1)
            const createPost = await postsTestManager.createPost(authorizationHeader, createBlog.id, 1)
            const invalidAuthorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', 'invalid')
            const result: Response = await req
                .delete(SETTINGS.PATH.POSTS + '/' + createPost.id)
                .set(invalidAuthorizationHeader)
                .expect(401)
            // console.log(result.status)
        })
        it(`shouldn't delete post by ID if the post does not exist : STATUS 404`, async () => {
            const authorizationHeader = await blogsTestManager.createAuthorizationHeader('Basic', SETTINGS.AUTH_SECRETS.ADMIN_AUTH)
            const createBlog = await blogsTestManager.createBlog(authorizationHeader, 1)
            const createPost = await postsTestManager.createPost(authorizationHeader, createBlog.id, 1)
            const result: Response = await req
                .delete(SETTINGS.PATH.POSTS + '/' + new ObjectId())
                .set(authorizationHeader)
                .expect(404)
            // console.log(result.body)
        })
    })

})