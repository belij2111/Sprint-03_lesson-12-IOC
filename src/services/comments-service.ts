import {Result} from "../common/types/result-type";
import {InputCommentType} from "../types/comment-types";
import {ResultStatus} from "../common/types/result-code";
import {CommentDbType} from "../db/comment-db-type";
import {ObjectId} from "mongodb";
import {postsMongoRepository} from "../repositories/posts-mongo-repository";
import {usersMongoRepository} from "../repositories/users-mongo-repository";
import {UserDbType} from "../db/user-db-type";
import {PostDbType} from "../db/post-db-type";
import {dateTimeIsoString} from "../common/helpers/date-time-iso-string";
import {commentsMongoRepository} from "../repositories/comments-mongo-repository";

export const commentsService = {
    async createComment(postId: string, userId: string, inputComment: InputCommentType): Promise<Result<{
        id: string
    } | null>> {
        const existingUser: UserDbType | null = await usersMongoRepository.findById(new ObjectId(userId))
        if (!existingUser) {
            return {
                status: ResultStatus.Unauthorized,
                extensions: [{field: 'user', message: 'The specified user does not exist'}],
                data: null
            }
        }

        const existingPost: PostDbType | null = await postsMongoRepository.findById(new ObjectId(postId))
        if (!existingPost) {
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'post', message: 'The specified post does not exist'}],
                data: null
            }
        }

        const createNewComment: CommentDbType = {
            _id: new ObjectId(),
            content: inputComment.content,
            commentatorInfo: {
                userId: userId,
                userLogin: existingUser.login
            },
            createdAt: dateTimeIsoString(),
            postId: new ObjectId(postId)
        }
        const result = await commentsMongoRepository.create(createNewComment)
        return {
            status: ResultStatus.Success,
            data: result
        }
    }
}