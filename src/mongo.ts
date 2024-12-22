import { Collection, Db, MongoClient } from "mongodb";

// setup MongoDB
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
let db: Db;

export default async function connectToDatabase() {
    try {
        if (!db) {
            await client.connect();
            console.log("Connected to MongoDB!! Woah!! :P");
            db = client.db();
        }
        return db;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        return;
    }
}