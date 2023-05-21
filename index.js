const express = require('express');
const mongoose = require('mongoose');
const moment = require('moment');
const app = express();
const port = 3000; // You can change the port number if needed

mongoose.connect('mongodb+srv://ayush2002:ayush2002@cluster0.gvgmwk2.mongodb.net/?retryWrites=true&w=majority', {
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

app.use(express.json());
app.use('/quizzes', quizRoutes);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  