import {Request, Response} from "express";
import {Paginator} from "../common/types/paginator-types";
import {
    SearchEmailTermFieldsType,
    searchEmailTermUtil,
    SearchLoginTermFieldsType,
    searchLoginTermUtil,
    SortQueryFieldsType,
    sortQueryFieldsUtil
} from "../common/helpers/sort-query-fields-util";
import {UsersService} from "../services/users-service";
import {OutputUserType} from "../types/user-types";
import {ResultStatus} from "../common/types/result-code";
import {ErrorResponse} from "../common/types/error-response";
import {UsersMongoQueryRepository} from "../repositories/users-mongo-query-repository";
import {UsersMongoRepository} from "../repositories/users-mongo-repository";

class UsersController {
    constructor(
        private usersService: UsersService,
        private usersMongoQueryRepository: UsersMongoQueryRepository
    ) {
    }

    async create(req: Request, res: Response) {
        try {
            const createdInfo = await this.usersService.createUser(req.body)
            if (createdInfo.status === ResultStatus.BadRequest) {
                res
                    .status(400)
                    .json({errorsMessages: createdInfo.extensions || []})
                return
            }
            if (createdInfo.data && createdInfo.status === ResultStatus.Success) {
                const newUser = await this.usersMongoQueryRepository.getUserById(createdInfo.data.id)
                res
                    .status(201)
                    .json(newUser)
                return
            }
        } catch (error) {
            res
                .status(500)
                .json({message: 'usersController.create'})
        }
    }

    async get(req: Request<SortQueryFieldsType & SearchLoginTermFieldsType & SearchEmailTermFieldsType>, res: Response<Paginator<OutputUserType[]> | ErrorResponse>) {
        try {
            const inputQuery = {
                ...sortQueryFieldsUtil(req.query),
                ...searchLoginTermUtil(req.query),
                ...searchEmailTermUtil(req.query)
            }
            const allUsers = await this.usersMongoQueryRepository.getUsers(inputQuery)
            res
                .status(200)
                .json(allUsers)
        } catch (error) {
            res
                .status(500)
                .json({message: 'usersController.get'})
        }
    }

    async delete(req: Request<{ id: string }>, res: Response) {
        try {
            const deleteUser = await this.usersService.deleteUserById(req.params.id)
            if (deleteUser.status === ResultStatus.NotFound) {
                res
                    .status(404)
                    .json({errorsMessages: deleteUser.extensions || []})
                return
            }
            if (deleteUser.status === ResultStatus.BadRequest) {
                res
                    .status(400)
                    .json({errorsMessages: deleteUser.extensions || []})
                return
            }
            res
                .status(204)
                .json({errorsMessages: deleteUser.extensions || []})
        } catch (error) {
            res
                .status(500)
                .json({message: 'usersController.delete'})
        }
    }
}

const usersMongoRepository = new UsersMongoRepository()
const usersService = new UsersService(usersMongoRepository)
const usersMongoQueryRepository = new UsersMongoQueryRepository()
export const usersController = new UsersController(usersService, usersMongoQueryRepository)