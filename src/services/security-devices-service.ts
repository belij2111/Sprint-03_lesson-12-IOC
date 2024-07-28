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
    }
}