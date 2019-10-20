// This Javascript module contains helper methods for handling HTTP validation
// and return statuses.
//
// Use this module as follows:
//     const httpH = require('./httpHelpers');
//     httph.requireJsonBody(res, firstName);

exports.HTTPSTATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

function isEmptyOrNull(obj) {
  return !obj || Object.keys(obj).length === 0;
}

function setHttpError(res, status, msg) {
  res.status(status).send({
    'status': status,
    'message': msg
  });
}

// Sets the HTTP error before exiting if the body is not present.
// Returns whether the body was present.
exports.requireJsonBody = function(res, field) {
  if (isEmptyOrNull(field)) {
    setHttpError(res, HTTPSTATUS.BAD_REQUEST,
      'A JSON request body and header is required.');
    return false;
  }
  return true;
}

// Sets the HTTP error before exiting if the field is not present.
// Returns whether the field was present.
exports.requireJsonField = function(res, field, fieldName) {
  if (!field) {
    setHttpError(res, HTTPSTATUS.BAD_REQUEST,
      'Field ' + fieldName + ' is required');
    return false;
  }
  return true;
}
