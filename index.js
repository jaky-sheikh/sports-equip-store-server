const express = require('express');
const cors = require('cors');
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middlware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gi5sj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const equipmentCollection = client.db('equipmentDB').collection('equipments');

        const userCollection = client.db('equipmentDB').collection('users');

        // Get all equipment added by a specific user
        app.get('/equipments/:email', async (req, res) => {
            const email = req.params.email;
            const query = { userEmail: email };
            const result = await equipmentCollection.find(query).toArray();
            res.json(result);
        })

        // get operation for update
        app.get('/equipment/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await equipmentCollection.findOne(query);
            res.send(result);
        })

        // add equipments
        app.post('/equipments', async (req, res) => {
            const newEquipment = req.body;
            const result = await equipmentCollection.insertOne(newEquipment);
            res.send(result);
        })

        // add user(register)
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        })

        // app.post('/', async (req, res) => {
        //     const productData = req.body;
        //     const result = await equipmentCollection.insertOne(productData);
        //     res.send(result)
        // });

        // update put operation
        app.patch('/equipment/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedEquipment = req.body;
            const updateEquipment = {
                $set: {
                    image: updatedEquipment.image,
                    itemName: updatedEquipment.itemName,
                    categoryName: updatedEquipment.categoryName,
                    description: updatedEquipment.description,
                    price: updatedEquipment.price,
                    rating: updatedEquipment.rating,
                    customization: updatedEquipment.customization,
                    processingTime: updatedEquipment.processingTime,
                    stockStatus: updatedEquipment.stockStatus,
                }
            }
            const result = await equipmentCollection.updateOne(query, updateEquipment, options);
            res.send(result);
        })

        // Delete operation
        app.delete('/equipments/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await equipmentCollection.deleteOne(filter);
            res.json(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Sports equipment server is running')
})

app.listen(port, () => {
    console.log(`Sports server is running on port: ${port}`)
})
