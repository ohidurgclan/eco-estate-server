const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5030;


//Middle Ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mvbo5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('eco_estate');
        const servicesCollection = database.collection('services');
        const userCollection = database.collection('userservices');
        const userReview = database.collection('user_review');
        const userOrder = database.collection('user_order');

        // Get Service API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        });
        // Add Service
        app.post('/services', async (req, res) => {
            const serviceItem = req.body;
            const result = await servicesCollection.insertOne(serviceItem);
            console.log(result);
            res.json(result)
        });
        // Add Review
        app.post('/user_review', async (req, res) => {
            const reviewItem = req.body;
            const result = await userReview.insertOne(reviewItem);
            console.log(result);
            res.json(result)
        });
        // Get Review
        app.get('/user_review', async (req, res) => {
            const cursor = userReview.find({});
            const review = await cursor.toArray();
            res.send(review);
        });

        // Place Order
        app.post('/user_order', async (req, res) => {
            const orderItem = req.body;
            const result = await userOrder.insertOne(orderItem);
            console.log(result);
            res.json(result)
        });

        // Find API
        app.get("/userservice", async (req, res) => {
        const cursor = userCollection.find({});
        const orders = await cursor.toArray();
        res.send(orders);
        });

        // Get Api by users email
        app.get("/user_order/:email", async (req, res) => {
        const cursor = userCollection.find({ email: req.params.email });
        const orders = await cursor.toArray();
        res.send(orders);
        });
        // Api Post
        app.post("/userservice", async (req, res) => {
        const user = req.body;
        const result = await userCollection.insertOne(user);
        res.json(result);
        });
    
        // Get a user data
        app.get("/userservice/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await userCollection.findOne(query);
        res.send(result);
        });

        // Update Data By User
        app.put("/userservice/:id", async (req, res) => {
        const id = req.params.id;
        const updatedUser = req.body;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
            status: updatedUser.status,
            },
        };
        const resut = await userCollection.updateOne(filter, updateDoc, options);
        res.json(resut);
        });
        
        // Delete Order
        app.delete("/userservice/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await userCollection.deleteOne(query);

        res.json(result);
        });
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Assignment Twelve Server Running');
});

app.listen(port, () => {
    console.log("Example App Port", port)
});