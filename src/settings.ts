import {config} from "dotenv";

config()

export const SETTINGS = {
    PORT: process.env.PORT || 3002,
    PATH: {
        BLOGS: '/blogs',
        POSTS: '/posts',
        AUTH: '/auth',
        USERS: '/users',
        COMMENTS: '/comments',
        TESTING: '/testing/all-data'
    },
    ADMIN_AUTH: process.env.ADMIN_AUTH || '',
    SECRET_KEY: process.env.SECRET_KEY || '',
    ACCESS_TOKEN_DURATION: process.env.ACCESS_TOKEN_DURATION || '',
    REFRESH_TOKEN_DURATION: process.env.REFRESH_TOKEN_DURATION || '',
    MONGO_URL: process.env.MONGO_URL || '',
    DB_NAME: process.env.DB_NAME || '',
    BLOG_COLLECTION_NAME: process.env.BLOG_COLLECTION_NAME || '',
    POST_COLLECTION_NAME: process.env.POST_COLLECTION_NAME || '',
    USER_COLLECTION_NAME: process.env.USER_COLLECTION_NAME || '',
    COMMENT_COLLECTION_NAME: process.env.COMMENT_COLLECTION_NAME || '',
    REFRESH_TOKEN_COLLECTION_NAME: process.env.REFRESH_TOKEN_COLLECTION_NAME || '',
    API_CALLS_COLLECTION_NAME: process.env.API_CALLS_COLLECTION_NAME || '',
    EMAIL: process.env.EMAIL || '',
    EMAIL_PASS: process.env.EMAIL_PASS || '',
    TIME_LIMIT_API_CALLS: process.env.TIME_LIMIT_API_CALLS || '',
    NUMBER_LIMIT_API_CALLS: process.env.NUMBER_LIMIT_API_CALLS || ''
}