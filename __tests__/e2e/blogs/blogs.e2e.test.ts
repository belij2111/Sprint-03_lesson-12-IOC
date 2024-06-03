import {blogCollection, connectToDb} from "../../../src/db/mongo-db";
import {SETTINGS} from "../../../src/settings";
import {InputBlogType} from "../../../src/types/blog-types";
import {req} from "../../test-helpers";

describe('/blogs', () => {
    beforeAll(async () => {
        await connectToDb(SETTINGS.MONGO_URL)
    })

    it('should create new blog', async () => {
        await blogCollection.drop()
        const newBlog: InputBlogType = {
            name: 'Blog 1',
            description: 'main blog 1',
            websiteUrl: 'https://www.example.com'
        }

        const buff = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf-8');
        const codedAuth = buff.toString('base64');

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set(`Authorization`, `Basic ${codedAuth}`)
            .send(newBlog)
            .expect(201)
        console.log(res.body)
        expect(res.body.name).toBe(newBlog.name)
        expect(res.body.description).toBe(newBlog.description)
        expect(res.body.websiteUrl).toBe(newBlog.websiteUrl)
    });
})