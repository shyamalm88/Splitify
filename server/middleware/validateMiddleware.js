const { ApiError } = require("../utils/errorHandler");

/**
 * Middleware for validating request data using Joi schemas
 * @param {Object} schema - Joi schema to validate against
 * @param {string} source - Request property to validate ('body', 'query', 'params')
 * @returns {Function} Express middleware function
 */
const validate = (schema, source = "body") => {
  return (req, res, next) => {
    if (!schema) {
      return next();
    }

    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: source === "body", // Allow unknown fields in body, but not in query/params
    });

    if (error) {
      const errorDetails = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return next(ApiError.badRequest("Validation error", errorDetails));
    }

    // Replace request data with validated data
    req[source] = value;
    next();
  };
};

module.exports = validate;
