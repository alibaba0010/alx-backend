// Import necessary modules
import redis from 'redis';

// Create a Redis client
const subscriber = redis.createClient({
  host: '127.0.0.1',
  port: 6379,
});

// Handle the connection event
subscriber.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Handle the error event
subscriber.on('error', (err) => {
  console.error(`Redis client not connected to the server: ${err.message}`);
});

// Subscribe to the channel 'holberton school channel'
subscriber.subscribe('holberton school channel');

// Handle incoming messages
subscriber.on('message', (channel, message) => {
  console.log(message);

  // Unsubscribe and quit if the message is 'KILL_SERVER'
  if (message === 'KILL_SERVER') {
    subscriber.unsubscribe();
    subscriber.quit();
  }
});
