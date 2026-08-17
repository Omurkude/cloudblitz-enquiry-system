export const validate = (schema) => async (req, res, next) => {
  try {
    const parsed = await schema.parseAsync(req.body);
    req.body = parsed;
    next();
  } catch (error) {
    if (error.name === "ZodError" || error.issues) {
      const formattedErrors = (error.issues || []).map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: formattedErrors[0]?.message || "Validation failed",
        errors: formattedErrors,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid input data",
    });
  }
};

export default validate;
