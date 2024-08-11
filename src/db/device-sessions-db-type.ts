export class DeviceSessionsDbType {
    constructor(
        public userId: string | null,
        public deviceId: string,
        public ip: string,
        public deviceName: string,
        public iatDate: string,
        public expDate: string
    ) {
    }
}