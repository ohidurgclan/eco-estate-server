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
        const userCollection = database.collection('users');
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
        // Delete Service
        app.delete("/services/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await servicesCollection.deleteOne(query);
        res.json(result);
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
        // Get Orders
        app.get('/user_order', async (req, res) => {
            const cursor = userOrder.find({});
            const order = await cursor.toArray();
            res.send(order);
        });


        // Create Users
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            console.log(result);
            res.json(result)
        });

        // /Upsert For Google Sign in
        app.put('/users', async (req, res) => {
            const user = req.body;
            const find = { email: user.email };
            const option = { upsert: true };
            const updateDoc = { $set: user }
            const result = await userCollection.updateOne(find, updateDoc, option);
            res.json(result)
        });
        // Make Admin
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            console.log('put', user);
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.json(result);
        });
        // Get Admin
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const quarry = { email: email };
            const user = await userCollection.findOne(quarry);
            let isAdmin = false;
            if (user?.role === 'admin'){
                isAdmin = true;
            }
            res.json({ admin: isAdmin});
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
    
        // Get a user data
        app.get("/user_order/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await userCollection.findOne(query);
        res.send(result);
        });

        // Update Data By Admin
        app.put("/user_order/:id", async (req, res) => {
        const id = req.params.id;
        const updatedUser = req.body;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
            status: updatedUser.status,
            },
        };
        const resut = await userOrder.updateOne(filter, updateDoc, options);
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