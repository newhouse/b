
const express   = require('express');
const helmet    = require('helmet');
const morgan    = require('morgan');
const routes    = require('./routes');

const isDev     = process.env.NODE_ENV == 'development';
const isTesting = process.env.NODE_ENV == 'testing';

const app = express()
  .use(morgan(isDev || isTesting ? 'dev' : 'combined'))
  .use(helmet())
  .use(routes)
  .set('json spaces', 2);


// A simple Error Handler
app.use((err, req, res, next) => {
  if (err) {
    res.status(err.statusCode || err.status || 500);

    // If we are in development, it's ok to print the full err
    if (isDev) {
      res.send(err);
    }
    else {
      // If it's a JOI validation error, change the status set the
      // message to be from the first error.
      if (err.isJoi) {
        // Bad data
        res.status(400);
        err.message = err.details[0].message;
      }

      // Send only a little bit, not the full error with stack trace, etc
      res.send(err.data || err.message || {});
    }
  }
  else {
    next();
  }
});


module.exports = {
  app
};