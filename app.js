const express = require('express');
const cors = require('cors');
const OpenAIApi = require('openai');
require('dotenv').config()

// Fetch the API key from the environment variable
const apiKey = process.env.OPENAI_API_KEY;

// Check if the API key is available
if (!apiKey) {
  throw new Error("The OPENAI_API_KEY environment variable is missing or empty.");
}

const openai = new OpenAIApi({ apiKey, engine: 'text-davinci-003' });

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.post('/get_suggestion', async (req, res) => {
  try {
    const user_input = req.body.user_input;
    console.log(user_input)

    if (user_input) {
      const prompt = '`Once upon a time, ${user_input}.`';
      const response = await openai.completions.create(prompt, {
        max_tokens: 100,
      });
      const suggestion = response.choices[0].text;
      res.json({ suggestion });
    } else {
      res.status(400).json({ error: 'Please provide input for a suggestion.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
