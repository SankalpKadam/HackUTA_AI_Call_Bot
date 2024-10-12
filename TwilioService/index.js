// import express from 'express'
// import { twiml } from 'twilio'
// import TwiML from 'twilio/lib/twiml/TwiML'
const express = require('express');
const app = express()
const port = 3000
const VoiceResponse = require('twilio').twiml.VoiceResponse
app.all('/', (req, res)=>{
    res.type('xml')
    const response = new VoiceResponse();
    // console.log(response);
    response.say('This is from Node js');
    res.send(response.toString());
})
// app.post()

app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
})