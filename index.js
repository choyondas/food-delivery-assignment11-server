const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config()
const { MongoClient } = require('mongodb');


const ObjectId = require('mongodb').ObjectID;

//middleware configuration
app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5ryo5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const serviceCollection = client.db("fastFood").collection("service");
    const ordersCollection = client.db("fastFood").collection("orders");
    const burgersCollection = client.db("fastFood").collection("burgers");
    const address = client.db("fastFood").collection("address");





    const placeorderCollection = client.db("fastFood").collection("placeorder");





    app.post("/addServices", (req, res) => {

        serviceCollection.insertOne(req.body)
            .then((result) => {
                res.send(result.insertedId);
            })
    })


    //get all services

    app.get('/services', async (req, res) => {
        const result = await serviceCollection.find({}).toArray();
        res.send(result);

    })

    //delete service collection

    app.delete('/deleteServices/:id', async (req, res) => {
        console.log(req.params.id);

        const result = await serviceCollection.deleteOne({
            _id: ObjectId(req.params.id),
        })
        res.send(result);

    })


    //get single service collection
    app.get('/singleService/:id', (req, res) => {
        console.log(req.params.id);
        serviceCollection.findOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result);
            });
    });

    //update addServices
    app.put('/update/:id', (req, res) => {
        const id = req.params.id;
        const updatedInfo = req.body;
        const filter = { _id: ObjectId(id) };
        serviceCollection.updateOne(filter, {
            $set: {
                name: updatedInfo.name,
                price: updatedInfo.price,
            },
        })
            .then((result) => {
                console.log(result);
                res.send(result);
            });
    });

    //add orders
    app.post("/addOrder", (req, res) => {


        ordersCollection.insertOne(req.body)
            .then((result) => {
                res.send(result);
            })
    });

    //get myorders
    app.get('/myOrders/:email', async (req, res) => {
        console.log(req.params.email);
    })



    //add burgers 
    app.post('/burgers', (req, res) => {


        burgersCollection.insertOne(req.body)
            .then((result) => {
                res.send(result.insertedId);
            })

    });

    //get burgers collection
    app.get('/burgers', async (req, res) => {
        const burger = await burgersCollection.find({}).toArray();
        res.send(burger);
    })
    //get single burger 


    app.get('/burgers/:id', async (req, res) => {
        const id = req.params.id;

        const query = { _id: ObjectId(id) };
        const burger = await burgersCollection.findOne(query);
        res.json(burger);
    })


    //add address 
    app.post('/address', (req, res) => {

        console.log("hit the post api");
        address.insertOne(req.body)
            .then((result) => {
                res.send(result.insertedId);
            })

    });

    //get address
    app.get('/address', async (req, res) => {
        const add = await address.find({}).toArray();
        res.send(add);
    })

    app.get('/service/:serviceId', async (req, res) => {
        const id = req.params.serviceId;
        console.log('load user id:', id);
        res.send('geeting soon');



        // const query = { _id: ObjectId(id) };
        // const serv = await serviceCollection.findOne(query);
        // res.json(serv);
    });

    app.get('/services/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await serviceCollection.findOne(query);
        res.send(result);
        // ai part er pore data ta /5000/users/id te pabo
    })




    //delete one item from

    app.delete('/services/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await serviceCollection.deleteOne(query);
        console.log('deleted id', result);
        res.json(result);
    })

    app.post('/placeorder', async (req, res) => {
        const order = req.body;
        const result = await placeorderCollection.insertOne(order);
        console.log('post succ', result)
        res.json(result);
    })

    app.get('/placeorder', async (req, res) => {
        const cursor = placeorderCollection.find({});
        const users = await cursor.toArray();
        res.send(users);
    })







});

app.get('/', (req, res) => {
    res.send('running hello world');
})
app.listen(port, () => {
    console.log('server listening on port', port);
});