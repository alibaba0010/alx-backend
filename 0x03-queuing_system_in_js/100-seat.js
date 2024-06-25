import express from 'express';
import kue from 'kue';
import Redic from 'redic';
import { promisify } from 'util';

const app = express();
const port = 1245;

// Redis client
const redic = new Redic();
const reserveSeatAsync = promisify(redic.set).bind(redic);
const getCurrentAvailableSeatsAsync = promisify(redic.get).bind(redic);

// Kue queue
const queue = kue.createQueue();

// Initialize available seats to 50
reserveSeatAsync('available_seats', 50);

// Initialize reservationEnabled to true
let reservationEnabled = true;

// Function to reserve a seat
const reserveSeat = async (number) => {
  await reserveSeatAsync('available_seats', number);
};

// Function to get current available seats
const getCurrentAvailableSeats = async () => {
  const availableSeats = await getCurrentAvailableSeatsAsync('available_seats');
  return parseInt(availableSeats);
};

// Middleware to parse JSON
app.use(express.json());

// Route to get the number of available seats
app.get('/available_seats', async (req, res) => {
  const numberOfAvailableSeats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats: numberOfAvailableSeats.toString() });
});

// Route to reserve a seat
app.get('/reserve_seat', (req, res) => {
  if (!reservationEnabled) {
    res.json({ status: 'Reservation are blocked' });
  } else {
    const job = queue.create('reserve_seat').save((err) => {
      if (!err) {
        res.json({ status: 'Reservation in process' });
      } else {
        res.json({ status: 'Reservation failed' });
      }
    });

    job.on('complete', (result) => {
      console.log(`Seat reservation job ${job.id} completed`);
    });

    job.on('failed', (err) => {
      console.log(`Seat reservation job ${job.id} failed: ${err.message}`);
    });
  }
});

// Route to process the queue and decrease available seats
app.get('/process', async (req, res) => {
  res.json({ status: 'Queue processing' });

  queue.process('reserve_seat', async (job, done) => {
    const currentAvailableSeats = await getCurrentAvailableSeats();
    const newAvailableSeats = currentAvailableSeats - 1;

    if (newAvailableSeats >= 0) {
      await reserveSeat(newAvailableSeats);

      if (newAvailableSeats === 0) {
        reservationEnabled = false;
      }

      done();
    } else {
      done(new Error('Not enough seats available'));
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
