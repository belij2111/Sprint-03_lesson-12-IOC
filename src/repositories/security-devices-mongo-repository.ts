import {deviceSessionsCollection} from "../db/mongo-db";
import {DeviceSessionsDbType} from "../db/device-sessions-db-type";
import {ObjectId} from "mongodb";

export const securityDevicesMongoRepository = {
    async create(deviceSessionData: DeviceSessionsDbType) {
        const result = await deviceSessionsCollection.insertOne(deviceSessionData)
        return {id: result.insertedId.toString()}
    },

    async findByDeviceId(deviceId: string) {
        return await deviceSessionsCollection.findOne({deviceId})
    },

    async updateByDeviceId(deviceId: string, iatDate: string): Promise<boolean> {
        const result = await deviceSessionsCollection.updateOne(
            {deviceId: deviceId},
            {$set: {'iatDate': iatDate}}
        )
        return result.modifiedCount !== 0
    },

    async deleteExceptCurrent(userId: string, currentDeviceId: string): Promise<boolean | null> {
        if (!this.checkObjectId(userId)) return null
        await deviceSessionsCollection.deleteMany({
            userId,
            deviceId: {$ne: currentDeviceId}
        })
        return true
    },

    async deleteByDeviceId(deviceId: string): Promise<boolean | null> {
        const result = await deviceSessionsCollection.deleteOne({deviceId})
        return result.deletedCount !== 0
    },

    checkObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    }
}