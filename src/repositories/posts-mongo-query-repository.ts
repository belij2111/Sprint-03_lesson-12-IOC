import {OutputPostType} from "../types/post-types";
import {PostDbType} from "../db/post-db-type";
import {BlogDBType} from "../db/blog-db-type";
import {ObjectId} from "mongodb";
import {Paginator} from "../common/types/paginator-types";
import {SortQueryFilterType} from "../common/helpers/sort-query-fields-util";
import {PostModel} from "../domain/post.entity";
import {BlogModel} from "../domain/blog.entity";
import {LikeStatus} from "../db/like-db-type";
import {LikeModel} from "../domain/like.entity";
import {injectable} from "inversify";

@injectable()
export class PostsMongoQueryRepository {
    async getPost(inputQuery: SortQueryFilterType, userId: string): Promise<Paginator<OutputPostType[]>> {
        const filter = {}
        const items = await PostModel
            .find(filter)
            .sort({[inputQuery.sortBy]: inputQuery.sortDirection})
            .skip((inputQuery.pageNumber - 1) * inputQuery.pageSize)
            .limit(inputQuery.pageSize)
            .lean()
            .exec()
        const totalCount = await PostModel.countDocuments(filter)
        const currentsStatuses = await Promise.all(items.map(el => this.getStatus(el._id.toString(), userId)))
        return {
            pagesCount: Math.ceil(totalCount / inputQuery.pageSize),
            page: inputQuery.pageNumber,
            pageSize: inputQuery.pageSize,
            totalCount,
            items: items.map((el, index) => this.postMapToOutput(el, currentsStatuses[index]))
        }
    }

    async getPostById(id: string, userId: string): Promise<OutputPostType | null> {
        if (!this.checkObjectId(id)) return null
        const post = await this.findById(new ObjectId(id))
        if (!post) return null
        const currentStatus = await this.getStatus(post._id.toString(), userId)
        return this.postMapToOutput(post, currentStatus)
    }

    async getPostsByBlogId(blogId: string, inputQuery: SortQueryFilterType, userId: string): Promise<Paginator<OutputPostType[]> | null> {
        if (!this.checkObjectId(blogId)) return null
        const blog = await this.findBlogById(blogId)
        if (!blog) return null
        const byId = blogId ? {blogId: new ObjectId(blogId)} : {}
        const filter = {
            ...byId
        }
        const items = await PostModel
            .find(filter)
            .sort({[inputQuery.sortBy]: inputQuery.sortDirection})
            .skip((inputQuery.pageNumber - 1) * inputQuery.pageSize)
            .limit(inputQuery.pageSize)
            .lean()
            .exec()
        const totalCount = await PostModel.countDocuments(filter)
        const currentsStatuses = await Promise.all(items.map(el => this.getStatus(el._id.toString(), userId)))
        return {
            pagesCount: Math.ceil(totalCount / inputQuery.pageSize),
            page: inputQuery.pageNumber,
            pageSize: inputQuery.pageSize,
            totalCount,
            items: items.map((el, index) => this.postMapToOutput(el, currentsStatuses[index]))
        }
    }

    async findById(id: ObjectId): Promise<PostDbType | null> {
        return PostModel.findOne({_id: id})
    }

    async findBlogById(blogId: string): Promise<BlogDBType | null> {
        return BlogModel.findOne({_id: new ObjectId(blogId)})
    }

    private async getStatus(postId: string, userId: string,): Promise<LikeStatus> {
        if (!userId) return LikeStatus.None
        const like = await LikeModel.findOne({authorId: userId, parentId: postId})
        return like ? like.status : LikeStatus.None
    }

    postMapToOutput(post: PostDbType, currentStatus: string): OutputPostType {
        const newestLikes = post.extendedLikesInfo.newestLikes.map(el => ({
            addedAt: el.addedAt,
            userId: el.userId,
            login: el.login
        }))
        return <OutputPostType>{
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId.toString(),
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: post.extendedLikesInfo.likesCount,
                dislikesCount: post.extendedLikesInfo.dislikesCount,
                myStatus: currentStatus,
                newestLikes: newestLikes
            }
        }
    }

    checkObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    }
}