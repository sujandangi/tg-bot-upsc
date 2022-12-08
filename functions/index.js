const functions = require("firebase-functions");
const {Telegraf} = require("telegraf");
const { Configuration, OpenAIApi } = require("openai"); // OPENAI
let config = require("./env.json");

const Telegraf = require('telegraf')
const fetch = require('node-fetch')

// Create a new Telegram bot
const bot = new Telegraf(config.service.telegram_key)

// Set up a command that predicts completions for the user's message
bot.command('completions', (ctx) => {
  // Get the user's message
  const message = ctx.message.text

  // Send a request to the ChatGPT API to predict completions for the message
  fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.service.openai_key}`
    },
    body: JSON.stringify({
      prompt: message,
      max_tokens: 100,
      temperature: 0.5,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    })
  })
    .then(response => response.json())
    .then(data => {
      // Get the predicted completions from the response
      const completions = data.choices[0].text

      // Reply to the user with the predicted completions
      ctx.reply(completions)
    })
    .catch(err => {
      // Log any errors that occurred
      console.error(err)
    })
})

// Start the bot
bot.startPolling()


exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase Modified!");
});
