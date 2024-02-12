import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import globalErrorHandler from './controller/error.controller.js';
import CreateError from './utils/error.utils.js';
import cookieParser from 'cookie-parser';

dotenv.config();

mongoose
  .connect(process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD))
  .then(() => console.log('Connect to DB Successfuly.'))
  .catch((err) => console.log(err));

const __dirname = path.resolve();

const app = express();

// GlOBAL MIDDLEWARE
app.use(express.json());
app.use(cookieParser());

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});
app.all('*', (req, res, next) => {
  next(CreateError(`This ${req.originalUrl} Is Not On The Server`, 404));
});

app.use(globalErrorHandler);
