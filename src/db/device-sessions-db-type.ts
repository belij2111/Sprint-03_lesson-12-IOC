export interface DeviceSessionsDbType {
    userId: string | null,
    deviceId: string,
    ip: string,
    deviceName: string,
    iatDate: string,
    expDate: string
}