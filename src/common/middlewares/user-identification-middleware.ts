import {NextFunction, Request, Response} from "express";
import {jwtService} from "../adapters/jwt-service";
import {UsersMongoRepository} from "../../repositories/users-mongo-repository";
import {JwtPayload} from "jsonwebtoken";
import {ObjectId} from "mongodb";

class UserIdentificationMiddleware {
    constructor(private usersMongoRepository: UsersMongoRepository) {
    }

    async identifyUser(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            return next()
        }
        const token = req.headers.authorization.split(' ')[1]
        const payload = await jwtService.verifyToken(token) as JwtPayload
        if (payload && payload.userId) {
            const {userId} = payload
            const user = await this.usersMongoRepository.findById(new ObjectId(userId))
            if (user) {
                req.user = {id: userId}
            }
        }
        next()
    }
}

const usersMongoRepository = new UsersMongoRepository()
export const userIdentificationMiddleware = new UserIdentificationMiddleware(usersMongoRepository)