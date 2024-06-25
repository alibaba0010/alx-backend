// Import necessary modules
import kue from 'kue';

// Create an array of jobs data
const jobs = [
  {
    phoneNumber: '4153518780',
    message: 'This is the code 1234 to verify your account'
  },
  {
    phoneNumber: '4153518781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153518743',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4153538781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153118782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4153718781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4159518782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4158718781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4153818782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4154318781',
    message: 'This is the code 4562 to verify your account'
  },
  {
    phoneNumber: '4151218782',
    message: 'This is the code 4321 to verify your account'
  }
];

// Create a Kue queue named 'push_notification_code_2'
const queue = kue.createQueue();

// Process jobs in the 'push_notification_code_2' queue
queue.process('push_notification_code_2', (job, done) => {
  const { phoneNumber, message } = job.data;

  // Simulate processing progress with intervals
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    job.progress(progress, 100);

    // Log progress to the console
    console.log(`Notification job ${job.id} ${progress}% complete`);

    // If progress reaches 100%, mark the job as completed
    if (progress === 100) {
      clearInterval(interval);
      done();
    }
  }, 500);

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
});

// Loop through the array of jobs and create a new job for each object
jobs.forEach((jobData) => {
  const job = queue.create('push_notification_code_2', jobData);

  // Save the job to the queue
  job.save();
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
