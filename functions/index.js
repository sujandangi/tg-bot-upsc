const axios = require("axios");
const functions = require("firebase-functions");

// using environment variables
let config = require("../env.json");
// if present in function.config()? use them instead
if (Object.keys(functions.config()).length) {
  config = functions.config();
}

// ------------------------handling OpenAI API-----------------
const client = axios.create({
  headers: {
    Authorization: "Bearer " + config.service.openai_key,
  },
});

// -------------------------------OpenAI API--------------------

// ------------------------Telegram Bot------------------------
const {Telegraf} = require("telegraf");
const {message} = require("telegraf/filters");

const bot = new Telegraf(config.service.telegram_key);

bot.start((ctx) =>
  ctx.reply("Welcome! Type anything and you will receive a motivating quote!"),
);
bot.on(message("text"), async (ctx) => {
  try {
    const params = {
      prompt: "tell me a motivating quote.",
      max_tokens: 100,
    };

    const response = await client.post(
        "https://api.openai.com/v1/engines/text-davinci-003/completions",
        params,
    );
    return ctx.reply(response.data.choices[0].text);
  } catch (error) {
    return ctx.reply("error");
  }
});
bot.launch();

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Sent from openai >>"); //
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
