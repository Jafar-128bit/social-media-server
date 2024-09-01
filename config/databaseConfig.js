const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://dataCenter01:jafar123@cluster0.1amlo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let db;

const connectDB = async (retries = 3) => {
    while (retries > 0) {
        try {
            // Connect the client to the server (optional starting in v4.7)
            await client.connect();
            // Send a ping to confirm a successful connection
            await client.db("dataBase01").command({ ping: 1 });
            db = await client.db("dataBase01");
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
            break; // Exit the loop if the connection is successful
        } catch (err) {
            retries -= 1;
            console.log(`Error connecting Database. Retries left: ${retries}. Error: ${err.message}`);
            if (retries === 0) {
                throw new Error('Failed to connect to the database after 3 attempts.');
            }
        }
    }
};

const getDb = () => {
    if (!db) {
        throw new Error('Database not initialized. Call connectDB first.');
    }
    return db;
};

module.exports = {
    client,
    connectDB,
    getDb,
};
