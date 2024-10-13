const { spawnSync } = require('child_process')
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://sst0557mavs:Hack_UTA_2024@hackuta.q1y43.mongodb.net/?retryWrites=true&w=majority&appName=HackUTA";
const mongoose = require("mongoose");
const cors = require('cors')
const url = require('url')
const axios = require('axios');
let sessions = {}
mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.log("Error connecting to MongoDB: ", err));

let cache = 'act like a restaurant receptionist. The menu has only items a cheese pizza and butter paneer. I just called you';
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
}, { collection: 'restaurants' });

const Order = mongoose.model("restaurant", orderSchema);

// Schema and Model for Calls
const callSchema = new mongoose.Schema({
    order_id: { type: String, required: true },
    name: String,
    phone_number: String,
    call_start_time: { type: Date, required: true },
    call_end_time: { type: Date, required: true },
    call_duration: String, // in minutes
}, { collection: 'call' });

const Call = mongoose.model("call", callSchema);

const gptReq = require('./gpt-request').chatReq
const express = require('express');
const urlencoded = require('body-parser').urlencoded;
const app = express()
app.use(urlencoded({ extended: false }))
app.use(cors())
const OpenAI = require("openai");
const { twiml } = require('twilio');
require("dotenv").config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const port = 3000
const VoiceResponse = require('twilio').twiml.VoiceResponse
app.all('/', (req, res) => {

    if (!sessions[req.body.From]) {
        sessions[req.body.From] = { step: 'ask-order' }
    }
    // res.type('xml')
    const response = new VoiceResponse();
    const session = sessions[req.body.From].step
    switch (session) {
        case 'ask-order':
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
            gather.say('Hi, welcome to the restaurant. What would you like to order?');
            res.type('xml');
            res.send(response.toString())
            break;
        case 'ask-item':
            const gatherItem = response.gather({
                input: 'speech',
                action: '/item',
                language: 'en-US',
                hints: 'order',
                speechModel: 'phone_call',
                speechTimeout: 'auto'
            })
        case 'ask-anything-else':
            console.log('anything');
            
            response.say('Added to the order. Do you want anything else?')
            const anything = response.gather({
                input: 'speech',
                action: '/anything',
                language: 'en-US',
                hints: 'order',
                speechModel: 'phone_call',
                speechTimeout: 'auto'
            })
        case 'confirm-order':
            response.say('This is your order')

            const confirm = response.gather({
                input: 'speech',
                action: '/confirm',
                language: 'en-US',
                hints: 'order',
                speechModel: 'phone_call',
                speechTimeout: 'auto'
            })
        default:
            response.say('Sorry, I didn’t understand. Please start again.');
            response.hangup();
            res.type('text/xml');
            res.send(response.toString());
            break;
    }
    // console.log(response);
    // const gather = response.gather({
    //     input: 'speech',
    //     action: '/results',
    //     language: 'en-US',
    //     hints: 'order',
    //     speechModel: 'phone_call',
    //     speechTimeout: 'auto'
    // })
    // response.say('This is from Node js');
    // gather.say('Tell me a new order');
    // res.send(response.toString());
    // const result = gptReq("What is the capital of India?", openai) 
    // res.send(response.toString())
})
// app.post()
app.all('/results', (req, res) => {
    const userData = req.body.SpeechResult.toLowerCase();
    console.log(userData);
    const twiml = new VoiceResponse();
    words = ['burger']
    if (words.every(word => userData.includes(word))) {
        // twiml.say('Yes, what would you like?')
        // twiml.gather
        // res.redirect(url.format({
        //     pathname:'/gpt',
        //     query:{
        //         'prompt': 'I want to place an order'
        //     }
        // }));


        // new Promise((resolve, reject) => {
        //     twiml.say('Yes, what would you like')
        //     console.log('said');
        //     resolve('I want to place an order')

        // }).then((result) => {
        //     res.redirect(url.format({
        //         pathname: '/gpt',
        //         query: {
        //             'prompt': result
        //         }
        //     }));
        // })
        sessions[req.body.From].step = 'ask-anything-else'
        res.redirect('/')

    } else {

        twiml.say('We only serve burgers right now. Sorry please call again later.')
        twiml.hangup()
        delete sessions[req.body.From]
        res.send(twiml.toString())
    }
})

app.all('/anything', (req, res) => {
    const userData = req.body.SpeechResult.toLowerCase();

    const twiml = new VoiceResponse();
    words = ['yes']
    if (words.every(word => userData.includes(word))) {
        // twiml.say('Added to the order')
        res.redirect('/')
    } else {
        sessions[req.body.From].step = 'confirm-order'
        res.redirect('/')
    }
})

app.all('/confirm', (req, res) => {
    const twiml = new VoiceResponse();
    twiml.say('Here is your order. Thank you for your order')
    twiml.hangup()
    delete sessions[req.body.From]
    res.type('xml')
    res.send(twiml.toString())
})

async function connectToDatabase() {
    await client.connect();
    const db = client.db('test');
    return db.collection('restaurant');
}

// fetch data from mongodb
app.get('/getData', async (req, res) => {
    try {
        const orders = await Order.find({});
        res.json(orders);
    } catch (err) {
        res.status(500).send("Error fetching orders: " + err);
    }
})

app.get('/callData', async (req, res) => {
    try {
        const orders = await Call.find({});
        res.json(orders);
    } catch (err) {
        res.status(500).send("Error fetching orders: " + err);
    }
})


app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})
