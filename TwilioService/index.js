const { spawnSync } = require('child_process')
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://sst0557mavs:Hack_UTA_2024@hackuta.q1y43.mongodb.net/?retryWrites=true&w=majority&appName=HackUTA";
const mongoose = require("mongoose");
const cors = require('cors')
const url = require('url')

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
    call_duration: Number, // in minutes
}, { collection: 'call' });

const Call = mongoose.model("call", callSchema);

const gptReq = require('./gpt-request').chatReq
const express = require('express');
const urlencoded = require('body-parser').urlencoded;
const app = express()
app.use(urlencoded({ extended: false }))
app.use(cors())
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
    // const userData = req.body.SpeechResult.toLowerCase();
    // console.log(userData);
    const twiml = new VoiceResponse();
    words = ['order', 'place']
    if (words.every(word => "I want to place an order".includes(word))) {
        // twiml.say('Yes, what would you like?')
        // res.redirect(url.format({
        //     pathname:'/gpt',
        //     query:{
        //         'prompt': 'I want to place an order'
        //     }
        // }));
        new Promise((resolve, reject) => {
            twiml.say('Yes, what would you like')
            console.log('said');
            resolve('I want to place an order')

        }).then((result) => {
            res.redirect(url.format({
                pathname: '/gpt',
                query: {
                    'prompt': result
                }
            }));
        })
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


app.all('/gpt', async (req, res) => {
    // 1] cache = set gpt to initial restaurant receptionist = 'act like a restaurant receptionist. make up the name and menu. I just called you'.
    // 2] cache += result 
    // 3] send cache and user input to python as args
    // 4] end when we get bye
    console.log('gpt');

    let cache = 'act like a restaurant receptionist. The menu has only items a cheese pizza and butter paneer. I just called you';
    // let result = null;

    let prompts = ['What do you have on menu?', 'I want to order a cheese pizza', 'Can I have some paneer on it?']
    let final = ''
    const python = await spawnSync('python', ['./python_scripts/gptScript.py', cache, req.query.prompt])
    let result = python.stdout?.toString()?.trim()
    cache += result

    // prompts.forEach(async (prompt)=>{
    //     const python = await spawnSync('python',['./python_scripts/gptScript.py',cache,prompt])
    //     let result = python.stdout?.toString()?.trim()
    //     final += result
    //     if(result){
    //         cache += prompt
    //         cache += result
    //     }
    //     let error = python.stderr?.toString()?.trim()

    // })
    // res.send(JSON.stringify({
    //     message: cache
    // }))
    const twiml = new VoiceResponse();
    twiml.say(`This is ${result}`)
    console.log();
    
    // res.send(twiml.toString())
    res.redirect('/')

})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})