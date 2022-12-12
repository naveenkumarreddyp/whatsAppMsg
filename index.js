const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { default: axios } = require("axios");

const app = express();
app.use(bodyParser.json());

let verifyToken = process.env.VERIFY_TOKEN;
let accessToken = process.env.ACCESS_TOKEN;

// to verify the callback ul from dashboard side- cloud api side
app.get("/webhook", (req, res) => {
  let mode = req.query["hub.mode"];
  let challenge = req.query["hub.challenge"];
  let token = req.query["hub.verify_token"];
  if (mode && token) {
    if (mode === "subscribe" && token === verifyToken) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403); // forbidden
    }
  }
});

app.post("/webhook", (req, res) => {
  let body_param = req.body;
  console.log(JSON.stringify(body_param, null, 2));
  if (body_param.object) {
    if (
      body_param.entry &&
      body_param.entry[0].changes &&
      body_param.entry[0].changes[0].value.messages &&
      body_param.entry[0].changes[0].value.messages[0]
    ) {
      let phoneNumber =
        body_param.entry[0].changes[0].value.metadata.phone_number_id;
      let from = body_param.entry[0].changes[0].value.messages[0].from;
      let msgBody = body_param.entry[0].changes[0].value.messages[0].text.body;

      axios({
        method: "POST",
        url:
          "https://graph.facebook.com/v15.0/" +
          phoneNumber +
          "/messages?access_token=" +
          accessToken,
        data: {
          messaging_product: "whatsapp",
          to: from,
          text: {
            body: msgBody,
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
});

const port = process.env.PORT || 3020;
app.listen(port, () => {
  console.log("Listening on port 3020");
});
