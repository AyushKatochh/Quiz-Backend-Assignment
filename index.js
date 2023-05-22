const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');
const cron = require('node-cron');
const rateLimit = require('express-rate-limit');
const memoryCache = require('memory-cache');
const app = express();
const port = 3000;

mongoose.connect('Your URI', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to the database');
})
.catch((error) => {
  console.error('Error connecting to the database:', error);
});

const quizRoutes = require('./routes/quizRoutes');

// Set up cron job
cron.schedule('* * * * *', async () => {
  // Logic to update the status of quizzes based on start and end times
  // For example, retrieve all quizzes and update their status accordingly
  const Quiz = mongoose.model('Quiz');
  const quizzes = await Quiz.find();
  const currentTime = new Date();

  for (const quiz of quizzes) {
    if (quiz.startDate > currentTime) {
      quiz.status = 'inactive';
    } else if (quiz.endDate > currentTime) {
      quiz.status = 'active';
    } else {
      quiz.status = 'finished';
    }

    await quiz.save();
  }
});

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
});

app.use(express.json());
app.use(limiter);
app.use('/quizzes', quizRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
