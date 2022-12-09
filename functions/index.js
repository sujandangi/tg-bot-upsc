const axios = require("axios");
const functions = require("firebase-functions");

// using environment variables
// let config = require("../env.json");
// // if present in function.config()? use them instead
// if (Object.keys(functions.config()).length) {
//   config = functions.config();
// }

// ------------------------handling OpenAI API-----------------
const client = axios.create({
  headers: {
    Authorization: "Bearer " + "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",
  },
});

// -------------------------------OpenAI API--------------------

// ------------------------Telegram Bot------------------------
const {Telegraf} = require("telegraf");
const {message} = require("telegraf/filters");

const bot = new Telegraf("5820340146:AAHGDaxBlO3yLI0fFxeGUoF5qW2eELHbx5s");

bot.start((ctx) =>
  ctx.reply("Welcome! Type a question to get answer. Be descriptive.")
);
bot.on("text", async (ctx) => {
  let query = "Try to answer the questions in about 150 words as a teacher. Include examples from India if possible"
    ctx.update.message.text;
  try {
    const params = {
      prompt: query,
      max_tokens: 250,
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

exports.gsQA = functions.https.onRequest((request, response) => {
  response.send("Sent from openAI gsQA function >>"); //
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
