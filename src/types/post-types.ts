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

export interface Paginator<T> {
    // pagesCount: number
    // page: number
    // pageSize: number
    // totalCount: number
    items: T[]
}