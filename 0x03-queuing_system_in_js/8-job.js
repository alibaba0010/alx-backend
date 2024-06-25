// Import necessary modules
import kue from 'kue';

// Create a function to create push notifications jobs
const createPushNotificationsJobs = (jobs, queue) => {
  // Check if jobs is an array
  if (!Array.isArray(jobs)) {
    throw new Error('Jobs is not an array');
  }

  // Create jobs in the queue 'push_notification_code_3'
  jobs.forEach((jobData) => {
    const job = queue.create('push_notification_code_3', jobData);

    // Save the job to the queue
    job.save();

    // Log job creation to the console
    console.log(`Notification job created: ${job.id}`);

    // Handle successful job completion
    job.on('complete', () => {
      console.log(`Notification job ${job.id} completed`);
    });

    // Handle job failure
    job.on('failed', (err) => {
      console.log(`Notification job ${job.id} failed: ${err}`);
    });

    // Handle job progress
    job.on('progress', (progress) => {
      console.log(`Notification job ${job.id} ${progress}% complete`);
    });
  });
};

export default createPushNotificationsJobs;
