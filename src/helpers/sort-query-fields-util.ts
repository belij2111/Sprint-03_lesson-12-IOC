export interface SortQueryFieldsType {
    pageNumber?: number,
    pageSize?: string,
    sortBy?: string,
    sortDirection?: string
}

export interface SortQueryFilterType {
    pageNumber: number,
    pageSize: number,
    sortBy: string,
    sortDirection: 1 | -1
}

export interface SearchNameTermFieldsType {
    searchNameTerm?: string
}

export interface SearchNameTermFilterType {
    searchNameTerm: string
}

export const sortQueryFieldsUtil = (query: SortQueryFieldsType): SortQueryFilterType => {
    const pageNumber = !isNaN(Number(query.pageNumber)) ? Number(query.pageNumber) : 1
    const pageSize = !isNaN(Number(query.pageSize)) ? Number(query.pageSize) : 10
    const sortBy = query.sortBy ? query.sortBy : 'createdAt'
    const sortDirection: 1 | -1 = query.sortDirection === 'asc' ? 1 : -1

    return {
        pageNumber,
        pageSize,
        sortBy,
        sortDirection
    }
}

export const searchNameTermUtil = (query: SearchNameTermFieldsType): SearchNameTermFilterType => {
    const searchNameTerm = typeof query.searchNameTerm === 'string' ? query.searchNameTerm : ''

    return {
        searchNameTerm
    }
}