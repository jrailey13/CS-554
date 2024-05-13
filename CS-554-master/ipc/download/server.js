import express from 'express';
const app = express();
import redisConnection from './redis-connection.js';

app.get('/compute-results', async (req, res) => {
  redisConnection.emit('computeResults', {message: 'NOWHERE IS SAFE'});
  return res.json({done: false, working: true});
});

app.get('/show-results', async (req, res) => {
  redisConnection.on('results-completed', (data, channel) => {
    return res.json({data});
  });

  redisConnection.emit('showResults', {message: 'Trust no one'});
});

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
