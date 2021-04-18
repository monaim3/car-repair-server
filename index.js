const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors= require('cors')
require('dotenv').config()

const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('mongodb')
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.undrt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
  const servicecollection = client.db("car-repair").collection("addAppointment");
  const reviewCollection = client.db("car-repair").collection("Review");
  const adminsCollection = client.db("car-repair").collection("admins");
  const bookingsCollection = client.db("car-repair").collection("bookings")
  console.log("database connect")
 
  app.post("/addReviews", (req, res) => {
    const review = req.body;
    console.log(review);
    reviewCollection.insertOne(review)
        .then(result => {
            console.log(result.insertedCount)
            res.send(result.insertedCount > 0)
        })
})

app.get('/Review', (req, res)=>{
    reviewCollection.find({})
       .toArray((err, documents)=>{
           res.send(documents);
           console.log(documents)
       })
   })

   app.post('/addServices', (req, res) => {
    const service = req.body;
    console.log(service);
    servicecollection.insertOne(service)
        .then(result => {
            console.log(result.insertedCount)
            res.send(result.insertedCount > 0)
        })
})


   app.get('/services', (req, res)=>{
    servicecollection.find({})
       .toArray((err, documents)=>{
           res.send(documents);
           console.log()
       })
   })

   app.post('/makeAdmins', (req, res) => {
    const admin = req.body;
    console.log(admin);
    adminsCollection.insertOne(admin)
        .then(result => {
            console.log(result.insertedCount)
        })

})

app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminsCollection.find({ email: email })
        .toArray((err, admins) => {
            res.send(admins.length > 0);
        })
})

app.post ('/addBookings',(req, res)=>{
    const booking = req.body;
    console.log(booking);
    bookingsCollection.insertOne(booking)
    .then(result=>{
        console.log(result.insertedCount)
        res.send(result.insertedCount > 0)
    })
})


app.get('/order',(req, res)=>{
    bookingsCollection.find({})
        .toArray((err, documents) => {
            res.send(documents)
        })
})
  
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)