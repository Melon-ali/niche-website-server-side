const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
const port = 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mc684.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('factoryAve');
        const servicesCollection = database.collection('services');

        // POST API
        app.post('/services', async(req, res) => {
            const service = {
                "price": "1,501", "name":"235 S Avenue 20 3 Ave","description":"If you are looking for a place to buy or rent, we know what to offer you. Taking into consideration all your demands and wishes we will find you are going to find a place for loud parties you are going an ideal solution: neighbors, area, number of rooms, floor, condo or house - individual approach to each client is our main principle.","img":"https://ld-prestashop.template-help.com/prestashop_eze_255/img/p/2/5/25-home_default.jpg"
            }

            const result = await servicesCollection.insertOne(service);
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