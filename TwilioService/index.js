// import express from 'express'
// import { twiml } from 'twilio'
// import TwiML from 'twilio/lib/twiml/TwiML'
const express = require('express');
const urlencoded = require('body-parser').urlencoded;
const app = express()
app.use(urlencoded({extended: false}))
const port = 3000
const VoiceResponse = require('twilio').twiml.VoiceResponse
app.all('/', (req, res)=>{
    res.type('xml')
    const response = new VoiceResponse();
    // console.log(response);
    const gather = response.gather({
        input:'speech',
        action:'/results',
        language:'en-US',
        hints:'order',
        speechModel:'phone_call',
        speechTimeout:'auto'
    })
    // response.say('This is from Node js');
    gather.say('Tell me a new order');
    res.send(response.toString());
})
// app.post()
app.all('/results',(req, res)=>{
    const userData = req.body.SpeechResult.toLowerCase();
    console.log(userData);
    const twiml = new VoiceResponse();
    words = ['order','place']
    if(words.every(word=>userData.includes(word))){
        twiml.say('Yes, what would you like?')
    }twiml.say('Could you please repeat, I could not understand?')
    res.send(twiml.toString());
})
app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
})