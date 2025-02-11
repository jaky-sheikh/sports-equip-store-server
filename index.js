const express = require('express');
const cors = require('cors');
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        // add equipments
        app.post('/equipments', async (req, res) => {
            const newEquipment = req.body;
            const result = await equipmentCollection.insertOne(newEquipment);
            res.send(result);
        })

        // equipment list
        app.get("http://localhost:5000/equipments/user", async (req, res) => {
            try {
                const userEmail = req.query.email;
                if (!userEmail) return res.status(400).json({ error: "User email required" });

                const userEquipments = await equipmentCollection.find({ userEmail }).toArray();
                res.status(200).json(userEquipments);
            } catch (error) {
                res.status(500).json({ error: "Failed to fetch equipments" });
            }
        });

        //   delete equipment list
        app.delete("http://localhost:5000/equipments/:id", async (req, res) => {
            try {
                const id = req.params.id;
                const result = await equipmentCollection.deleteOne({ _id: new ObjectId(id) });

                if (result.deletedCount === 1) {
                    res.status(200).json({ message: "Equipment deleted successfully" });
                } else {
                    res.status(404).json({ error: "Equipment not found" });
                }
            } catch (error) {
                res.status(500).json({ error: "Failed to delete equipment" });
            }
        });

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
