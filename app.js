'use strict';

// Libraries
const express = require('express');
const bodyParser = require('body-parser');
const {google} = require('googleapis');

// Custom modules
const httpH = require('./httpHelpers');
const sheets = require('./googleSheets');

// Configuration
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.use(function (req, res, next) {
  console.log('Received request: ' + httpH.stringifyReq(req));
  next();
});

app.get('/', (req, res) => res.send('Hello World!'));

function getDateTime() {
  const date = new Date();

  let year = date.getFullYear();

  let month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;

  let day  = date.getDate();
  day = (day < 10 ? "0" : "") + day;

  let hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  let ampm = hour >= 12 ? 'PM' : 'am';

  let min  = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  let sec  = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;

  return year + "-" + month + "-" + day + " " + hour + ":" + min + ampm;
}

function createInputRequestObject(eventCode, firstName, lastName, email) {
  return {
    requests: [
      {
        appendCells: {
          fields: "*",
          rows: [
            {
              values: [
                {
                  userEnteredValue: {
                    stringValue: getDateTime()
                  }
                },
                {
                  userEnteredValue: {
                    stringValue: eventCode
                  }
                },
                {
                  userEnteredValue: {
                    stringValue: firstName
                  }
                },
                {
                  userEnteredValue: {
                    stringValue: lastName
                  }
                },
                {
                  userEnteredValue: {
                    stringValue: email
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  }
}

/**
 * Google Sheets function to add an event check-in.
 * Must be fed into the Google Sheets API.
 * @see https://docs.google.com/spreadsheets/d/16baCd9Qd9Q1kJSUGqGzhCuoMFKRxNwO6EJ2lertzDJo/edit
 */
function checkIntoEvent(eventCode, firstName, lastName, email) {
  // auth (google.auth.OAuth2): The authenticated Google OAuth client
  sheets.api(function(auth) {
    const sheets = google.sheets({version: 'v4', auth});

    sheets.spreadsheets.batchUpdate({
      spreadsheetId: '16baCd9Qd9Q1kJSUGqGzhCuoMFKRxNwO6EJ2lertzDJo',
      resource: createInputRequestObject(eventCode, firstName, lastName, email)
    }, (err, response) => {
      if (err) {
        console.error('Error: ' + err.message);
      } else {
        console.log('Google Sheets update response: ' + response.statusText);
      }
    });

  });
}

app.post('/event/checkin/:eventCode', function (req, res) {
  if (!httpH.requireJsonBody(res, req.body)) { return; }

  // TODO: Verify event code

  // Extract fields
  const firstName = req.body.firstName;
  if (!httpH.requireJsonField(res, firstName, 'firstName')) { return; };
  const lastName = req.body.lastName;
  if (!httpH.requireJsonField(res, lastName, 'lastName')) { return; };
  const email = req.body.email;
  if (!httpH.requireJsonField(res, email, 'email')) { return; };

  checkIntoEvent(req.params.eventCode, firstName, lastName, email);

  res.status(httpH.HTTPSTATUS.CREATED).end();
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}.`));
