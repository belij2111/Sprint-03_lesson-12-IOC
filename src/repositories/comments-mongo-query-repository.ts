import {ObjectId} from "mongodb";
import {OutputCommentType} from "../types/comment-types";
import {CommentDbType} from "../db/comment-db-type";
import {SortQueryFilterType} from "../common/helpers/sort-query-fields-util";
import {Paginator} from "../common/types/paginator-types";
import {PostDbType} from "../db/post-db-type";
import {CommentModel} from "../domain/comment.entity";
import {PostModel} from "../domain/post.entity";
import {LikeStatus} from "../db/like-db-type";
import {LikeModel} from "../domain/like.entity";

export class CommentsMongoQueryRepository {
    async getCommentsByPostId(postId: string, inputQuery: SortQueryFilterType, userId: string): Promise<Paginator<OutputCommentType[]> | null> {
        if (!this.checkObjectId(postId)) return null
        const post = await this.findPostById(new ObjectId(postId))
        if (!post) return null
        const byId = postId ? {postId: new ObjectId(postId)} : {}
        const filter = {
            ...byId
        }
        const items = await CommentModel
            .find(filter)
            .sort({[inputQuery.sortBy]: inputQuery.sortDirection})
            .skip((inputQuery.pageNumber - 1) * inputQuery.pageSize)
            .limit(inputQuery.pageSize)
            .lean()
            .exec()
        const totalCount = await CommentModel.countDocuments(filter)
        const currentsStatuses = await Promise.all(items.map(el => this.getStatus(el._id.toString(), userId)))
        return {
            pagesCount: Math.ceil(totalCount / inputQuery.pageSize),
            page: inputQuery.pageNumber,
            pageSize: inputQuery.pageSize,
            totalCount,
            items: items.map((el, index) => this.commentMapToOutput(el, currentsStatuses[index]))
        }
    }

    async getCommentById(id: string, userId: string): Promise<OutputCommentType | null> {
        if (!this.checkObjectId(id)) return null
        const comment = await this.findById(new ObjectId(id))
        if (!comment) return null
        const currentStatus = await this.getStatus(comment._id.toString(), userId)
        return this.commentMapToOutput(comment, currentStatus)
    }

    async findPostById(postId: ObjectId): Promise<PostDbType | null> {
        return PostModel.findOne({_id: postId})
    }

    async findById(id: ObjectId): Promise<CommentDbType | null> {
        return CommentModel.findOne({_id: id})
    }

   private async getStatus(commentId: string, userId: string,): Promise<LikeStatus> {
        if (!userId) return LikeStatus.None
        const like = await LikeModel.findOne({authorId: userId, parentId: commentId})
        return like ? like.status : LikeStatus.None
    }

    commentMapToOutput(comment: CommentDbType, currentStatus: string): OutputCommentType {
        return <OutputCommentType>{
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.commentatorInfo.userId,
                userLogin: comment.commentatorInfo.userLogin
            },
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: comment.likesInfo.likesCount,
                dislikesCount: comment.likesInfo.dislikesCount,
                myStatus: currentStatus
            }
        }
    }

    checkObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    }
}