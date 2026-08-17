// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  console.error("Global Error Handler:", err);

  // Handle MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(400).json({
      success: false,
      message: `Duplicate value entered for ${field}. Please use another value.`,
    });
  }

  // Handle validation error if passed from mongoose
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages[0] || "Validation Error",
      errors: messages,
    });
  }

  const statusCode = err.statusCode || res.statusCode || 500;
  return res.status(statusCode === 200 ? 500 : statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;
