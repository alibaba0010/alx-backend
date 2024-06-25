import redis from 'redis';

// Create a Redis client
const client = redis.createClient({
  host: '127.0.0.1',
  port: 6379
});

// Handle the connection event
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Handle the error event
client.on('error', (err) => {
  console.error(`Redis client not connected to the server: ${err.message}`);
});

// Create Hash using hset
client.hset('HolbertonSchools', 'Portland', 50, redis.print);
client.hset('HolbertonSchools', 'Seattle', 80, redis.print);
client.hset('HolbertonSchools', 'New York', 20, redis.print);
client.hset('HolbertonSchools', 'Bogota', 20, redis.print);
client.hset('HolbertonSchools', 'Cali', 40, redis.print);
client.hset('HolbertonSchools', 'Paris', 2, redis.print);

// Display Hash using hgetall
client.hgetall('HolbertonSchools', (err, reply) => {
  if (err) {
    console.error(`Error retrieving hash values: ${err.message}`);
  } else {
    console.log(reply);
  }

  // Close the Redis connection when the script is done
  client.quit();
});
