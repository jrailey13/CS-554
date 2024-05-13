const bluebird = require('bluebird');
const express = require('express');
const app = express();
const redis = require('redis');
const client = redis.createClient();

const makeTestPromise = () => {
  return new Promise((fulfill, reject) => {
    setTimeout(() => {
      fulfill({status: 'Good'});
    }, 5000);
  });
};

app.get('/', async (req, res, next) => {
  let cacheForHomePageExists = await client.get('homePage');
  if (cacheForHomePageExists) {
    console.log('Data was in cache');
    res.send(cacheForHomePageExists);
  } else {
    next();
  }
});

app.get('/', async (req, res) => {
  let result = makeTestPromise();
  let secondResult = makeTestPromise();
  let bothResults = await Promise.all([result, secondResult]);
  console.log('Data was not in cache');
  res.json(bothResults);
  let cachedForHomePage = await client.set(
    'homePage',
    JSON.stringify(bothResults)
  );
});

app.listen(3000, async () => {
  await client.connect();
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
