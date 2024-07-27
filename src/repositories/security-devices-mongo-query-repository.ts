import {ObjectId} from "mongodb";
import {deviceSessionsCollection} from "../db/mongo-db";
import {OutputDeviseSessionsType} from "../types/device-sessions-types";
import {DeviceSessionsDbType} from "../db/device-sessions-db-type";

export const securityDevicesMongoQueryRepository = {
    async getDevices(userId: string): Promise<OutputDeviseSessionsType[] | null> {
        if (!this.checkObjectId(userId)) return null
        const devices = await this.findByUserId(userId)
        return devices.map(this.deviceSessionsMapToOutput)
    },

    async findByUserId(userId: string) {
        return await deviceSessionsCollection.find({userId}).toArray()
    },

    deviceSessionsMapToOutput(devices: DeviceSessionsDbType): OutputDeviseSessionsType {
        return {
            ip: devices.ip,
            title: devices.deviceName,
            lastActiveDate: devices.iatDate,
            deviceId: devices.deviceId
        }
    },

    checkObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    }
}