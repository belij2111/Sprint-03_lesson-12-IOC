import {Result} from "../common/types/result-type";
import {
    SecurityDevicesMongoRepository
} from "../repositories/security-devices-mongo-repository";
import {ResultStatus} from "../common/types/result-code";
import {inject, injectable} from "inversify";

@injectable()
export class SecurityDevicesService {
    constructor(@inject(SecurityDevicesMongoRepository) private securityDevicesMongoRepository: SecurityDevicesMongoRepository) {
    }

    async deleteSessionsExceptCurrent(userId: string, currentDeviceId: string): Promise<Result<boolean | null>> {
        const result = await this.securityDevicesMongoRepository.deleteExceptCurrent(userId, currentDeviceId)
        return {
            status: ResultStatus.Success,
            extensions: [{field: 'terminate  sessions', message: 'All sessions except the current one are completed'}],
            data: result
        }
    }

    async deleteByDeviceId(userId: string, deviceId: string): Promise<Result<boolean | null>> {
        const checkId = this.securityDevicesMongoRepository.checkObjectId(userId)
        if (!checkId)
            return {
                status: ResultStatus.BadRequest,
                extensions: [{field: 'checkId', message: 'Invalid id'}],
                data: null
            }
        const findDevice = await this.securityDevicesMongoRepository.findByDeviceId(deviceId)
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
        const result = await this.securityDevicesMongoRepository.deleteByDeviceId(findDevice.deviceId)
        return {
            status: ResultStatus.Success,
            data: result
        }
    }
}