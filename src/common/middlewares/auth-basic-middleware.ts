import {NextFunction, Request, Response} from "express";
import {SETTINGS} from "../../settings";

export const authBasicMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers['authorization'] as string
    if (!auth) {
        res
            .status(401)
            .json({})
        return
    }

    const buff = Buffer.from(SETTINGS.ADMIN_AUTH, 'utf-8')
    const codedAuth = buff.toString('base64')

    if (auth.slice(6) !== codedAuth || auth.slice(0, 5) !== 'Basic') {
        res
            .status(401)
            .json({})
        return
    }
    next()
}