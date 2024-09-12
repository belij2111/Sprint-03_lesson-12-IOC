import {Result} from "../common/types/result-type";
import {InputCommentType} from "../types/comment-types";
import {ResultStatus} from "../common/types/result-code";
import {CommentDbType} from "../db/comment-db-type";
import {ObjectId} from "mongodb";
import {PostsMongoRepository} from "../repositories/posts-mongo-repository";
import {UsersMongoRepository} from "../repositories/users-mongo-repository";
import {UserDbType} from "../db/user-db-type";
import {PostDbType} from "../db/post-db-type";
import {dateTimeIsoString} from "../common/helpers/date-time-iso-string";
import {CommentsMongoRepository} from "../repositories/comments-mongo-repository";
import {InputLikeType} from "../types/like-types";
import {LikesMongoRepository} from "../repositories/likes-mongo-repository";
import {LikeDbType, LikeStatus} from "../db/like-db-type";
import {inject, injectable} from "inversify";

@injectable()
export class CommentsService {
    constructor(
        @inject(UsersMongoRepository) private usersMongoRepository: UsersMongoRepository,
        @inject(PostsMongoRepository) private postsMongoRepository: PostsMongoRepository,
        @inject(CommentsMongoRepository) private commentsMongoRepository: CommentsMongoRepository,
        @inject(LikesMongoRepository) private likesMongoRepository: LikesMongoRepository
    ) {
    }

    async createComment(postId: string, userId: string, inputComment: InputCommentType): Promise<Result<{
        id: string
    } | null>> {
        const existingUser: UserDbType | null = await this.usersMongoRepository.findById(new ObjectId(userId))
        if (!existingUser) {
            return {
                status: ResultStatus.Unauthorized,
                extensions: [{field: 'user', message: 'The specified user does not exist'}],
                data: null
            }
        }
        const existingPost: PostDbType | null = await this.postsMongoRepository.findById(new ObjectId(postId))
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
            postId: new ObjectId(postId),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: LikeStatus.None
            }
        }
        const result = await this.commentsMongoRepository.create(createNewComment)
        return {
            status: ResultStatus.Success,
            data: result
        }
    }

    async updateComment(id: string, inputComment: InputCommentType, userId: string): Promise<Result<boolean | null>> {
        const foundComment = await this.commentsMongoRepository.findById(new ObjectId(id))
        if (!foundComment) {
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'foundComment', message: 'Comment not found'}],
                data: null
            }
        }
        if (foundComment.commentatorInfo.userId !== userId) {
            return {
                status: ResultStatus.Forbidden,
                extensions: [{field: 'user', message: 'The comment is not your own'}],
                data: null
            }
        }
        const updateComment = {
            content: inputComment.content
        }
        const result = await this.commentsMongoRepository.update(foundComment, updateComment)
        return {
            status: ResultStatus.Success,
            data: result
        }
    }

    async deleteCommentById(id: string, userId: string): Promise<Result<boolean | null>> {
        const checkId = this.commentsMongoRepository.checkObjectId(id)
        if (!checkId)
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'checkId', message: 'Invalid id'}],
                data: null
            }
        const findComment = await this.commentsMongoRepository.findById(new ObjectId(id))
        if (!findComment) {
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'findComment', message: 'Comment not found'}],
                data: null
            }
        }
        if (findComment.commentatorInfo.userId !== userId) {
            return {
                status: ResultStatus.Forbidden,
                extensions: [{field: 'user', message: 'The comment is not your own'}],
                data: null
            }
        }
        const result = await this.commentsMongoRepository.deleteById(findComment)
        return {
            status: ResultStatus.Success,
            data: result
        }
    }

    async updateLikeStatus(commentId: string, inputLike: InputLikeType, userId: string): Promise<Result<boolean | null>> {
        const foundComment = await this.commentsMongoRepository.findById(new ObjectId(commentId))
        if (!foundComment) {
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'foundComment', message: 'Comment not found'}],
                data: null
            }
        }
        const foundLike = await this.likesMongoRepository.find(userId, commentId)
        let likesInfo
        if (foundLike) {
            likesInfo = this.updateCounts(inputLike.likeStatus, foundLike.status, foundComment.likesInfo.likesCount, foundComment.likesInfo.dislikesCount)
            const updateComment = {
                likesInfo: {
                    ...likesInfo,
                    myStatus: inputLike.likeStatus
                }
            }
            await this.likesMongoRepository.update(foundLike, inputLike)
            await this.commentsMongoRepository.update(foundComment, updateComment)
        } else {
            const likeDTO: LikeDbType = {
                _id: new ObjectId(),
                createdAt: new Date(),
                status: inputLike.likeStatus,
                authorId: userId,
                parentId: commentId
            }
            await this.likesMongoRepository.create(likeDTO)
            likesInfo = this.updateCounts(inputLike.likeStatus, LikeStatus.None, foundComment.likesInfo.likesCount, foundComment.likesInfo.dislikesCount)
            const updateComment = {
                likesInfo: {
                    ...likesInfo,
                    myStatus: inputLike.likeStatus
                }
            }
            await this.commentsMongoRepository.update(foundComment, updateComment)
        }
        return {
            status: ResultStatus.Success,
            data: true
        }
    }

    private updateCounts(newStatus: string, currentStatus: string, likesCount: number, dislikesCount: number) {
        if (newStatus === currentStatus) {
            return {likesCount, dislikesCount}
        }
        switch (newStatus) {
            case LikeStatus.Like:
                if (currentStatus === LikeStatus.None) {
                    likesCount++
                } else if (currentStatus === LikeStatus.Dislike) {
                    likesCount++
                    dislikesCount--
                }
                break
            case LikeStatus.Dislike:
                if (currentStatus === LikeStatus.None) {
                    dislikesCount++
                } else if (currentStatus === LikeStatus.Like) {
                    likesCount--
                    dislikesCount++
                }
                break
            case LikeStatus.None:
                if (currentStatus === LikeStatus.Like) {
                    likesCount--
                } else if (currentStatus === LikeStatus.Dislike) {
                    dislikesCount--
                }
                break
        }
        return {likesCount, dislikesCount}
    }
}