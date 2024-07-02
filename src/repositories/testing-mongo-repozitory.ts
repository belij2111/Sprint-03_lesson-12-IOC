import {blogCollection, commentCollection, postCollection, userCollection} from "../db/mongo-db";

export const testingMongoRepository = {
    async deleteAllData() {
        await blogCollection.deleteMany()
        await postCollection.deleteMany()
        await userCollection.deleteMany()
        await commentCollection.deleteMany()
    }
}