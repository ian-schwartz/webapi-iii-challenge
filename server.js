const express = require('express');
const server = express();
const userRouter = require('./users/userRouter');
const postRouter = require('./posts/postRouter');
require('dotenv').config();
server.use(express.json());

//custom middleware

function logger(req, res, next) {
  console.log(
    `The Logger: [${new Date().toISOString()}] ${req.method} to ${req.url}`
    );

  next();
};

server.use(logger);
server.use('/api/user', userRouter);
server.use('/api/post', postRouter);

server.get('/', (req, res) => {
  const message = process.env.MSG || 'Hello :)';
  res.status(200).json({ message: message });
});

module.exports = server;
