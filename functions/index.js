const mySecret = process.env["OPENAI_API_KEY"];
const axios = require("axios");
const functions = require("firebase-functions");

// using environment variables
let config = require("./env.json");
// if present in function.config()? use them instead
if (Object.keys(functions.config()).length) {
  config = functions.config();
}

// ------------------------handling OpenAI API----------------------------
const client = axios.create({
  headers: {
    Authorization:
      "Bearer " + "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",
  },
});

// -------------------------------OpenAI API------------------------------------------

// ------------------------Telegram Bot-------------------------------------------------
const {Telegraf} = require("telegraf");

const bot = new Telegraf(config.service.telegram_key);

bot.start((ctx) =>
  ctx.reply("Welcome! Type anything and you will receive a motivating quote!")
);
bot.on("text", async (ctx) => {
  try {
    const params = {
      prompt: "tell me a motivating quote.",
      max_tokens: 100,
    };

    const response = await client.post(
      "https://api.openai.com/v1/engines/text-davinci-003/completions",
      params
    );
    // const completion = response.data.choices[0].text;

    return ctx.reply(response.data.choices[0].text);
  } catch (error) {
    return ctx.reply("error");
  }
  // client
  // .post(
  //   "https://api.openai.com/v1/engines/text-davinci-003/completions",
  //   params
  // )
  // .then((result) => {
  //   console.log(result.data);
  //   data = result.data.choices[0].text;
  //   await ctx.reply(`${data}`);
  // })
  // .catch((err) => {
  //   console.log(err);
  //   data = err;
  //   await ctx.reply(`${data}`);
});
bot.launch();

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   // functions.logger.info("Hello logs!", { structuredData: true });
//   response.send(`Sent from openai >>`); //
// });

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
