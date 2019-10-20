'use strict';

// Libraries
const express = require('express');
const bodyParser = require('body-parser');

// Configuration
const PORT = 3000;

function isEmptyOrNull(obj) {
  return !obj || Object.keys(obj).length === 0;
}

const HTTPSTATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

function setHttpError(res, status, msg) {
  res.status(status).send({
    'status': status,
    'message': msg
  });
}

// Sets the HTTP error before exiting if the body is not present.
// Returns whether the body was present.
function requireJsonBody(res, field) {
  if (isEmptyOrNull(field)) {
    setHttpError(res, HTTPSTATUS.BAD_REQUEST,
      'A JSON request body and header is required.');
    return false;
  }
  return true;
}

// Sets the HTTP error before exiting if the field is not present.
// Returns whether the field was present.
function requireJsonField(res, field, fieldName) {
  if (!field) {
    setHttpError(res, HTTPSTATUS.BAD_REQUEST,
      'Field ' + fieldName + ' is required');
    return false;
  }
  return true;
}

const app = express();
app.use(express.json());

app.use(function (req, res, next) {
  console.log(
    'Received request: ' + req.method + ' ' + req.url + ' ' +
    JSON.stringify(req.body)
  );
  next();
});

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/event/checkin/:eventCode', function (req, res) {
  if (!requireJsonBody(res, req.body)) { return; }

  // Extract fields
  const firstName = req.body.firstName;
  if (!requireJsonField(res, firstName, 'firstName')) { return; };
  const lastName = req.body.lastName;
  if (!requireJsonField(res, lastName, 'lastName')) { return; };
  const email = req.body.email;
  if (!requireJsonField(res, email, 'email')) { return; };

  console.log(firstName);
  console.log(lastName);
  console.log(email);

  res.status(HTTPSTATUS.CREATED).end();
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}.`));
