const express = require('express')
require('dotenv').config()

const bodyParser = require('body-parser');
const cors = require('cors');

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qd8gm.mongodb.net/onlineGrosery?retryWrites=true&w=majority`;

const app = express()

app.use(express.json());
app.use(cors());
const port = 5000


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("onlineGrosery").collection("products");

    app.post('/products', (req, res) => {
        const newProducts = req.body;
        productsCollection.insertOne(newProducts)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
        console.log(newProducts);
    })

    app.get('/ordered', (req, res) => {
        // console.log(req.query.email);
        productsCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
});

client.connect(err => {
    const storageCollection = client.db("onlineGrosery").collection("storageProducts");

    app.post('/addProducts', (req, res) => {
        const products = req.body;
        console.log(products);
        storageCollection.insertOne(products)
            .then(result => {
                console.log(result);
                res.send(result.insertedCount)
            })
    })

    app.get('/allProducts', (req, res) => {
        storageCollection.find({})
        .toArray((err, documents)=>{
            res.send(documents)
        })
    })
});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port);