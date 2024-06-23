import jwt from "jsonwebtoken"
import {SETTINGS} from "../../settings";

export const jwtService = {
    async createToken(userId: string | null): Promise<string> {
        return jwt.sign(
            {userId: userId},
            SETTINGS.SECRET_KEY,
            {expiresIn: SETTINGS.TOKEN_DURATION}
        )
    },

    async decodeToken(token: string) {
        try {
            return jwt.decode(token)
        } catch (error) {
            console.error('Can`t decode token')
            return null
        }
    },

    async verifyToken(token: string) {
        try {
            return jwt.verify(token, SETTINGS.SECRET_KEY)
        } catch (error) {
            console.error('Token verify some error')
            return null
        }
    }
}