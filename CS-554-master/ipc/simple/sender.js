import redisConnection from './redis-connection.js';

redisConnection.emit('send-message', {
  message: 'Hello, world!'
});

setTimeout(() => {
  console.log('Timeout!!!');
  redisConnection.quit();
}, 2500);
