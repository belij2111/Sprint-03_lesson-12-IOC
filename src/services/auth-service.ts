import {usersMongoRepository} from "../repositories/users-mongo-repository";
import {LoginInputType} from "../types/auth-types";
import {bcryptService} from "../adapters/bcrypt-service";
import {UserDbType} from "../db/user-db-type";

export const authService = {
    async loginUser(inputAuth: LoginInputType): Promise<boolean> {
        const userAuth: UserDbType | null = await usersMongoRepository.findByLoginOrEmail(inputAuth)
        if (!userAuth) return false
        return await bcryptService.checkPassword(inputAuth.password, userAuth.password)
    }
}