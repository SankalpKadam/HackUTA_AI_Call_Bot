const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { VoiceResponse } = require('twilio').twiml;
// const OpenAI = require('openai');
require('dotenv').config();

// GPT Code Starts
const axios = require('axios');
// GPT Code Ends

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// GPT Start
// Hugging Face API URL and token (set this in your .env file)
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill';
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY; // Store this in .env file

// GPT End 

const sessions = {}; // Session management


// GPT Starts

async function getLLMResponse(userInput) {
    try {
        const response = await axios.post(
            HUGGINGFACE_API_URL,
            { inputs: userInput },
            {
                headers: { Authorization: `Bearer ${HUGGINGFACE_API_KEY}` }
            }
        );
        return response.data.generated_text; // The response text from Hugging Face
    } catch (error) {
        console.error('Error in Hugging Face API call:', error);
        return 'Sorry, I could not process your request at the moment.';
    }
}

app.all('/', (req, res) => {
    const from = req.body.From;

    // Initialize session if not already created
    if (!sessions[from]) {
        sessions[from] = { step: 'ask-order', order: [] };
    }

    const response = new VoiceResponse();
    const sessionStep = sessions[from].step;

    // Start by asking what they want to order
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
    const from = req.body.From;
    const twiml = new VoiceResponse();

    if (userData.includes('burger') || userData.includes('fries') || userData.includes('drink')) {
        // Add item to session order
        sessions[from].order.push(userData);

        // Call Hugging Face API for a response
        const gptResponse = await getLLMResponse(userData);

        // Update session step to continue asking for more items
        sessions[from].step = 'ask-anything-else';
        sessions[from].response = gptResponse;
        res.redirect('/continue');
    } else {
        twiml.say('We only serve burgers, fries, and drinks right now. Sorry, please try again.');
        twiml.hangup();
        delete sessions[from];
        res.send(twiml.toString());
    }
});

app.all('/continue', (req, res) => {
    const from = req.body.From;
    const gptResponse = sessions[from].response;

    const response = new VoiceResponse();
    response.say(gptResponse);

    // Ask if the user wants anything else
    const gather = response.gather({
        input: 'speech',
        action: '/finalize-order',
        language: 'en-US',
        speechTimeout: 'auto',
    });
    gather.say('Do you want anything else? Say "no" to finalize your order.');

    res.type('text/xml');
    res.send(response.toString());
});

app.all('/finalize-order', async (req, res) => {
    const userData = req.body.SpeechResult.toLowerCase();
    const from = req.body.From;
    const twiml = new VoiceResponse();

    // Check if user is done with the order
    if (userData.includes('no')) {
        const orderItems = sessions[from].order.join(', ');
        twiml.say(`Thank you for your order! You've ordered: ${orderItems}. Your order is being processed.`);
        twiml.hangup();

        // Clear the session after order is confirmed
        delete sessions[from];
    } else {
        // Call Hugging Face API for a response to any new items
        const gptResponse = await getLLMResponse(userData);
        
        // Add item to the session order
        sessions[from].order.push(userData);
        sessions[from].response = gptResponse;

        // Redirect to continue asking if user wants anything else
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

// GPT Ends

// app.all('/', (req, res) => {
//     const from = req.body.From;

//     if (!sessions[from]) {
//         sessions[from] = { step: 'ask-order' };
//     }

//     const response = new VoiceResponse();
//     const sessionStep = sessions[from].step;

//     switch (sessionStep) {
//         case 'ask-order':
//             const gather = response.gather({
//                 input: 'speech',
//                 action: '/results',
//                 language: 'en-US',
//                 speechTimeout: 'auto',
//             });
//             gather.say('Hi, welcome to the restaurant. What would you like to order?');
//             break;

//         default:
//             response.say('Sorry, I didn’t understand. Please start again.');
//             response.hangup();
//             break;
//     }

//     res.type('text/xml');
//     res.send(response.toString());
// });

// app.all('/results', async (req, res) => {
//     const userData = req.body.SpeechResult.toLowerCase();
//     const twiml = new VoiceResponse();

//     if (userData.includes('burger')) {
//         sessions[req.body.From].step = 'ask-anything-else';
        
//         // Call OpenAI and wait for response
//         // const gptResponse = await getOpenAIResponse(userData);
//         const gptResponse = 'Thank you for your response!';


//         // Redirect to another endpoint to continue the conversation
//         sessions[req.body.From].response = gptResponse; // Save the response in session
//         res.redirect('/continue');
//     } else {
//         twiml.say('We only serve burgers right now. Sorry please call again later.');
//         twiml.hangup();
//         delete sessions[req.body.From];
//         res.send(twiml.toString());
//     }
// });

// // New endpoint to continue conversation
// app.all('/continue', (req, res) => {
//     const from = req.body.From;
//     const gptResponse = sessions[from].response;

//     const response = new VoiceResponse();
//     response.say(gptResponse); // Say the response from OpenAI

//     // Optionally gather more input
//     const gather = response.gather({
//         input: 'speech',
//         action: '/finalize-order',
//         language: 'en-US',
//         speechTimeout: 'auto',
//     });
//     gather.say('Do you want anything else?');

//     res.type('text/xml');
//     res.send(response.toString());
// });

// // Function to get response from OpenAI
// // const getOpenAIResponse = async (userInput) => {
// //     try {
// //         const completion = await openai.chat.completions.create({
// //             model: 'gpt-3.5-turbo',
// //             messages: [{ role: 'user', content: userInput }],
// //         });
// //         return completion.choices[0].message.content; // Return the OpenAI response
// //     } catch (error) {
// //         console.error('OpenAI request error:', error);
// //         return 'I am sorry, but I could not process your request at this moment.';
// //     }
// // };

// // Start server
// const port = 8080;
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });
