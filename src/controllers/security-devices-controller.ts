import {Request, Response} from "express";
import {securityDevicesMongoQueryRepository} from "../repositories/security-devices-mongo-query-repository";
import {securityDevicesService} from "../services/security-devices-service";
import {ResultStatus} from "../common/types/result-code";

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
    },

    async deleteByDeviceId(req: Request<{ deviceId: string }>, res: Response) {
        try {
            const userId = req.user.id
            const deviceId = req.params.deviceId
            const deleteSession = await securityDevicesService.deleteByDeviceId(userId, deviceId)
            if (deleteSession.status === ResultStatus.BadRequest) {
                res
                    .status(400)
                    .json({errorsMessages: deleteSession.extensions || []})
                return
            }
            if (deleteSession.status === ResultStatus.NotFound) {
                res
                    .status(404)
                    .json({errorsMessages: deleteSession.extensions || []})
                return
            }
            if (deleteSession.status === ResultStatus.Forbidden) {
                res
                    .status(403)
                    .json({errorsMessages: deleteSession.extensions || []})
                return
            }
            res
                .status(204)
                .json({})
        } catch (error) {
            res
                .status(500)
                .json({message: 'securityDevicesController.deleteByDeviceId'})
        }
    }

}