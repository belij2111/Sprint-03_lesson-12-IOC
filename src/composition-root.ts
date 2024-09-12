import {Container} from 'inversify'
import {BlogsController} from "./controllers/blogs-controller";
import {AuthController} from "./controllers/auth-controller";
import {CommentsController} from "./controllers/comments-controller";
import {PostsController} from "./controllers/posts-controller";
import {SecurityDevicesController} from "./controllers/security-devices-controller";
import {TestingController} from "./controllers/testing-controller";
import {UsersController} from "./controllers/users-controller";
import {AuthBasicMiddleware} from "./common/middlewares/auth-basic-middleware";
import {AuthBearerMiddleware} from "./common/middlewares/auth-bearer-middleware";
import {LogApiCallsMiddleware} from "./common/middlewares/log-api-calls-middleware";
import {RefreshTokenMiddleware} from "./common/middlewares/refresh-token-middleware";
import {UserIdentificationMiddleware} from "./common/middlewares/user-identification-middleware";
import {BlogsMongoQueryRepository} from "./repositories/blogs-mongo-query-repository";
import {UsersService} from "./services/users-service";
import {AuthService} from "./services/auth-service";
import {BlogsService} from "./services/blogs-service";
import {CommentsService} from "./services/comments-service";
import {PostsService} from "./services/posts-service";
import {SecurityDevicesService} from "./services/security-devices-service";
import {AuthMongoRepository} from "./repositories/auth-mongo-repository";
import {BlogMongoRepository} from "./repositories/blogs-mongo-repository";
import {CommentsMongoQueryRepository} from "./repositories/comments-mongo-query-repository";
import {CommentsMongoRepository} from "./repositories/comments-mongo-repository";
import {LikesMongoRepository} from "./repositories/likes-mongo-repository";
import {PostsMongoQueryRepository} from "./repositories/posts-mongo-query-repository";
import {PostsMongoRepository} from "./repositories/posts-mongo-repository";
import {SecurityDevicesMongoQueryRepository} from "./repositories/security-devices-mongo-query-repository";
import {SecurityDevicesMongoRepository} from "./repositories/security-devices-mongo-repository";
import {TestingMongoRepository} from "./repositories/testing-mongo-repozitory";
import {UsersMongoQueryRepository} from "./repositories/users-mongo-query-repository";
import {UsersMongoRepository} from "./repositories/users-mongo-repository";

export const container = new Container()
container.bind(AuthController).toSelf()
container.bind(BlogsController).toSelf()
container.bind(CommentsController).toSelf()
container.bind(PostsController).toSelf()
container.bind(SecurityDevicesController).toSelf()
container.bind(TestingController).toSelf()
container.bind(UsersController).toSelf()

container.bind(AuthBasicMiddleware).toSelf()
container.bind(AuthBearerMiddleware).toSelf()
container.bind(LogApiCallsMiddleware).toSelf()
container.bind(RefreshTokenMiddleware).toSelf()
container.bind(UserIdentificationMiddleware).toSelf()

container.bind(AuthService).toSelf()
container.bind(BlogsService).toSelf()
container.bind(CommentsService).toSelf()
container.bind(PostsService).toSelf()
container.bind(SecurityDevicesService).toSelf()
container.bind(UsersService).toSelf()

container.bind(AuthMongoRepository).toSelf()
container.bind(BlogsMongoQueryRepository).toSelf()
container.bind(BlogMongoRepository).toSelf()
container.bind(CommentsMongoQueryRepository).toSelf()
container.bind(CommentsMongoRepository).toSelf()
container.bind(LikesMongoRepository).toSelf()
container.bind(PostsMongoQueryRepository).toSelf()
container.bind(PostsMongoRepository).toSelf()
container.bind(SecurityDevicesMongoQueryRepository).toSelf()
container.bind(SecurityDevicesMongoRepository).toSelf()
container.bind(TestingMongoRepository).toSelf()
container.bind(UsersMongoQueryRepository).toSelf()
container.bind(UsersMongoRepository).toSelf()