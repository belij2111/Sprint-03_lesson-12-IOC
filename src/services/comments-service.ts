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

export class CommentsService {
    private usersMongoRepository: UsersMongoRepository
    private postsMongoRepository: PostsMongoRepository
    private commentsMongoRepository: CommentsMongoRepository
    private likesMongoRepository: LikesMongoRepository

    constructor() {
        this.usersMongoRepository = new UsersMongoRepository()
        this.postsMongoRepository = new PostsMongoRepository()
        this.commentsMongoRepository = new CommentsMongoRepository()
        this.likesMongoRepository = new LikesMongoRepository()
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
        const updateComment = {
            content: inputComment.content
        }
        const result = await this.commentsMongoRepository.update(findComment, updateComment)
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
        const findComment = await this.commentsMongoRepository.findById(new ObjectId(commentId))
        if (!findComment) {
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'findComment', message: 'Comment not found'}],
                data: null
            }
        }
        const findLike = await this.likesMongoRepository.find(userId, commentId)
        let likesInfo
        if (findLike) {
            likesInfo = await this.updateCounts(inputLike.likeStatus, findLike.status, findComment.likesInfo.likesCount, findComment.likesInfo.dislikesCount)
            const updateComment = {
                likesInfo: {
                    ...likesInfo,
                    myStatus: inputLike.likeStatus
                }
            }
            await this.likesMongoRepository.update(findLike, inputLike)
            await this.commentsMongoRepository.update(findComment, updateComment)
        } else {
            const likeDTO: LikeDbType = {
                _id: new ObjectId(),
                createdAt: new Date(),
                status: inputLike.likeStatus,
                authorId: userId,
                parentId: commentId
            }
            await this.likesMongoRepository.create(likeDTO)
            likesInfo = await this.updateCounts(inputLike.likeStatus, LikeStatus.None, findComment.likesInfo.likesCount, findComment.likesInfo.dislikesCount)
            const updateComment = {
                likesInfo: {
                    ...likesInfo,
                    myStatus: inputLike.likeStatus
                }
            }
            await this.commentsMongoRepository.update(findComment, updateComment)
        }
        return {
            status: ResultStatus.Success,
            data: true
        }
    }

    private async updateCounts(newStatus: string, currentStatus: string, likesCount: number, dislikesCount: number) {
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