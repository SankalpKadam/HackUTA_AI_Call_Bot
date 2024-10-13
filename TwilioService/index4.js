const GPT4All = require('gpt4all');

const gpt4all = new GPT4All('gpt4all-falcon-newbpe-q4_0.gguf'); // Load your GPT4All model

// Open the model before starting the server
gpt4all.open().then(() => {
    console.log('GPT4All model loaded');
});

async function getLLMResponse(userInput) {
    try {
        const response = await gpt4all.prompt(userInput);
        return response; // Return the response from GPT4All
    } catch (error) {
        console.error('GPT4All request error:', error);
        return 'Sorry, I could not process your request at this time.';
    }
}
app.all('/results', async (req, res) => {
    const userData = req.body.SpeechResult.toLowerCase();
    const twiml = new VoiceResponse();

    // Assuming burgers as an example
    if (userData.includes('burger')) {
        sessions[req.body.From].step = 'ask-anything-else';

        // Call GPT4All for a response
        const gptResponse = await getLLMResponse(userData);

        // Save response in session and redirect to continue
        sessions[req.body.From].response = gptResponse;
        res.redirect('/continue');
    } else {
        twiml.say('We only serve burgers right now. Sorry, please call again later.');
        twiml.hangup();
        delete sessions[req.body.From];
        res.send(twiml.toString());
    }
});
const menu = ['burger', 'fries', 'drink'];

// Example: Modify getLLMResponse to take menu into account
async function getLLMResponse(userInput) {
    const menuItem = menu.find(item => userInput.includes(item));
    if (menuItem) {
        return `Sure, I've added ${menuItem} to your order. Do you want anything else?`;
    } else {
        return 'I didn’t understand your request. We have burgers, fries, and drinks.';
    }
}

// Start server
const port = 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});