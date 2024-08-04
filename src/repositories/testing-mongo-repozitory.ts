import {db} from "../db/mongo-db";

export const testingMongoRepository = {
    async deleteAllData() {
        await db.getCollections().blogCollection.deleteMany()
        await db.getCollections().postCollection.deleteMany()
        await db.getCollections().userCollection.deleteMany()
        await db.getCollections().commentCollection.deleteMany()
        await db.getCollections().refreshTokenCollection.deleteMany()
        await db.getCollections().apiCallsCollection.deleteMany()
        await db.getCollections().deviceSessionsCollection.deleteMany()
    }
}