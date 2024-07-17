import {connectToDb, postCollection} from "../../src/db/mongo-db";
import {startMongoServer, stopMongoServer} from "../mongo-memory-setup";

describe('Posts Components', () => {
    beforeAll(async () => {
        await connectToDb(await startMongoServer())
        // await connectToDb(SETTINGS.MONGO_URL)
    })
    afterAll(async () => {
        await stopMongoServer()
    })
    beforeEach(async () => {
        await postCollection.deleteMany()
    })
    afterEach(async () => {
        await postCollection.deleteMany()
    })

})