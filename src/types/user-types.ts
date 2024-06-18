import {
    SearchEmailTermFilterType,
    SearchLoginTermFilterType,
    SortQueryFilterType
} from "../common/helpers/sort-query-fields-util";

export interface OutputUserType {
    id: string,
    login: string,
    email: string,
    createdAt: string
}

export interface InputUserType {
    login: string,
    password: string,
    email: string
}

export interface QueryUserFilterType extends SortQueryFilterType, SearchLoginTermFilterType, SearchEmailTermFilterType {
}