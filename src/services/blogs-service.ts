import {InputBlogType} from "../types/blog-types";
import {BlogDBType} from "../db/blog-db-type";
import {ObjectId} from "mongodb";
import {dateTimeIsoString} from "../common/helpers/date-time-iso-string";
import {BlogMongoRepository} from "../repositories/blogs-mongo-repository";
import {Result} from "../common/types/result-type";
import {ResultStatus} from "../common/types/result-code";

export class BlogsService {
    constructor(private blogsMongoRepository: BlogMongoRepository) {
    }

    async createBlog(inputBlog: InputBlogType): Promise<Result<{ id: string }>> {
        const createNewBlog: BlogDBType = {
            ...inputBlog,
            _id: new ObjectId(),
            createdAt: dateTimeIsoString(),
            isMembership: false
        }
        const result = await this.blogsMongoRepository.create(createNewBlog)
        return {
            status: ResultStatus.Success,
            data: result
        }
    }

    async updateBlogById(id: string, inputBlog: InputBlogType): Promise<Result<boolean | null>> {
        const findBlog = await this.blogsMongoRepository.findById(new ObjectId(id))
        if (!findBlog)
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'findBlog', message: 'Blog not found'}],
                data: null
            }
        const updateBlog = {
            name: inputBlog.name,
            description: inputBlog.description,
            websiteUrl: inputBlog.websiteUrl
        }
        const result = await this.blogsMongoRepository.updateById(findBlog, updateBlog)
        return {
            status: ResultStatus.Success,
            data: result
        }
    }

    async deleteBlogById(id: string): Promise<Result<boolean | null>> {
        const findBlog = await this.blogsMongoRepository.findById(new ObjectId(id))
        if (!findBlog)
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'findBlog', message: 'Blog not found'}],
                data: null
            }
        const result = await this.blogsMongoRepository.deleteById(findBlog)
        return {
            status: ResultStatus.Success,
            data: result
        }
    }
}