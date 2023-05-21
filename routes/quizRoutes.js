const express = require('express');
const moment = require('moment');
const Quiz = require('../models/quiz');

const router = express.Router();

// Create a new quiz
router.post('/', async (req, res) => {
  try {
    const { question, options, rightAnswer, startDate, endDate } = req.body;
    const quiz = new Quiz({
      question,
      options,
      rightAnswer,
      startDate,
      endDate,
    });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get the active quiz
router.get('/active', async (req, res) => {
  try {
    const now = moment();
    const quiz = await Quiz.findOne({
      startDate: { $lte: now },
      endDate: { $gte: now },
    });
    if (quiz) {
      res.json(quiz);
    } else {
      res.status(404).json({ error: 'No active quiz found' });
    }
  } catch (error) {
    console.error('Error retrieving active quiz:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get the result of a quiz by ID
router.get('/:id/result', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (quiz) {
      if (quiz.status === 'finished') {
        res.json({ result: quiz.rightAnswer });
      } else {
        res.status(404).json({ error: 'Quiz result not available yet' });
      }
    } else {
      res.status(404).json({ error: 'Quiz not found' });
    }
  } catch (error) {
    console.error('Error retrieving quiz result:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all quizzes
router.get('/all', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (error) {
    console.error('Error retrieving quizzes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
