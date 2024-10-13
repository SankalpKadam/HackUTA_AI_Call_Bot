// References - https://platform.openai.com/docs/guides/realtime/concepts


const WebSocket = require('ws');
const dotenv = require('dotenv')
const Fastify = require('fastify');
const fastifyFormBody = require('@fastify/formbody');
const fastifyWs = require('@fastify/websocket'); 
const fs= require('fs')
// Load environment variables from .env file
dotenv.config();

// Retrieve the OpenAI API key from environment variables. You must have OpenAI Realtime API access.
const { OPENAI_API_KEY } = process.env;

if (!OPENAI_API_KEY) {
    console.error('Missing OpenAI API key. Please set it in the .env file.');
    process.exit(1);
}

// Initialize Fastify
const fastify = Fastify();
fastify.register(fastifyFormBody);
fastify.register(fastifyWs);

// Constants
const SYSTEM_MESSAGE = `act like a restaurant receptionist. these are the details of my restaurant - Business Category: Restaurant Services: Delivery, Dine-in, Catering Name: Big Dan’s Menu: Appetizers • Garlic Bread - $3.99 • Mozzarella Sticks - $4.99 • Caesar Salad - $5.99 Main Course • Margherita Pizza - $9.99 • Spaghetti Bolognese - $10.99 • Grilled Chicken Sandwich - $8.99 • Butter Paneer with Rice - $11.99 Sides • French Fries - $2.99 • Side Salad - $3.49 • Mashed Potatoes - $3.99 Desserts • Chocolate Brownie - $4.49 • Ice Cream Sundae - $4.99 Beverages • Soda - $1.99 • Iced Tea - $1.99 • Coffee - $2.49 Delivery: • Service Hours: 10:00 AM – 10:00 PM • Delivery Radius: Up to 10 miles from the restaurant location • Delivery Fee: $3.00 flat rate, free for orders over $30 • Estimated Delivery Time: 30–45 minutes • Ordering: Available through our website, mobile app, or by calling directly • Minimum Order: $15.00 • Delivery Areas: All neighboring communities within the delivery radius. Dine-in: • Service Hours: 11:00 AM – 11:00 PM • Seating Capacity: 50 guests (outdoor seating available for 15) • Reservations: Recommended for parties of 6 or more. Walk-ins are welcome. • Ambiance: Cozy, family-friendly atmosphere with music and ambient lighting. • Special Features: o Free Wi-Fi available o Kids’ menu and highchairs o Private dining area available for small events • Dining Options: Full-service dining with a dedicated waitstaff and a wide selection of appetizers, main courses, and desserts. Catering: • Service Hours: 9:00 AM – 8:00 PM (available 7 days a week) • Menu Options: Customizable packages for breakfast, lunch, and dinner. o Popular Packages: ▪ Corporate Lunch (includes salads, sandwiches, and desserts) ▪ Party Platter (includes appetizers, mains, and sides) o Per Person Pricing: Starts at $12 per person • Minimum Order: 15 people • Delivery Fee: Free within 15 miles for catering orders over $150 • Booking: At least 48 hours' notice is required. Call to discuss menu and details. • Additional Services: o Full-service setup and cleanup available upon request. o Waitstaff can be provided for an extra fee. o Rentals for tableware and serving utensils are available. `;

const VOICE = 'alloy';
const PORT = 5050; // Allow dynamic port assignment

// List of Event Types to log to the console. See OpenAI Realtime API Documentation. (session.updated is handled separately.)
// const LOG_EVENT_TYPES = [
//     'response.content.done',
//     'rate_limits.updated',
//     'response.done',
//     'input_audio_buffer.committed',
//     'input_audio_buffer.speech_stopped',
//     'input_audio_buffer.speech_started',
//     'session.created'
// ];

// Root Route
fastify.post('/', async (request, reply) => {
    // reply.send({ message: 'Twilio Media Stream Server is running!' });
    const twimlResponse = `
                          <Response>
                              <Say>Please wait while we connect your call to the A. I. voice assistant, powered by Twilio and the Open-A.I. Realtime API</Say>
                              <Pause length="1"/>
                              <Say>O.K. you can start talking!</Say>
                              <Connect>
                                  <Stream url="wss://${request.headers.host}/media-stream" />
                              </Connect>
                          </Response>`;

    reply.type('text/xml').send(twimlResponse);
});

// Route for Twilio to handle incoming and outgoing calls
// <Say> punctuation to improve text-to-speech translation
fastify.all('/incoming-call', async (request, reply) => {
    const twimlResponse = `
                          <Response>
                              <Say>Please wait while we connect your call to the A. I. voice assistant, powered by Twilio and the Open-A.I. Realtime API</Say>
                              <Pause length="1"/>
                              <Say>O.K. you can start talking!</Say>
                              <Connect>
                                  <Stream url="wss://${request.headers.host}/media-stream" />
                              </Connect>
                          </Response>`;

    reply.type('text/xml').send(twimlResponse);
});

// WebSocket route for media-stream
fastify.register(async (fastify) => {
    fastify.get('/media-stream', { websocket: true }, (connection, req) => {
        console.log('Client connected');


        const openAiWs = new WebSocket('wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01', {
            headers: {
                Authorization: `Bearer ${OPENAI_API_KEY}`,
                "OpenAI-Beta": "realtime=v1"
            }
        });

        let streamSid = null;

        const sendSessionUpdate = () => {
            const sessionUpdate = {
                type: 'session.update',
                session: {
                    turn_detection: { type: 'server_vad' },
                    input_audio_format: 'g711_ulaw',
                    output_audio_format: 'g711_ulaw',
                    voice: VOICE,
                    instructions: SYSTEM_MESSAGE,
                    modalities: ["text", "audio"],
                    temperature: 0.8,
                }
            };

            console.log('Sending session update:', JSON.stringify(sessionUpdate));
            openAiWs.send(JSON.stringify(sessionUpdate));
        };

        // Open event for OpenAI WebSocket
        openAiWs.on('open', () => {
            console.log('Connected to the OpenAI Realtime API');
            setTimeout(sendSessionUpdate, 250); // Ensure connection stability, send after .25 seconds
        });

        // Listen for messages from the OpenAI WebSocket (and send to Twilio if necessary)
        openAiWs.on('message', (data) => {
            try {
                const response = JSON.parse(data);

                // if (LOG_EVENT_TYPES.includes(response.type)) {
                //     console.log(`Received event: ${response.type}`, response);
                // }

                if (response.type === 'session.updated') {
                    console.log('Session updated successfully:', response);
                }

                if (response.type === 'response.audio.delta' && response.delta) {
                    const audioDelta = {
                        event: 'media',
                        streamSid: streamSid,
                        media: { payload: Buffer.from(response.delta, 'base64').toString('base64') }
                    };
                    connection.send(JSON.stringify(audioDelta));
                }
            } catch (error) {
                console.error('Error processing OpenAI message:', error, 'Raw message:', data);
            }
        });

        // Handle incoming messages from Twilio
        connection.on('message', (message) => {
            try {
                const data = JSON.parse(message);

                switch (data.event) {
                    case 'media':
                        if (openAiWs.readyState === WebSocket.OPEN) {
                            const audioAppend = {
                                type: 'input_audio_buffer.append',
                                audio: data.media.payload
                            };

                            openAiWs.send(JSON.stringify(audioAppend));
                        }
                        break;
                    case 'start':
                        streamSid = data.start.streamSid;
                        console.log('Incoming stream has started', streamSid);
                        break;
                    default:
                        console.log('Received non-media event:', data.event);
                        break;
                }
            } catch (error) {
                console.error('Error parsing message:', error, 'Message:', message);
            }
        });

        // Handle connection close
        connection.on('close', () => {
            if (openAiWs.readyState === WebSocket.OPEN) openAiWs.close();
            console.log('Client disconnected.');
        });

        // Handle WebSocket close and errors
        openAiWs.on('close', () => {
            console.log('Disconnected from the OpenAI Realtime API');
        });

        openAiWs.on('error', (error) => {
            console.error('Error in the OpenAI WebSocket:', error);
        });
    });
});

fastify.listen({ port: PORT }, (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server is listening on port ${PORT}`);
});