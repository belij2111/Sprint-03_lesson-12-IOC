import {usersMongoRepository} from "../repositories/users-mongo-repository";
import {LoginInputType, LoginSuccessOutputType} from "../types/auth-types";
import {bcryptService} from "../common/adapters/bcrypt-service";
import {UserDbType} from "../db/user-db-type";
import {Result} from "../common/types/result-type";
import {ResultStatus} from "../common/types/result-code";
import {jwtService} from "../common/adapters/jwt-service";

export const authService = {
    async loginUser(inputAuth: LoginInputType): Promise<Result<LoginSuccessOutputType | null>> {
        const userAuth = await this.authenticateUser(inputAuth)
        if (userAuth.status === ResultStatus.Unauthorized) {
            return {
                status: ResultStatus.Unauthorized,
                extensions: userAuth.extensions,
                data: null
            }
        }
        const accessToken = await jwtService.createToken(userAuth.data)
        return {
            status: ResultStatus.Success,
            data: {accessToken}
        }
    },

    async authenticateUser(inputAuth: LoginInputType): Promise<Result<string | null>> {
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
            data: userAuth._id.toString()
        }
    }
}