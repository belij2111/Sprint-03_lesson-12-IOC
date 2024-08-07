import mongoose from 'mongoose'

export const db = {
    async run(DB_URL: string): Promise<boolean> {
        try {
            await mongoose.connect(DB_URL)
            console.log('Connected to db')
            return true
        } catch (e) {
            console.log(e)
            await mongoose.disconnect()
            return false
        }
    },

    async stop() {
        await mongoose.disconnect()
        console.log('Connected  successfully closed')
    },

    async drop() {
        try {
            const collections = mongoose.connection.collections
            for (const key in collections) {
                await collections[key].deleteMany({})
            }
        } catch (e) {
            console.error('Error in drop db', e)
            await this.stop()
        }
    }
}