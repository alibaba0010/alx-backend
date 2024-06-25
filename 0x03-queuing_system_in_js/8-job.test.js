import { expect } from 'chai';
import kue from 'kue';
import createPushNotificationsJobs from './8-job.js';

// Create a Kue queue for testing
const testQueue = kue.createQueue({ redis: { createClientFactory: () => kue.redis.createClient() } });

describe('createPushNotificationsJobs', () => {
  before(() => {
    // Enter test mode without processing the jobs
    testQueue.testMode.enter();
  });

  after(() => {
    // Clear the queue and exit test mode after tests
    testQueue.testMode.clear();
    testQueue.testMode.exit();
  });

  it('display an error message if jobs is not an array', () => {
    // Expect an error to be thrown if jobs is not an array
    expect(() => createPushNotificationsJobs('not an array', testQueue)).to.throw('Jobs is not an array');
  });

  it('create two new jobs to the queue', () => {
    // Create an array of jobs
    const jobs = [
      { phoneNumber: '4153518780', message: 'Test message 1' },
      { phoneNumber: '4153518781', message: 'Test message 2' },
    ];

    // Call the function to create jobs in the queue
    createPushNotificationsJobs(jobs, testQueue);

    // Assert that two jobs were created in the test queue
    expect(testQueue.testMode.jobs.length).to.equal(2);

    // Assert that the job creation log messages were printed to the console
    expect(testQueue.testMode.jobs[0].log).to.include('Notification job created:');
    expect(testQueue.testMode.jobs[1].log).to.include('Notification job created:');
  });

  // Add more test cases as needed
});
