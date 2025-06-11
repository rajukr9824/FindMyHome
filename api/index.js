const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRouter = require('./routes/user_route');
const authRouter = require('./routes/auth_route');
const listingRouter = require('./routes/listing_route');
const cookieParser = require('cookie-parser');
const path = require('path');

dotenv.config();

mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });


const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(PORT, () => {
  console.log(`Server started at PORT ${PORT}`);
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
