import {Result} from "../common/types/result-type";
import {securityDevicesMongoRepository} from "../repositories/security-devices-mongo-repository";
import {ResultStatus} from "../common/types/result-code";

export const securityDevicesService = {
    async deleteSessionsExceptCurrent(userId: string, currentDeviceId: string): Promise<Result<boolean | null>> {
        const result = await securityDevicesMongoRepository.deleteExceptCurrent(userId, currentDeviceId)
        return {
            status: ResultStatus.Success,
            extensions: [{field: 'terminate  sessions', message: 'All sessions except the current one are completed'}],
            data: result
        }
    },

    async deleteByDeviceId(userId: string, deviceId: string): Promise<Result<boolean | null>> {
        const checkId = securityDevicesMongoRepository.checkObjectId(userId)
        if (!checkId)
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'checkId', message: 'Invalid id'}],
                data: null
            }
        const findDevice = await securityDevicesMongoRepository.findByDeviceId(deviceId)
        if (!findDevice) {
            return {
                status: ResultStatus.NotFound,
                extensions: [{field: 'deviceId', message: 'The device was not found'}],
                data: null
            }
        }
        if (userId !== findDevice.userId) {
            return {
                status: ResultStatus.Forbidden,
                extensions: [{field: 'deviceId', message: `You cannot delete another user's device ID`}],
                data: null
            }
        }
        const result = await securityDevicesMongoRepository.deleteByDeviceId(findDevice.deviceId)
        return {
            status: ResultStatus.Success,
            data: result
        }
    }
}