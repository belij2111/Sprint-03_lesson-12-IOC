import {Request, Response} from "express";
import {securityDevicesMongoQueryRepository} from "../repositories/security-devices-mongo-query-repository";

export const securityDevicesController = {
    async get(req: Request, res: Response) {
        try {
            const devices = await securityDevicesMongoQueryRepository.getDevices(req.user.id)
            if (!devices) {
                res
                    .status(401)
                    .json({})
                return
            }
            res
                .status(200)
                .json(devices)
        } catch (error) {
            res
                .status(500)
                .json({message: 'securityDevicesController.get'})
        }
    }

}