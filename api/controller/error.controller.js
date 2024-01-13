export default function globalErrorHandler(err, req, res, next) {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // TO DO
  // response should be handled with two function one for development and the other for production

  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
}
