const express = require('express');
const { GPT4All } = require('gpt4all'); // Import GPT4All library
const { VoiceResponse } = require('twilio').twiml;
require('dotenv').config();

const app = express();
app.use(express.urlencoded({ extended: false }));

const sessions = {}; // Session management

// Initialize GPT4All instance
const gpt4all = new GPT4All('gpt4all-lora-unfiltered'); // You can replace with another model if necessary

// Open GPT4All model
gpt4all.open().then(() => {
    console.log("GPT4All model is open and ready for use.");
}).catch(err => {
    console.error("Error opening GPT4All model:", err);
});

app.all('/', (req, res) => {
    const from = req.body.From;

    if (!sessions[from]) {
        sessions[from] = { step: 'ask-order' };
    }

    const response = new VoiceResponse();
    const sessionStep = sessions[from].step;

    switch (sessionStep) {
        case 'ask-order':
            const gather = response.gather({
                input: 'speech',
                action: '/results',
                language: 'en-US',
                speechTimeout: 'auto',
            });
            gather.say('Hi, welcome to the restaurant. What would you like to order?');
            break;

        default:
            response.say('Sorry, I didn’t understand. Please start again.');
            response.hangup();
            break;
    }

    res.type('text/xml');
    res.send(response.toString());
});

app.all('/results', async (req, res) => {
    const userData = req.body.SpeechResult.toLowerCase();
    const twiml = new VoiceResponse();

    if (userData.includes('burger')) {
        sessions[req.body.From].step = 'ask-anything-else';

        // Use GPT4All for response
        const gptResponse = await gpt4all.prompt(userData);
        sessions[req.body.From].response = gptResponse;

        res.redirect('/continue');
    } else {
        twiml.say('We only serve burgers right now. Sorry please call again later.');
        twiml.hangup();
        delete sessions[req.body.From];
        res.send(twiml.toString());
    }
});

app.all('/continue', (req, res) => {
    const from = req.body.From;
    const gptResponse = sessions[from].response;

    const response = new VoiceResponse();
    response.say(gptResponse);

    const gather = response.gather({
        input: 'speech',
        action: '/finalize-order',
        language: 'en-US',
        speechTimeout: 'auto',
    });
    gather.say('Do you want anything else?');

    res.type('text/xml');
    res.send(response.toString());
});

// Finalize order and close GPT4All when done
app.all('/finalize-order', (req, res) => {
    const userData = req.body.SpeechResult.toLowerCase();
    const from = req.body.From;
    const twiml = new VoiceResponse();

    if (userData.includes('no')) {
        const orderItems = sessions[from].order.join(', ');
        twiml.say(`Thank you for your order! You've ordered: ${orderItems}. Your order is being processed.`);
        twiml.hangup();
        delete sessions[from];

        // Close GPT4All when done (optional)
        gpt4all.close().then(() => {
            console.log('GPT4All model closed.');
        }).catch(err => {
            console.error('Error closing GPT4All model:', err);
        });
    } else {
        sessions[from].order.push(userData);
        res.redirect('/continue');
    }

    res.type('text/xml');
    res.send(twiml.toString());
});

// Start server
const port = 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
