const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Ollama } = require('ollama'); // Correct import style

const app = express();
const port = 5000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve the frontend HTML file
app.use(express.static(path.join(__dirname, 'public')));

// Define the POST endpoint to interact with the AI model
app.post('/ollama', async (req, res) => {
    const userMessage = req.body.message;
    const ollama = new Ollama({ host: '127.0.0.1:11434' }); // Replace with your actual host

    try {
        // Send the user message to Ollama's Llama 3 and get the response
        const response = await ollama.generate({
            model: 'llama3.1', // Adjust the model as needed
            prompt: userMessage,
            stream: true
        });

        let aiResponse = '';
        for await (const part of response) {
            console.log(part); // Log the part object to see its structure
            aiResponse += part.response; // Append the part response
        }

        res.json({ response: aiResponse });
    } catch (error) {
        console.error('Error querying Ollama:', error);
        res.status(500).json({ error: 'Failed to get response from Ollama' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
