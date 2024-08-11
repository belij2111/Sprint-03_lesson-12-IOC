import {DeviceSessionsDbType} from "../db/device-sessions-db-type";
import {ObjectId} from "mongodb";
import {DeviceSessionsModel} from "../domain/device-sessions.entity";

export class SecurityDevicesMongoRepository {
    async create(deviceSessionData: DeviceSessionsDbType) {
        const result = await DeviceSessionsModel.create(deviceSessionData)
        return {id: result._id.toString()}
    }

    async findByDeviceId(deviceId: string) {
        return DeviceSessionsModel.findOne({deviceId})
    }

    async updateByDeviceId(deviceId: string, iatDate: string): Promise<boolean> {
        const result = await DeviceSessionsModel.updateOne(
            {deviceId: deviceId},
            {$set: {'iatDate': iatDate}}
        )
        return result.modifiedCount !== 0
    }

    async deleteExceptCurrent(userId: string, currentDeviceId: string): Promise<boolean | null> {
        if (!this.checkObjectId(userId)) return null
        await DeviceSessionsModel.deleteMany({
            userId,
            deviceId: {$ne: currentDeviceId}
        })
        return true
    }

    async deleteByDeviceId(deviceId: string): Promise<boolean | null> {
        const result = await DeviceSessionsModel.deleteOne({deviceId})
        return result.deletedCount !== 0
    }

    checkObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    }
}