import {usersMongoRepository} from "../repositories/users-mongo-repository";
import {LoginInputType} from "../types/auth-types";
import {bcryptService} from "../common/adapters/bcrypt-service";
import {UserDbType} from "../db/user-db-type";
import {Result} from "../common/types/result-type";
import {ResultStatus} from "../common/types/result-code";

export const authService = {
    async loginUser(inputAuth: LoginInputType): Promise<Result<boolean | null>> {
        const userAuth: UserDbType | null = await usersMongoRepository.findByLoginOrEmail(inputAuth)
        if (!userAuth) {
            return {
                status: ResultStatus.Unauthorized,
                extensions: [{field: 'login or email', message: 'Login or email is not unique'}],
                data: null
            }
        }
        const result = await bcryptService.checkPassword(inputAuth.password, userAuth.password)
        if (!result) {
            return {
                status: ResultStatus.Unauthorized,
                extensions: [{field: 'password', message: 'Password is wrong'}],
                data: null
            }
        }
        return {
            status: ResultStatus.Success,
            data: result
        }
    }

    // async loginUser(inputAuth: LoginInputType): Promise<boolean> {
    //     const userAuth: UserDbType | null = await usersMongoRepository.findByLoginOrEmail(inputAuth)
    //     if (!userAuth) return false
    //     return await bcryptService.checkPassword(inputAuth.password, userAuth.password)
    // }
}