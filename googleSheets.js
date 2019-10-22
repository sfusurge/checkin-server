// This Javascript module contains methods for using Google Sheets.
//
// Use this module as follows:
//
//     const {google} = require('googleapis');
//     const sheets = require('./googleSheets');
//
//     function checkIntoEvent() {
//       // auth (google.auth.OAuth2): The authenticated Google OAuth client
//       api(function(auth) {
//         const sheets = google.sheets({version: 'v4', auth});
//         sheets.spreadsheets.values.get({
//           spreadsheetId: '16baCd9Qd9Q1kJSUGqGzhCuoMFKRxNwO6EJ2lertzDJo',
//           range: 'Class Data!A2:E',
//         }, (err, res) => {
//           if (err) return console.log('The API returned an error: ' + err);
//           // Access/modify data
//         });
//       });
//     }
//
//     sheets.api(checkIntoEvent);

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// The file credentials.json stores the downloaded API credentials from
// Google Cloud Platform.
const CREDENTIALS_FILE = 'credentials.json';

// Upon modification, delete the file token.json
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// LOCAL FUNCTIONS

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      return getNewToken(oAuth2Client, callback);
    }

    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

// EXPORTS

// This function accesses the API, given any template function.
// The provided function must take in one parameter (auth) and complete
// all the required steps for a single operation.
exports.api = function(func) {
  fs.readFile(CREDENTIALS_FILE, (err, content) => {
    if (err) {
      return console.log('Error loading client secret file:', err);
    }

    authorize(JSON.parse(content), func);
  });
}

/**
 * This example function prints the names and majors of students in a
 * sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
exports.listMajorsExample = function() {
  // auth (google.auth.OAuth2): The authenticated Google OAuth client
  exports.api(function(auth) {
    const sheets = google.sheets({version: 'v4', auth});
    sheets.spreadsheets.values.get({
      spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
      range: 'Class Data!A2:E',
    }, (err, res) => {
      if (err) {
        return console.log('The API returned an error: ' + err);
      }
  
      const rows = res.data.values;
      if (rows.length) {
        console.log('Name, Major:');
        // Print columns A and E, which correspond to indices 0 and 4.
        rows.map((row) => {
          console.log(`${row[0]}, ${row[4]}`);
        });
      }
      else {
        console.log('No data found.');
      }
    });
  });
}