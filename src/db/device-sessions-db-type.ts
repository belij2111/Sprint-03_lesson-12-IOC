export interface DeviceSessionsDbType {
    userId: string,
    deviceId: string,
    iatDate: Date,
    deviceName: string,
    ip: string,
    expDate: Date
}