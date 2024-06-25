// Import necessary modules
import kue from 'kue';

// Create an array of blacklisted phone numbers
const blacklistedNumbers = ['4153518780', '4153518781'];

// Create a function to send a notification
const sendNotification = (phoneNumber, message, job, done) => {
  // Track the progress of the job from 0 to 100
  let progress = 0;

  // Simulate processing progress with intervals
  const interval = setInterval(() => {
    job.progress(progress, 100);
    console.log(`Notification job #${job.id} ${progress}% complete`);
    progress += 10;

    // If progress reaches 50%, log the notification
    if (progress === 50) {
      console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
    }

    // If progress reaches 100%, mark the job as completed
    if (progress === 100) {
      clearInterval(interval);
      done();
    }
  }, 500);

  // Check if the phone number is blacklisted
  if (blacklistedNumbers.includes(phoneNumber)) {
    // Fail the job with an Error object and a message
    done(new Error(`Phone number ${phoneNumber} is blacklisted`));
  }
};

// Create a Kue queue named 'push_notification_code_2' that processes two jobs at a time
const queue = kue.createQueue({ concurrency: 2 });

// Process jobs in the 'push_notification_code_2' queue
queue.process('push_notification_code_2', (job, done) => {
  const { phoneNumber, message } = job.data;

  // Call the sendNotification function with job data
  sendNotification(phoneNumber, message, job, done);

  // Handle successful job completion
  job.on('complete', () => {
    console.log(`Notification job #${job.id} completed`);
  });

  // Handle job failure
  job.on('failed', (err) => {
    console.log(`Notification job #${job.id} failed: ${err.message}`);
  });
});

// Handle the connection event
queue.on('ready', () => {
  console.log('Kue queue is ready to process jobs');
});

// Handle the error event
queue.on('error', (err) => {
  console.error(`Error in Kue queue: ${err}`);
});

// Close the Kue queue connection when the script is interrupted
process.on('SIGINT', () => {
  queue.shutdown(5000, (err) => {
    console.log('Kue queue shutdown');
    process.exit(0);
  });
});
