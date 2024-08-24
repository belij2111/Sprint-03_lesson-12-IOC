import {LikeStatus} from "../db/like-db-type";

export interface OutputCommentType {
    id: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string,
    likesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: LikeStatus
    }
}

export interface InputCommentType {
    content: string
}

