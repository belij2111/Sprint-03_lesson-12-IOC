import {blogCollection, connectToDb} from "../../../src/db/mongo-db";
import {SETTINGS} from "../../../src/settings";
import {InputBlogType} from "../../../src/types/blog-types";
import {req} from "../../test-helpers";

describe('/blogs', () => {
    beforeAll(async () => {
        await connectToDb(SETTINGS.MONGO_URL)
        await blogCollection.drop()
    })

    it('should returns the newly created blog', async () => {
        const createBlog: InputBlogType = {
            name: 'Blog 1',
            description: 'This is a new blog',
            websiteUrl: 'https://www.example.com'
        }

        const buff = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf-8');
        const codedAuth = buff.toString('base64');
        const authorizationHeader = {
            'Authorization': `Basic ${codedAuth}`
        }
        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set(authorizationHeader)
            .send(createBlog)
            .expect(201)
        console.log(res.body)
        expect(res.body.name).toBe(createBlog.name)
        expect(res.body.description).toBe(createBlog.description)
        expect(res.body.websiteUrl).toBe(createBlog.websiteUrl)
    })

    it('should return 400 if the input model has incorrect values', async () => {
        const invalidBlog: InputBlogType = {
            name: 'Blog 1',
            description: 'This is a new blog',
            websiteUrl: 'invalid url'
        }

        const buff = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf-8');
        const codedAuth = buff.toString('base64');
        const authorizationHeader = {
            'Authorization': `Basic ${codedAuth}`
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set(authorizationHeader)
            .send(invalidBlog)
            .expect(400)
        console.log(res.body)
        expect(res.body.websiteUrl).not.toBe(invalidBlog.websiteUrl)
        expect(res.body.errorsMessages[0].field).toBe('websiteUrl')
    })

    it('should return 401 if the request is unauthorized', async () => {
        const createBlog: InputBlogType = {
            name: 'Blog 1',
            description: 'This is a new blog',
            websiteUrl: 'https://www.example.com'
        }

        const invalidAuthorizationHeader = {
            'Authorization': `Basic invalid`
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set(invalidAuthorizationHeader)
            .send(createBlog)
            .expect(401)
        console.log(res.status)
        expect(res.status).toBe(401)
    })
})