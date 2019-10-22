# checkin-server

Node.js and Express web backend server to receive and process event check-ins.

## Usage

### Google Sheets

Follow [these instructions](https://developers.google.com/sheets/api/quickstart/nodejs) to create a new Google Cloud Platform project and enable the Google Sheets API.

Download the Client JSON file and rename it to `credentials.json`. Place it in this directory (it will be ignored by Git).

### Server

Start the server with one of the following commands:

```shell
npm start
```

```
node app.js
```

Google will guide you through a process to authenticate the server. This will only occur the first time.

## Sending a Request

The official API specification is located [here](https://github.com/sfusurge/checkin-server/blob/master/api-specification.md).

To send a request using a shell script, see the sample scripts [here](https://github.com/sfusurge/checkin-server/blob/master/scripts-api/checkin).
