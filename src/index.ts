import {SETTINGS} from "./settings";
import {app} from "./app";
import {connectToDb} from "./db/mongo-db";

const startApp = async () => {
    if (!await connectToDb(SETTINGS.MONGO_URL)) {
        console.log('not connected to db');
        process.exit(1)
    }
    app.listen(SETTINGS.PORT, () => {
        console.log('...server started 1')
    })
}

startApp()
