# API Specification

This is the API specification for the Node.js and Express web backend server for SFU Surge event check-in.

## Sign into an Event

This request adds an attendee's check-in to a Google Sheets, given a valid event code.

The email will be changed to be all lowercase.

### Request

#### Method and URL

```
POST /event/checkin/{eventCode}
```

#### Headers

Key | Value
--- | ---
`Content-Type` | `application/json`


#### JSON Body

```json
{
  "firstName": string,
  "lastName": string,
  "email": string
}
```

### Response

#### Status Code

Status | Meaning
 --- | ---
201 Created | Check-in successful.
400 Bad Request | A field in the request body was missing or invalid.
409 Conflict | Email already checked in.
500 Internal Server Error | The server made an error and was unable to recover.

#### JSON Body

```json
{}
```
