export interface OutputPostType {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}

export interface InputPostType {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}