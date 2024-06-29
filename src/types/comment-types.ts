export interface OutputCommentType {
    id: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string
}

export interface InputCommentType {
    content: string
}

