// Import necessary modules
import redis from 'redis';

// Create a Redis client
const publisher = redis.createClient({
  host: '127.0.0.1',
  port: 6379,
});

// Handle the connection event
publisher.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Handle the error event
publisher.on('error', (err) => {
  console.error(`Redis client not connected to the server: ${err.message}`);
});

// Function to publish a message after a certain time
const publishMessage = (message, time) => {
  setTimeout(() => {
    console.log(`About to send ${message}`);
    publisher.publish('holberton school channel', message);
  }, time);
};

// Call publishMessage for different messages and times
publishMessage('Holberton Student #1 starts course', 100);
publishMessage('Holberton Student #2 starts course', 200);
publishMessage('KILL_SERVER', 300);
publishMessage('Holberton Student #3 starts course', 400);

// Close the Redis connection when the script is done
setTimeout(() => {
  publisher.quit();
}, 500);
