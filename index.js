const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { default: axios } = require("axios");
const { createBot } = require("whatsapp-cloud-api");
const request = require("request");

const app = express();
app.use(bodyParser.json());

let mytoken = "abc123";
let token = "EAAWH8DXOPbkBABcupf3LZAFZArncv1uHBzfZCHiIyyoZBWzYtqZAp3Y5cZA9tNUBHqeMRIp3ewo3MvwTkyZBnIy6OJYHOEwsfdKHq6DCOw6WmyfaTFOcxE0O1T0LLODsZAVLytxuplPlZBOe4Yg2NZBeSGaJU4kUMngOKfSM3LQZBsgBhe1OyYHSFbfZAaQc758Sz7PDTcqqPSIlcAZDZD";
app.get("/webhook",(req,res)=>{
   let mode=req.query["hub.mode"];
   let challange=req.query["hub.challenge"];
   let token=req.query["hub.verify_token"];
    if(mode && token){
        if(mode==="subscribe" && token===mytoken){
            res.status(200).send(challange);
        }else{
            res.status(403);
        }
    }
});

app.post("/webhook",(req,res)=>{ //i want some 
    let body_param=req.body;
    console.log(JSON.stringify(body_param,null,2));
    if(body_param.object){
        console.log("inside body param");
        if(body_param.entry && 
            body_param.entry[0].changes && 
            body_param.entry[0].changes[0].value.messages && 
            body_param.entry[0].changes[0].value.messages[0]  
            ){
               let phon_no_id=body_param.entry[0].changes[0].value.metadata.phone_number_id;
               let from = body_param.entry[0].changes[0].value.messages[0].from; 
               let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

               console.log("phone number "+phon_no_id);
               console.log("from "+from);
               console.log("body param "+msg_body);

               axios({
                   method:"POST",
                   url:"https://graph.facebook.com/v15.0/"+phon_no_id+"/messages?access_token="+token,
                   data:{
                       messaging_product:"whatsapp",
                       to:from,
                       text:{
                           body:"Hi.. I'm Naveen, your message is "+msg_body
                       }
                   },
                   headers:{
                       "Content-Type":"application/json"
                   }

               });
               res.sendStatus(200);
            }else{
                res.sendStatus(404);
            }
    }

});
// to verify the callback ul from dashboard side- cloud api side
// app.get("/webhook", (req, res) => {
//   let mode = req.query["hub.mode"];
//   let challenge = req.query["hub.challenge"];
//   let token = req.query["hub.verify_token"];
//   if (mode && token) {
//     if (mode === "subscribe" && token === verifyToken) {
//       console.log("WEBHOOK_VERIFIED");
//       res.status(200).send(challenge);
//     } else {
//       res.sendStatus(403); // forbidden
//     }
//   }
// });

// app.post("/webhook", async (req, res) => {
//   let body_param = req.body;
//   console.log("body_param", body_param)
//   if (body_param.object) {
//     console.log("object",body_param.object )
//     console.log("object1",body_param.entry )
//     console.log("object2",body_param.entry[0].changes )
//      console.log("object3",body_param.entry[0].changes[0].value.messages )
//     console.log("phno",body_param.entry[0].changes[0].value.metadata.phone_number_id )
//     console.log("from",body_param.entry[0].changes[0].value.messages[0].from )
//     console.log("msgbody",body_param.entry[0].changes[0].value.messages[0].text.body )
//     if (
//       body_param.entry &&
//       body_param.entry[0].changes &&
//       body_param.entry[0].changes[0].value.messages &&
//       body_param.entry[0].changes[0].value.messages[0]
//     ) {
//       let phoneNumber =
//         body_param.entry[0].changes[0].value.metadata.phone_number_id;
//       let from = body_param.entry[0].changes[0].value.messages[0].from;
//       let msgBody = body_param.entry[0].changes[0].value.messages[0].text.body;
//       try {
//         console.log(phoneNumber, from, msgBody);
//         if (msgBody.toLowerCase() === "hi") {//
//           msgBody = "Hello Naveen";
//         }
//         console.log(phoneNumber, from, msgBody);
//         let data = await axios({
//           method: "POST",
//           url: `https://graph.facebook.com/v15.0/${phoneNumber}/messages`,
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "content-type": "application/json",
//           },
//           data: {
//             messaging_product: "whatsapp",
//             to: from,
//             text: {
//               body: msgBody,
//             },
//           },
//         });
// //         console.log(data);
//       } catch (err) {
//         console.log(err);
//       }
//     }
//   }
//   res.status(200).send("OK");
// });

// app.post("/webhook", async (req, res) => {
//   let body_param = req.body;
//   // let accToken = req.headers["authorization"];
//   // console.log(JSON.stringify(body_param, null, 2));
//   if (body_param.object) {
//     if (
//       body_param.entry &&
//       body_param.entry[0].changes &&
//       body_param.entry[0].changes[0].value.messages &&
//       body_param.entry[0].changes[0].value.messages[0]
//     ) {
//       let phoneNumber =
//         body_param.entry[0].changes[0].value.metadata.phone_number_id;
//       let from = body_param.entry[0].changes[0].value.messages[0].from;
//       let msgBody = body_param.entry[0].changes[0].value.messages[0].text.body;
//       // console.log("phoneNumber", phoneNumber, from, msgBody);
//       try {
//   console.log(phoneNumber, from, msgBody);
//   // let data = await axios({
//   //   method: "POST",
//   //   url:
//   //     "https://graph.facebook.com/v15.0/" +
//   //     phoneNumber +
//   //     "/messages?access_token=" +
//   //     accToken,
//   //   data: {
//   //     messaging_product: "whatsapp",
//   //     to: from,
//   //     text: {
//   //       body: msgBody,
//   //     },
//   //   },
//   //   headers: {
//   //     "Content-Type": "application/json",
//   //   },
//   // });
// let data = await axios.post(
// `https://graph.facebook.com/v15.0/${phoneNumber}/messages?access_token=${accessToken}`,
// {
//   messaging_product: "whatsapp",
//   to: from,
//   text: {
//     body: msgBody,
//   },
// }
//   {
//     url: `https://graph.facebook.com/v15.0/${phoneNumber}/messages`,
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       "content-type": "application/json",
//     },
//     body: JSON.stringify({
//       messaging_product: "Whatsapp",
//       to: from,
//       // type: type,
//       // template: template,
//       text: {
//         body: msgBody,
//       },
//     }),
//   }
// );
// console.log("data", data);
//   res.send(200, "Message sent");
// } catch (error) {
//   console.log("error", error);
//   res.send(500, error.message);
// }
// let data = await axios.post(
//   {
//     url: `https://graph.facebook.com/v15.0/102872932680206/messages`,
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       "content-type": "application/json",
//     },
//     body: JSON.stringify({
//       messaging_product: "Whatsapp",
//       to: from,
//       // type: type,
//       // template: template,
//       text: {
//         body: msgBody,
//       },
//     }),
//   },
//   function (err, resp, body) {
//     if (err) {
//       console.log("Error!");
//     } else {
//       res.json(JSON.parse(body));
//     }
//   }
// );
//     }
//   }
// });
app.post("/sendmsg", async (req, res) => {
  try {
    const from = 102872932680206; //"YOUR_WHATSAPP_PHONE_NUMBER_ID";
    const token =
      "EAAO9aDLEtwABAFbSyfEZAGLfiOkKgJepiHwmJ5I6Oh4URUDunxQiEXZCtn3fKA8wJaHcPlSKmdcxiTZAY2j6ePbVFcDpYgPAHGPGulSZCGB4L63FEkaZByOCZBkcheUJ1W5tzkBXZCAYgkRVEYXX9etF8Ib3dGYU1kUXHZBHee3iDVTHQvm1ZBHyjBqmm14AAaRTr4oYtGz53kgZDZD";
    //accessToken; //"YOUR_TEMPORARY_OR_PERMANENT_ACCESS_TOKEN";
    const to = 918096842990; //"PHONE_NUMBER_OF_RECIPIENT"; // your phone number without the leading '+'
    const webhookVerifyToken =
      "K;jMp%'V2i~G$NY]Ug^a0rzb&eF2L=N@VqhX;Jnl(v!YSMTxGR";
    //  verifyToken; //"YOUR_WEBHOOK_VERIFICATION_TOKEN"; // use a random value, e.g. 'bju#hfre@iu!e87328eiekjnfw'

    const bot = createBot(from, token);
    // console.log(bot);
    const result = await bot.sendText(to, "Hello world");
    // const result1 = await bot.sendImage(to, "https://picsum.photos/200/300", {
    //   caption: "Random jpg",
    // });

    // Start express server to listen for incoming messages
    await bot.startExpressServer({
      webhookVerifyToken,
    });

    // Listen to ALL incoming messages
    bot.on("message", async (msg) => {
      console.log(msg);

      if (msg.type === "text") {
        await bot.sendText(msg.from, "Received your text message!");
      } else if (msg.type === "image") {
        await bot.sendText(msg.from, "Received your image!");
      }
    });
    res.send(200, result);
  } catch (err) {
    console.log(err);
    res.send(500, err.message);
  }
});
app.post("/callapi", async (req, res) => {
  const { id, to, type, template } = req.body;
  // console.log("id", id);
  // console.log("to", to);
  // console.log("type", type);
  // console.log("template", template);
  // console.log("accessToken", accessToken);
  if (!id || !to || !type || !template) {
    return res.status(400).json({
      error: "Required Fields: to, type, template and id",
    });
  }
  request.post(
    {
      url: `https://graph.facebook.com/v15.0/${id}/messages`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: to,
        type: type,
        template: template,
      }),
    },
    function (err, resp, body) {
      if (err) {
        console.log("Error!");
      } else {
        res.json(JSON.parse(body));
      }
    }
  );
});
app.post("/callapiWithTemplate", async (req, res) => {
  const { id, to, type, template } = req.body;
  // console.log("id", id);
  // console.log("to", to);
  // console.log("type", type);
  // console.log("template", template);
  // console.log("accessToken", accessToken);
  if (!id || !to || !type || !template) {
    return res.status(400).json({
      error: "Required Fields: to, type, template and id",
    });
  }
  request.post(
    {
      url: `https://graph.facebook.com/v15.0/${id}/messages`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: to,
        type: type,
        template: template,
      }),
    },
    function (err, resp, body) {
      if (err) {
        console.log("Error!");
      } else {
        res.json(JSON.parse(body));
      }
    }
  );
});

app.get("getwebhook", async (req, res) => {});

app.post("/newwebhook", async (req, res) => {});

const port = process.env.PORT || 3020;
app.listen(port, () => {
  console.log("Listening on port 3020");
});
