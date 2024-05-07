import {blogCollection, postCollection} from "../db/mongo-db";

export const testingMongoRepository = {
    async deleteAllData() {
        await blogCollection.deleteMany()
        await postCollection.deleteMany()
    }
}