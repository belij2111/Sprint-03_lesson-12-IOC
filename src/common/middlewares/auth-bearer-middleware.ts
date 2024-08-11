import {NextFunction, Request, Response} from "express";
import {jwtService} from "../adapters/jwt-service";
import {UsersMongoRepository} from "../../repositories/users-mongo-repository";
import {JwtPayload} from "jsonwebtoken";
import {ObjectId} from "mongodb";

class AuthBearerMiddleware {
    private usersMongoRepository: UsersMongoRepository

    constructor() {
        this.usersMongoRepository = new UsersMongoRepository()
    }

    async checkAuth(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            res
                .status(401)
                .json({})
            return
        }

        const token = req.headers.authorization.split(' ')[1]
        const payload = await jwtService.verifyToken(token) as JwtPayload
        if (payload) {
            const {userId} = payload
            const user = await this.usersMongoRepository.findById(new ObjectId(userId))
            if (!user) {
                res
                    .status(401)
                    .json({})
                return
            }
            req.user = {id: userId}
            return next()
        }
        res
            .status(401)
            .json({})
        return
    }
}

export const authBearerMiddleware = new AuthBearerMiddleware()