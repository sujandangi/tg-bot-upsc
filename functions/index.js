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
    Authorization: "Bearer " + config.service.openai_key,
  },
});

const params = {
  prompt: "tell me a motivating quote.",
  max_tokens: 100,
};

let data = "please wait";

client
  .post(
    "https://api.openai.com/v1/engines/text-davinci-003/completions",
    params
  )
  .then((result) => {
    console.log(result.data);
    data = result.data.choices[0].text;
  })
  .catch((err) => {
    console.log(err);
    data = err;
  });

exports.helloWorld = functions.https.onRequest((request, response) => {
  // functions.logger.info("Hello logs!", { structuredData: true });
  response.send(`Sent from openai >> ${data}`); //
});
