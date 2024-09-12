import {ObjectId} from "mongodb";
import {OutputDeviseSessionsType} from "../types/device-sessions-types";
import {DeviceSessionsDbType} from "../db/device-sessions-db-type";
import {DeviceSessionsModel} from "../domain/device-sessions.entity";
import {injectable} from "inversify";

@injectable()
export class SecurityDevicesMongoQueryRepository {
    async getDevices(userId: string): Promise<OutputDeviseSessionsType[] | null> {
        if (!this.checkObjectId(userId)) return null
        const devices = await this.findByUserId(userId)
        return devices.map(this.deviceSessionsMapToOutput)
    }

    async findByUserId(userId: string) {
        return DeviceSessionsModel.find({userId})
    }

    deviceSessionsMapToOutput(devices: DeviceSessionsDbType): OutputDeviseSessionsType {
        return {
            ip: devices.ip,
            title: devices.deviceName,
            lastActiveDate: devices.iatDate,
            deviceId: devices.deviceId
        }
    }

    checkObjectId(id: string): boolean {
        return ObjectId.isValid(id)
    }
}