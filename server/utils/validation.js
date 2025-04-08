const Joi = require("joi");
const mongoose = require("mongoose");
const { ApiError } = require("./errorHandler");

// Custom Joi extension for MongoDB ObjectId validation
const objectIdExtension = {
  type: "objectId",
  base: Joi.string(),
  messages: {
    "objectId.invalid": "{{#label}} must be a valid ObjectId",
  },
  validate(value, helpers) {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return { value, errors: helpers.error("objectId.invalid") };
    }
    return { value };
  },
};

// Create extended Joi with ObjectId support
const JoiExtended = Joi.extend(objectIdExtension);

/**
 * Validation schema for category operations
 */
const categorySchemas = {
  // Create category validation
  create: JoiExtended.object({
    name: Joi.string().trim().min(2).max(50).required().messages({
      "string.base": "Name must be a text",
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name cannot exceed 50 characters",
      "any.required": "Name is required",
    }),
    icon: Joi.string().trim().allow("").default("more-horiz").messages({
      "string.base": "Icon must be a text",
    }),
  }),

  // Update category validation
  update: JoiExtended.object({
    name: Joi.string().trim().min(2).max(50).messages({
      "string.base": "Name must be a text",
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name cannot exceed 50 characters",
    }),
    icon: Joi.string().trim().allow("").messages({
      "string.base": "Icon must be a text",
    }),
  }),

  // Category ID param validation
  id: JoiExtended.object({
    id: JoiExtended.objectId().required().messages({
      "any.required": "Category ID is required",
      "objectId.invalid": "Category ID must be a valid ObjectId",
    }),
  }),
};

/**
 * Validation schema for group operations
 */
const groupSchemas = {
  // Create group validation
  create: JoiExtended.object({
    name: Joi.string().trim().min(3).max(100).required().messages({
      "string.base": "Name must be a text",
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters",
      "string.max": "Name cannot exceed 100 characters",
      "any.required": "Name is required",
    }),
    description: Joi.string().trim().allow("").max(500).messages({
      "string.base": "Description must be a text",
      "string.max": "Description cannot exceed 500 characters",
    }),
    currency: Joi.string().trim().length(3).default("INR").messages({
      "string.base": "Currency must be a text",
      "string.length": "Currency must be a 3-letter code (e.g., USD, EUR, INR)",
    }),
    categories: Joi.array().items(Joi.string()).messages({
      "array.base": "Categories must be an array",
    }),
    participants: Joi.array()
      .items(
        Joi.alternatives().try(
          JoiExtended.objectId(),
          Joi.object({
            user: JoiExtended.objectId().required(),
          })
        )
      )
      .messages({
        "array.base": "Participants must be an array",
        "objectId.invalid": "Participant ID must be a valid ObjectId",
      }),
    groupImage: Joi.string().allow("").optional().messages({
      "string.base": "Group image must be a base64-encoded string",
    }),
  }),

  // Update group validation
  update: JoiExtended.object({
    name: Joi.string().trim().min(3).max(100).messages({
      "string.base": "Name must be a text",
      "string.min": "Name must be at least 3 characters",
      "string.max": "Name cannot exceed 100 characters",
    }),
    description: Joi.string().trim().allow("").max(500).messages({
      "string.base": "Description must be a text",
      "string.max": "Description cannot exceed 500 characters",
    }),
    currency: Joi.string().trim().length(3).messages({
      "string.base": "Currency must be a text",
      "string.length": "Currency must be a 3-letter code (e.g., USD, EUR, INR)",
    }),
    groupImage: Joi.string().allow("").optional().messages({
      "string.base": "Group image must be a base64-encoded string",
    }),
  }),
};

/**
 * Validation schema for expense operations
 */
const expenseSchemas = {
  // Create expense validation
  createExpense: JoiExtended.object({
    title: Joi.string().trim().min(2).max(100).required().messages({
      "string.base": "Title must be a text",
      "string.empty": "Title is required",
      "string.min": "Title must be at least 2 characters",
      "string.max": "Title cannot exceed 100 characters",
      "any.required": "Title is required",
    }),
    amount: Joi.number().positive().required().messages({
      "number.base": "Amount must be a number",
      "number.positive": "Amount must be a positive number",
      "any.required": "Amount is required",
    }),
    category: Joi.string().trim().allow("").default("Uncategorized").messages({
      "string.base": "Category must be a text",
    }),
    notes: Joi.string().trim().allow("").max(500).messages({
      "string.base": "Notes must be a text",
      "string.max": "Notes cannot exceed 500 characters",
    }),
    paidBy: JoiExtended.objectId().required().messages({
      "any.required": "Paid by user ID is required",
      "objectId.invalid": "Paid by user ID must be a valid ObjectId",
    }),
    groupId: JoiExtended.objectId().required().messages({
      "any.required": "Group ID is required",
      "objectId.invalid": "Group ID must be a valid ObjectId",
    }),
    splitMethod: Joi.string()
      .valid("Equally", "Percentage", "Custom")
      .default("Equally")
      .messages({
        "string.base": "Split method must be a text",
        "any.only": "Split method must be one of: Equally, Percentage, Custom",
      }),
    receipt: Joi.string().allow("").optional().messages({
      "string.base": "Receipt must be a base64-encoded string",
    }),
  }),

  // Update expense validation
  updateExpense: JoiExtended.object({
    title: Joi.string().trim().min(2).max(100).messages({
      "string.base": "Title must be a text",
      "string.min": "Title must be at least 2 characters",
      "string.max": "Title cannot exceed 100 characters",
    }),
    amount: Joi.number().positive().messages({
      "number.base": "Amount must be a number",
      "number.positive": "Amount must be a positive number",
    }),
    category: Joi.string().trim().allow("").messages({
      "string.base": "Category must be a text",
    }),
    notes: Joi.string().trim().allow("").max(500).messages({
      "string.base": "Notes must be a text",
      "string.max": "Notes cannot exceed 500 characters",
    }),
    splitMethod: Joi.string()
      .valid("Equally", "Percentage", "Custom")
      .messages({
        "string.base": "Split method must be a text",
        "any.only": "Split method must be one of: Equally, Percentage, Custom",
      }),
    receipt: Joi.string().allow("").optional().messages({
      "string.base": "Receipt must be a base64-encoded string",
    }),
  }),
};

/**
 * Middleware factory for validating request data
 *
 * @param {Object} schema - Joi validation schema
 * @param {string} source - Request property to validate ('body', 'query', 'params')
 * @returns {Function} Express middleware function
 */
const validateRequest = (schema, source = "body") => {
  return (req, res, next) => {
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

module.exports = {
  validateRequest,
  categorySchemas,
  groupSchemas,
  expenseSchemas,
  JoiExtended,
};
