// responseHandler.js
const sendResponse = (res, message, statusCode = 200, data = null) => {
  const response = {
    status: statusCode >= 400 ? 'fail' : 'success',
  };

  if (message) {
    response.message = message;
  }

  if (data) {
    response.data = data;
  }

  res.status(statusCode).json(response);
};

module.exports = sendResponse;