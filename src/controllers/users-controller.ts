import {Request, Response} from "express";
import {Paginator} from "../types/paginator-types";
import {
    SearchEmailTermFieldsType,
    searchEmailTermUtil,
    SearchLoginTermFieldsType, searchLoginTermUtil,
    SortQueryFieldsType,
    sortQueryFieldsUtil
} from "../helpers/sort-query-fields-util";
import {usersService} from "../services/users-service";
import {usersMongoQueryRepository} from "../repositories/users-mongo-query-repository";
import {OutputUserType} from "../types/user-types";

export const usersController = {
    async create(req: Request, res: Response) {
        const createdInfo = await usersService.createUser(req.body)
        const newUser = await usersMongoQueryRepository.getUserById(createdInfo.id)
        res
            .status(201)
            .json(newUser)
    },

    async get(req: Request<SortQueryFieldsType & SearchLoginTermFieldsType & SearchEmailTermFieldsType>, res: Response<Paginator<OutputUserType[]>>) {
        const inputQuery = {
            ...sortQueryFieldsUtil(req.query),
            ...searchLoginTermUtil(req.query),
            ...searchEmailTermUtil(req.query)
        }
        const allUsers = await usersMongoQueryRepository.getUsers(inputQuery)
        res
            .status(200)
            .json(allUsers)
    },

    async delete(req: Request<{ id: string }>, res: Response) {
        const deleteUser = await usersService.deleteUserById(req.params.id)
        if (!deleteUser) {
            res
                .status(404)
                .json({message: 'Blog not found'})
            return
        }
        res
            .status(204)
            .json({message: 'Blog deleted successfully'})
    }
}