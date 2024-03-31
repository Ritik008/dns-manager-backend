require("dotenv").config();
const express = require("express");
const dnsRoutes = require('./routes');
const { createError } = require("./utils/error");
const morgan = require("morgan");
const cors = require('cors')

const app = express();

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

app.use('/api', dnsRoutes)

//* Catch HTTP 404
app.use((req, res, next) => {
  next(createError(404));
});

//* Error Handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  res.json({
    error: {
      status: err.statusCode || 500,
      message: err.message,
    },
  });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is up at ${port}`);
});