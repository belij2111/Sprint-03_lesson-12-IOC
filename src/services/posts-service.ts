import {InputPostType} from "../types/post-types";
import {PostDbType} from "../db/post-db-type";
import {ObjectId} from "mongodb";
import {dateTimeIsoString} from "../common/helpers/date-time-iso-string";
import {PostsMongoRepository} from "../repositories/posts-mongo-repository";
import {Result} from "../common/types/result-type";
import {ResultStatus} from "../common/types/result-code";
import {LikeDbType, LikeStatus} from "../db/like-db-type";
import {LikesMongoRepository} from "../repositories/likes-mongo-repository";
import {InputLikeType} from "../types/like-types";
import {UsersMongoRepository} from "../repositories/users-mongo-repository";

export class PostsService {
    constructor(
        private postsMongoRepository: PostsMongoRepository,
        private usersMongoRepository: UsersMongoRepository,
        private likesMongoRepository: LikesMongoRepository
    ) {
    }

    async createPost(inputPost: InputPostType): Promise<Result<{ id: string } | null>> {
        const findBlog = await this.postsMongoRepository.findBlogById(inputPost.blogId)
        if (!findBlog)
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'findBlog', message: 'Blog not found'}],
                data: null
            }
        const createNewPost: PostDbType = {
            ...inputPost,
            _id: new ObjectId(),
            blogId: findBlog._id,
            blogName: findBlog.name,
            createdAt: dateTimeIsoString(),
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: LikeStatus.None,
                newestLikes: []
            }
        }
        const result = await this.postsMongoRepository.create(createNewPost)
        return {
            status: ResultStatus.Success,
            data: result
        }
    }

    async createPostByBlogId(blogId: string, inputPost: InputPostType): Promise<Result<{ id: string } | null>> {
        const findBlog = await this.postsMongoRepository.findBlogById(blogId)
        if (!findBlog)
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'findBlog', message: 'Blog not found'}],
                data: null
            }
        const createNewPost: PostDbType = {
            ...inputPost,
            _id: new ObjectId(),
            blogId: findBlog._id,
            blogName: findBlog.name,
            createdAt: dateTimeIsoString(),
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: LikeStatus.None,
                newestLikes: []
            }
        }
        const result = await this.postsMongoRepository.createByBlogId(createNewPost)
        return {
            status: ResultStatus.Success,
            data: result
        }
    }

    async updatePostById(id: string, inputPost: InputPostType): Promise<Result<boolean | null>> {
        const findPost = await this.postsMongoRepository.findById(new ObjectId(id))
        if (!findPost)
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'findBlog', message: 'Blog not found'}],
                data: null
            }
        const updatePost = {
            title: inputPost.title,
            shortDescription: inputPost.shortDescription,
            content: inputPost.content
        }
        const result = await this.postsMongoRepository.updateById(findPost, updatePost)
        return {
            status: ResultStatus.Success,
            data: result
        }
    }

    async deletePostById(id: string): Promise<Result<boolean | null>> {
        const findPost = await this.postsMongoRepository.findById(new ObjectId(id))
        if (!findPost)
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'findPost', message: 'Post not found'}],
                data: null
            }
        const result = await this.postsMongoRepository.deleteById(findPost)
        return {
            status: ResultStatus.Success,
            data: result
        }
    }

    async updateLikeStatus(postId: string, inputLike: InputLikeType, userId: string): Promise<Result<boolean | null>> {
        const foundPost = await this.postsMongoRepository.findById(new ObjectId(postId))
        if (!foundPost) {
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'foundPost', message: 'Post not found'}],
                data: null
            }
        }
        const foundUser = await this.usersMongoRepository.findById(new ObjectId(userId))
        const foundLike = await this.likesMongoRepository.find(userId, postId)
        let likesInfo
        if (foundLike) {
            likesInfo = await this.updateCounts(inputLike.likeStatus, foundLike.status, foundPost.extendedLikesInfo.likesCount, foundPost.extendedLikesInfo.dislikesCount)
            const postDTO = {
                extendedLikesInfo: {
                    ...likesInfo,
                    myStatus: inputLike.likeStatus,
                    newestLikes: {
                        addedAt: new Date(),
                        userId: userId,
                        login: foundUser!.login
                    }
                }
            }
            await this.likesMongoRepository.update(foundLike, inputLike)
            await this.postsMongoRepository.updateById(foundPost, postDTO)
        } else {
            const likeDTO: LikeDbType = {
                _id: new ObjectId(),
                createdAt: new Date(),
                status: inputLike.likeStatus,
                authorId: userId,
                parentId: postId
            }
            await this.likesMongoRepository.create(likeDTO)
            likesInfo = await this.updateCounts(inputLike.likeStatus, LikeStatus.None, foundPost.extendedLikesInfo.likesCount, foundPost.extendedLikesInfo.dislikesCount)
            const postDTO = {
                extendedLikesInfo: {
                    ...likesInfo,
                    myStatus: inputLike.likeStatus,
                    newestLikes: {
                        addedAt: new Date(),
                        userId: userId,
                        login: foundUser!.login
                    }
                }
            }
            await this.postsMongoRepository.updateById(foundPost, postDTO)
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