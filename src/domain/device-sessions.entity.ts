import mongoose, {Schema} from "mongoose";
import {SETTINGS} from "../settings";
import {DeviceSessionsDbType} from "../db/device-sessions-db-type";

export const DeviceSessionsSchema = new mongoose.Schema<DeviceSessionsDbType>({
    userId: {type: String, required: true},
    deviceId: {type: String, required: true},
    ip: {type: String, required: true},
    deviceName: {type: String, required: true},
    iatDate: {type: String, required: true},
    expDate: {type: String, required: true}
})

export const DeviceSessionsModel = mongoose.model<DeviceSessionsDbType>(SETTINGS.COLLECTION_NAME.DEVICE_SESSIONS, DeviceSessionsSchema)