const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');




// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sltxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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

    const coffeeCollection = client.db('coffeeDB').collection('coffees')
    const usersCollection = client.db('coffeeDB').collection('users')
    const ordersCollection = client.db('coffeeDB').collection('orders')


    // read multiple coffee data 
    app.get('/coffees', async (req, res) => {
        const cursor = coffeeCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })


    // read multiple orders
    app.get('/orders', async (req, res) => {
      const cursor = ordersCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })


    // add data to database
    app.post('/coffees', async(req, res) => {
        const newCoffee = req.body;
        console.log(newCoffee);
        const result = await coffeeCollection.insertOne(newCoffee)
        res.send(result);
    })

    // add orders to database
    app.post('/orders', async (req, res) => {
      const newOrder = req.body;
      console.log(newOrder);
      const result = await ordersCollection.insertOne(newOrder);
      res.send(result);
    })

    // delete a data from database
    app.delete('/coffees/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await coffeeCollection.deleteOne(query);
        res.send(result)
    })

    // Update One
    app.put('/coffees/:id', async(req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options = {upsert : true}
        const updatedCoffee = req.body
        const coffee = {
            $set: {
                name: updatedCoffee.name,
                chef: updatedCoffee.chef,
                supplier: updatedCoffee.supplier,
                taste: updatedCoffee.taste,
                category: updatedCoffee.category,
                details: updatedCoffee.details,
                photo: updatedCoffee.photo
            }
        }
        const result = await coffeeCollection.updateOne(filter, coffee, options)
        res.send(result)
    })

    // reading single Data from DB
    app.get('/coffees/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await coffeeCollection.findOne(query)
        res.send(result)
    })



    // user related API
    app.post('/users', async(req, res) => {
      const user = req.body;
        console.log(user);
        const result = await usersCollection.insertOne(user)
        res.send(result);
    })

    app.get('/users', async (req, res) => {
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result)
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
    res.send('Expresso server is running');
})

app.listen(port, () => {
    console.log('Expresso emporium server is running on port ', port);
})