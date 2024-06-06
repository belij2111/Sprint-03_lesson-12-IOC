import {MongoMemoryServer} from "mongodb-memory-server";

let mongoServer: MongoMemoryServer

export async function startMongoServer() {
    mongoServer = await MongoMemoryServer.create()
    return mongoServer.getUri();
}

export async function stopMongoServer() {
    if (mongoServer) {
        await mongoServer.stop()
    }
}