import {Request, Response} from "express";
import {securityDevicesMongoQueryRepository} from "../repositories/security-devices-mongo-query-repository";
import {securityDevicesService} from "../services/security-devices-service";

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
    },

    async delete(req: Request, res: Response) {
        try {
            const userId = req.user.id
            const currentDevice = req.deviceId
            const deleteSessionsExceptCurrent = await securityDevicesService.deleteSessionsExceptCurrent(userId, currentDevice)
            res
                .status(204)
                .json({errorsMessages: deleteSessionsExceptCurrent.extensions || []})
        } catch (error) {
            res
                .status(500)
                .json({message: 'securityDevicesController.delete'})
        }
    }

}