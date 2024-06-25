// Import necessary modules
import kue from 'kue';

// Create a Kue queue named 'push_notification_code'
const queue = kue.createQueue();

// Create an object containing the Job data
const jobData = {
  phoneNumber: '1234567890',
  message: 'Hello, this is a notification!',
};

// Create a job with the provided data
const job = queue.create('push_notification_code', jobData);

// Handle successful job creation
job.on('enqueue', () => {
  console.log(`Notification job created: ${job.id}`);
});

// Handle successful job completion
job.on('complete', () => {
  console.log('Notification job completed');
  // Remove the job from the queue once it's completed
  job.remove((err) => {
    if (err) throw err;
    // Close the Kue queue connection
    kue.app.listen(3001);
    kue.app.set('title', 'Kue');
  });
});

// Handle job failure
job.on('failed', () => {
  console.log('Notification job failed');
});

// Save the job to the queue
job.save();

// Close the Kue queue connection when the script is done
setTimeout(() => {
  queue.shutdown(5000, (err) => {
    console.log('Kue queue shutdown');
    process.exit(0);
  });
}, 1000);
