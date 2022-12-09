const axios = require("axios");
const {firebaseConfig} = require("firebase-functions");
const functions = require("firebase-functions");

// // using environment variables
// let config = require("../env.json");
// // if present in function.config()? use them instead
// if (Object.keys(functions.config()).length) {
//   config = functions.config();
// }

// ------------------------handling OpenAI API-----------------
// let config = functions.config();
const client = axios.create({
  headers: {
    Authorization:
      "Bearer " + "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",
  },
});

// -------------------------------OpenAI API--------------------

// ------------------------Telegram Bot------------------------
const {Telegraf} = require("telegraf");
const {message} = require("telegraf/filters");

const bot = new Telegraf("5820340146:AAHGDaxBlO3yLI0fFxeGUoF5qW2eELHbx5s");

bot.start((ctx) =>
  ctx.reply(
    "Welcome! Type a question to get answer. Describe the question as exact as possible."
  )
);
bot.on("text", async (ctx) => {
  let query = ctx.update.message.text + ".";
  try {
    const params = {
      prompt: query,
      max_tokens: 250,
      temperature: 0.4,
    };

    const response = await client.post(
      "https://api.openai.com/v1/engines/text-davinci-003/completions",
      params
    );
    return ctx.reply(response.data.choices[0].text);
  } catch (error) {
    return ctx.reply("error");
  }
});
bot.launch();

exports.gsQA_2 = functions.https.onRequest((request, response) => {
  response.send("Sent from openAI gsQA function >>"); //
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
