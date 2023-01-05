const { createBot } = require("whatsapp-cloud-api");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

app.post("/sendmsg", async (req, res) => {
  try {
    // replace the values below from the values you copied above
    const from = 102872932680206; //"YOUR_WHATSAPP_PHONE_NUMBER_ID";
    const token =
      "EAAO9aDLEtwABAMCehD88PKZCurDkU6vVU4cXYyTyqQLj9u5MDpEFHNDYXTaBHcbvizr0f8xg5SJZBfotvMABoGbisNmiQnBP0ALCcjPP8eyWCSupRnWoHLsg0j6kax0XUVD7EkyMp2Xh2LOCNiCyd4mT1InXdWRCRSfR4KqmDnO53d0BtvZBuDUtDtpFtquzdURpjdB9gZDZD"; //"YOUR_TEMPORARY_OR_PERMANENT_ACCESS_TOKEN";
    const to = 918096842990; //"PHONE_NUMBER_OF_RECIPIENT"; // your phone number without the leading '+'
    const webhookVerifyToken =
      "K;jMp%'V2i~G$NY]Ug^a0rzb&eF2L=N@VqhX;Jnl(v!YSMTxGR"; //"YOUR_WEBHOOK_VERIFICATION_TOKEN"; // use a random value, e.g. 'bju#hfre@iu!e87328eiekjnfw'

    const bot = createBot(from, token);

    const result = await bot.sendText(to, "Hello world");

    // Start express server to listen for incoming messages
    // await bot.startExpressServer({
    //   webhookVerifyToken,
    // });

    // // Listen to ALL incoming messages
    // bot.on("message", async (msg) => {
    //   console.log(msg);

    //   if (msg.type === "text") {
    //     await bot.sendText(msg.from, "Received your text message!");
    //   } else if (msg.type === "image") {
    //     await bot.sendText(msg.from, "Received your image!");
    //   }
    // });

    console.log(result);
    res.send("Message sent", result);
  } catch (err) {
    console.log(err);
    // res.status(500).send(err.message);
  }
});
const port = process.env.PORT || 3020;
app.listen(port, () => {
  console.log("Listening on port 3020");
});
