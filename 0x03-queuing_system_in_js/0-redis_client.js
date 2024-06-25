import redis from 'redis';

// Create a Redis Client
const client = redis.createClient({
  host: '127.0.0.1',
  port: 6379
});

// Attempt to connect to the Redis server
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Handle errors during connection
client.on('error', (err) => {
  console.error(`Redis client not connected to the server: ${err}`);
});

// Close the Redis connection when the script exists
process.on('SIGINT', () => {
  client.quit(() => {
    console.log('Redis client disconnected');
    process.exit();
  });
});
