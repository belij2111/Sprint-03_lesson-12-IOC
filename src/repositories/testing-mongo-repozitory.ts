import {BlogModel} from "../domain/blog.entity";
import {PostModel} from "../domain/post.entity";
import {UserModel} from "../domain/user.entity";
import {CommentModel} from "../domain/comment.entity";
import {RefreshTokenModel} from "../domain/refresh-token.entity";
import {ApiCallsModel} from "../domain/api-calls.entity";
import {DeviceSessionsModel} from "../domain/device-sessions.entity";
import {LikeModel} from "../domain/like.entity";

export class TestingMongoRepository {
    async deleteAllData() {
        await BlogModel.deleteMany()
        await PostModel.deleteMany()
        await UserModel.deleteMany()
        await CommentModel.deleteMany()
        await RefreshTokenModel.deleteMany()
        await ApiCallsModel.deleteMany()
        await DeviceSessionsModel.deleteMany()
        await LikeModel.deleteMany()
    }
}