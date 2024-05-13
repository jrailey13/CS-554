import express, {json} from 'express';
const app = express();
import redisConnection from './redis-connection.js';
import {sendMessage} from './nrp-sender-shim.js';

app.use(express.json());

app.post('/send-message', async (req, res) => {
  let response = await sendMessage({
    redis: redisConnection,
    eventName: 'send-message',
    data: {
      message: req.body.message
    },
    expectsResponse: false
  });

  res.json({sent: 'OK'});
});

app.post('/send-message-with-reply', async (req, res) => {
  try {
    let response = await sendMessage({
      redis: redisConnection,
      eventName: 'send-message-with-reply',
      data: {
        message: req.body.message
      }
    });

    res.json(response);
  } catch (e) {
    res.json({error: e.message});
  }
});

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
