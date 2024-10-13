const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const app = express();
const port = 5050;

app.use(bodyParser.urlencoded({ extended: false }));

// Simple in-memory session to track conversation state
let sessions = {};

// Twilio VoiceResponse helper
const VoiceResponse = twilio.twiml.VoiceResponse;

// Endpoint to handle incoming calls
app.post('/voice', (req, res) => {
    const userPhone = req.body.From;  // Unique identifier for user
    const twiml = new VoiceResponse();

    // Initialize session if user is new
    if (!sessions[userPhone]) {
        sessions[userPhone] = { step: 'ask-order' };
    }

    const session = sessions[userPhone];

    // Handle different conversation steps
    switch (session.step) {
        case 'ask-order':
            // Ask what the user wants to order
            twiml.say('What would you like to order?');
            const gatherOrder = twiml.gather({
                input: 'speech',
                action: '/order',  // Endpoint to handle order input
                timeout: 5
            });
            res.type('text/xml');
            res.send(twiml.toString());
            break;

        case 'ask-burger-type':
            // Ask for burger type after receiving "I want a burger"
            twiml.say('Do you want a chicken burger or a beef burger?');
            const gatherBurgerType = twiml.gather({
                input: 'speech',
                action: '/burger-type',  // Endpoint to handle burger type
                timeout: 5
            });
            res.type('text/xml');
            res.send(twiml.toString());
            break;

        case 'confirm-order':
            // Confirm the order
            twiml.say('Great! Your order has been placed. Goodbye.');
            twiml.hangup();  // End the call
            delete sessions[userPhone];  // Clear session
            res.type('text/xml');
            res.send(twiml.toString());
            break;

        default:
            twiml.say('Sorry, I didn’t understand. Please start again.');
            twiml.hangup();
            res.type('text/xml');
            res.send(twiml.toString());
            break;
    }
});

// Endpoint to handle order input
app.post('/order', (req, res) => {
    const userPhone = req.body.From;
    const speechResult = req.body.SpeechResult.toLowerCase();  // Process speech input

    const twiml = new VoiceResponse();

    if (speechResult.includes('burger')) {
        // Update session state to ask for burger type
        sessions[userPhone].step = 'ask-burger-type';
        res.redirect('/voice');  // Go back to conversation flow
    } else {
        twiml.say('Sorry, I can only take burger orders right now.');
        twiml.hangup();
        delete sessions[userPhone];
        res.type('text/xml');
        res.send(twiml.toString());
    }
});

// Endpoint to handle burger type input
app.post('/burger-type', (req, res) => {
    const userPhone = req.body.From;
    const speechResult = req.body.SpeechResult.toLowerCase();

    const twiml = new VoiceResponse();

    if (speechResult.includes('chicken') || speechResult.includes('beef')) {
        // Update session state to confirm order
        sessions[userPhone].step = 'confirm-order';
        twiml.say(`You have selected a ${speechResult} burger.`);
        res.redirect('/voice');  // Continue conversation flow
    } else {
        twiml.say('Sorry, we only offer chicken or beef burgers.');
        twiml.hangup();
        delete sessions[userPhone];
        res.type('text/xml');
        res.send(twiml.toString());
    }
});

app.listen(port, () => {
    console.log(`Twilio server listening at http://localhost:${port}`);
});
