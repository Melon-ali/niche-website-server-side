const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mc684.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('factoryAve');
        const productCollection = database.collection('products');
        const userCollection = database.collection('users');
        const orderCollection = database.collection('orders');
        const reviewCollection = database.collection('reviews');


        // Post Add Products
        app.post('/addproducts', async (req, res) => {
            const products = req.body;
            const result = await productCollection.insertOne(products)
            console.log(result);
            res.json(result)
        })

        // Post User 
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user)
            console.log(result);
            res.json(result)
        })

        //Post Orders
        app.post('/orders', async (req, res) => {
            const data= req.body;
            const result = await orderCollection.insertOne(data)
            res.json(result);
        });
        
        // Post Reviews
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review)
            console.log(result)
            res.json(result);
        })

        // Get Orders
        app.get('/orders', async(req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.json(orders);
        });

        // Get Eamil
        app.get('/emailorder',async (req,res)=>{
            const email = req.query.email;
            const query = {email:email}
            const cursor = orderCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })

        //Get All Order 
        app.get('/allorder',async (req,res)=>{
            const cursor = orderCollection.find({});
            const result = await cursor.toArray();
            res.send(result)

        })

        // Get Reviews
        app.get('/reviews', async (req, res)=> {
            const cursor = reviewCollection.find({});
            const result = await cursor.toArray();
            console.log(result);
            res.send(result);
        })

        // Make admin

        app.put('/user/admin',async (req,res)=>{
            const user = req.body;
            const filter = {email:user.email};
            const updateDoc = {$set: {role:'admin'}}
            const result = await userCollection.updateOne(filter,updateDoc);
            res.json(result);

        })

        // Get user Email
        app.get('/user/:email',async(req,res)=>{
            const email = req.params.email;
            const query = {email:email};
            const user = await userCollection.findOne(query); 
            let isAdmin = false;
            if(user?.role === 'admin'){
                isAdmin= true;
            }
            res.json({admin:isAdmin}); 
        })

        // GET Products API
        app.get('/products', async(req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

        // Get Service
        app.get('/products/:id', async(req, res) => {
            const id = req.params.id;
            console.log('getting startted' , id);
            const query = {_id: ObjectId(id)};
            const product = await productCollection.findOne(query);
            res.json(product);
        })
        
    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Factory Ave');
});

app.listen(port, () => {
    console.log('Running Factory Server On Port', port);
})
