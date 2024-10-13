
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://sst0557mavs:Hack_UTA_2024@hackuta.q1y43.mongodb.net/?retryWrites=true&w=majority&appName=HackUTA";
const mongoose = require("mongoose");


mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.log("Error connecting to MongoDB: ", err));


const orderSchema = new mongoose.Schema({
    name: String,
    address: String,
    items: [
        {
            item_name: String,
            quantity: Number,
            price: Number,
        },
    ],
    order_total: Number,
    order_date: { type: Date, default: Date.now },
},{collection:'restaurants'});

const Order = mongoose.model("restaurant", orderSchema);


const gptReq = require('./gpt-request').chatReq
const express = require('express');
const urlencoded = require('body-parser').urlencoded;
const app = express()
app.use(urlencoded({ extended: false }))
const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const port = 3000
const VoiceResponse = require('twilio').twiml.VoiceResponse
app.all('/', (req, res) => {
    console.log(process.env.OPENAI_API_KEY);

    res.type('xml')
    const response = new VoiceResponse();
    // console.log(response);
    const gather = response.gather({
        input: 'speech',
        action: '/results',
        language: 'en-US',
        hints: 'order',
        speechModel: 'phone_call',
        speechTimeout: 'auto'
    })
    // response.say('This is from Node js');
    gather.say('Tell me a new order');
    // res.send(response.toString());
    // const result = gptReq("What is the capital of India?", openai) 
    res.send(response.toString())
})
// app.post()
app.all('/results', (req, res) => {
    const userData = req.body.SpeechResult.toLowerCase();
    console.log(userData);
    const twiml = new VoiceResponse();
    words = ['order', 'place']
    if (words.every(word => userData.includes(word))) {
        twiml.say('Yes, what would you like?')
        res.redirect('/');
    } else {

        twiml.say('Could you please repeat, I could not understand?')
        res.send(twiml.toString())
    }
})

async function connectToDatabase() {
    await client.connect();
    const db = client.db('test');
    return db.collection('restaurant');
}

// fetch data from mongodb
app.get('/getData', async (req, res) => {
    // try {
    //     const ordersCollection = await connectToDatabase();
    //     const orders = await ordersCollection.find().toArray();
    //     res.status(200).json(orders);
    // } catch (error) {
    //     res.status(500).json({ error: 'Failed to fetch orders' });
    // }
    try {
        const orders = await Order.find({});
        res.json(orders);
    } catch (err) {
        res.status(500).send("Error fetching orders: " + err);
    }
})



app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})