'use strict';

// Libraries
const express = require('express');
const bodyParser = require('body-parser');

// Custom modules
const httpH = require('./httpHelpers');

// Configuration
const PORT = 3000;

const app = express();
app.use(express.json());

app.use(function (req, res, next) {
  console.log('Received request: ' + httpH.stringifyReq(req));
  next();
});

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/event/checkin/:eventCode', function (req, res) {
  if (!httpH.requireJsonBody(res, req.body)) { return; }

  // Extract fields)
  const firstName = req.body.firstName;
  if (!httpH.requireJsonField(res, firstName, 'firstName')) { return; };
  const lastName = req.body.lastName;
  if (!httpH.requireJsonField(res, lastName, 'lastName')) { return; };
  const email = req.body.email;
  if (!httpH.requireJsonField(res, email, 'email')) { return; };

  console.log(firstName);
  console.log(lastName);
  console.log(email);

  res.status(httpH.HTTPSTATUS.CREATED).end();
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}.`));
