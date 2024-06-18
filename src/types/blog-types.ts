import {SearchNameTermFilterType, SortQueryFilterType} from "../common/helpers/sort-query-fields-util";

export interface OutputBlogType {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export interface InputBlogType {
    name: string,
    description: string,
    websiteUrl: string
}

export interface QueryBlogFilterType extends SortQueryFilterType, SearchNameTermFilterType {
}
