const express = require('express')
const middleware = require('@line/bot-sdk').middleware
const JSONParseError = require('@line/bot-sdk').JSONParseError
const SignatureValidationFailed = require('@line/bot-sdk').SignatureValidationFailed
const Client = require('@line/bot-sdk').Client;
const app = express()

const config = {
  channelAccessToken: 'HHOAAfmTTnbT3Y+pkdLqDgSlroaDflSHlhO7SZ+LU6qnfgOKVS4lWaV8OTDL16J/uA4dCshzyyhLhMoXQl1Srh5Un3vmQ0nCrC3KGnWGIogQ0KHzzzOhz5Z2cnFhkTEOV3GCaR97va15dJgN7YQA3gdB04t89/1O/w1cDnyilFU=',
  channelSecret: '5857389139b0b38f152f0e5d4e3313be'
}

const client = new Client(config);

app.get('/webhook', (req, res) => {
  res.status(200).send('run 1')
})

app.post('/webhook', middleware(config), (req, res) => {
  console.log(JSON.stringify(req.body));
  
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
})

// event handler
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
  // ignore non-text-message event
  return Promise.resolve(null);
  }

  // create a echoing text message
  const echo = { type: 'text', text: event.message.text };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// app.use((err, req, res, next) => {
//   if (err instanceof SignatureValidationFailed) {
//     res.status(401).send(err.signature)
//     return
//   } else if (err instanceof JSONParseError) {
//     res.status(400).send(err.raw)
//     return
//   }
//   next(err) // will throw default 500
// })

app.listen(process.env.PORT || 3000)