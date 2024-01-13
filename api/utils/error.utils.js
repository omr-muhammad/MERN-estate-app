export default function CreateError(message, statusCode) {
  const error = new Error(message);

  // Customizing the error obj
  error.statusCode = statusCode;
  error.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
  error.isOperational = true;

  Error.captureStackTrace(error, CreateError);

  return error;
}
