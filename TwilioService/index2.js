// const WebSocket = require('ws');
// const express = require('express');
// const app = express()
// const server = require('http').createServer(app);
// const wss = new WebSocket.Server({server})
// const VoiceResponse = require('twilio').twiml.
// wss.on('connection', function connection(ws) {
//     console.log('New Connection Initiated');
//     ws.on('message', function incoming(message) {
//         const {event} = JSON.parse(message)
//         switch (event) {
//             case 'connected':
//                 console.log();

//                 break;
//             case 'start':
//                 break;
//             case 'media':
//                 break;
//             case 'stop':
//                 break;
//             default:
//                 break;
//         }

//     })
// })

// app.get('/',(req, res)=>{
//     res.send('Hello World')
// })

// app.post('/', async(req, res)=>{
//     res.set('Content-Type','text/xml')
//     res.send()
// })


// console.log('Listening at port 8080');
// server.listen(8080)

const WebSocket = require('ws');
const dotenv = require('dotenv')
const Fastify = require('fastify');
const fastifyFormBody = require('@fastify/formbody');
const fastifyWs = require('@fastify/websocket');
// const { response } = require('express');
// const { connection } = require('mongoose');

dotenv.config()
const { OPENAI_API_KEY } = process.env

if (!OPENAI_API_KEY) {
    process.exit(1)
}
const SYSTEM_MESSAGE = 'You are a helpful and bubbly AI assistant who loves to chat about anything the user is interested about and is prepared to offer them facts. You have a penchant for dad jokes, owl jokes, and rickrolling – subtly. Always stay positive, but work in a joke when appropriate.';
const VOICE = 'alloy';
const fastify = Fastify();
fastify.register(fastifyFormBody);
fastify.register(fastifyWs);

const PORT = process.env.PORT || 5050;

fastify.get('/', async (request, response) => {
    response.send({
        message: 'Twilio Media Stream Server is running!'
    })
})

fastify.all('/incoming-call', async (request, response) => {
    const twimlResponse = `<?xml version="1.0" encoding="UTF-8" ?>
    <Response>
    <Say>
    Please wait while we connect your call to the restaurant.
    </Say>
    <Pause length="1"/>
    <Say>O. K. please tell me your order!</Say>
    <Connect>
    <Stream url="wss://${request.headers.host}/media-stream"/>
    </Connect>
    </Response>
    `
    response.type('text/xml').send(twimlResponse)
})

fastify.register(async (fastify) =>{
    fastify.get('/media-stream', {websocket:true},(connection, req)=>{
        console.log('Client connected');
        
        // const openaiWs = new WebSocket('wss://api.openai.com/v1/realtime?model=gpt-3.5-preview-2023-07-01-preview',{
        //     headers:`Bearer ${OPENAI_API_KEY}`
        // });

        const openaiWs = new WebSocket('wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01',{
            headers:`Bearer ${OPENAI_API_KEY}`
        });

        let streamSid = null;

        const sendSessionUpdate = () =>{
            const sessionUpdate = {

                type:'session.update',
                session:{
                    turn_detection:{
                        type: 'server_vad'
                    },
                    input_audio_format:'g711_ulaw',
                    output_audio_format:'g711_ulaw',
                    voice: VOICE,
                    instructions: SYSTEM_MESSAGE,
                    modalities:['text','audio'],
                    temperature:0.5
                }
            };

            console.log("Sending session update:", JSON.stringify(sessionUpdate));
            openaiWs.send(JSON.stringify(sessionUpdate));
            
        };

        // Open event for OpenAI WebSocket
        openaiWs.on('open', () => {
            console.log('Connected to the OpenAI Realtime API');
            setTimeout(sendSessionUpdate, 250); // Ensure connection stability, send after .25 seconds
        });

        openaiWs.on('message', (data) => {
            try {
                const response = JSON.parse(data);

                if (LOG_EVENT_TYPES.includes(response.type)) {
                    console.log(`Received event: ${response.type}`, response);
                }

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

        connection.on('message', (message) => {
            try {
                const data = JSON.parse(message);

                switch (data.event) {
                    case 'media':
                        if (openaiWs.readyState === WebSocket.OPEN) {
                            const audioAppend = {
                                type: 'input_audio_buffer.append',
                                audio: data.media.payload
                            };

                            openaiWs.send(JSON.stringify(audioAppend));
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
            if (openaiWs.readyState === WebSocket.OPEN) openaiWs.close();
            console.log('Client disconnected.');
        });

        // Handle WebSocket close and errors
        openaiWs.on('close', () => {
            console.log('Disconnected from the OpenAI Realtime API');
        });

        openaiWs.on('error', (error) => {
            console.error('Error in the OpenAI WebSocket:', error);
        });
    })
})


fastify.listen({ port: PORT }, (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server is listening on port ${PORT}`);
});