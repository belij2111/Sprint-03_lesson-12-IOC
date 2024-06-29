import {UserDbType} from "../../db/user-db-type";
import {JwtPayload} from "jsonwebtoken";

declare global {
    namespace Express {
        export interface Request {
            user: JwtPayload
        }
    }
}