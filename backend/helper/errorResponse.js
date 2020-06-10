const sendErrorResponse = (msg, res, statusCode) => {
  switch (statusCode) {
    case 400:
      res.status(statusCode).json(msg);
      break;

    case 401:
      res.status(statusCode).json(msg);

      break;
  }
};

module.exports = sendErrorResponse;
