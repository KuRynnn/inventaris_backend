const Joi = require('joi');

// Item Schema
const itemSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Name is required',
    'any.required': 'Name is required'
  }),
  quantity: Joi.number().integer().min(0).required().messages({
    'number.base': 'Quantity must be a number',
    'number.integer': 'Quantity must be an integer',
    'number.min': 'Quantity must be at least 0',
    'any.required': 'Quantity is required'
  }),
  type: Joi.string().valid('inventory', 'consumable').required().messages({
    'any.only': 'Type must be either inventory or consumable',
    'any.required': 'Type is required'
  }),
  location: Joi.string().required().messages({
    'string.empty': 'Location is required',
    'any.required': 'Location is required'
  })
});

// Movement Request Schema
const movementRequestSchema = Joi.object({
  itemId: Joi.number().integer().positive().required().messages({
    'number.base': 'Item ID must be a number',
    'number.integer': 'Item ID must be an integer',
    'number.positive': 'Item ID must be positive',
    'any.required': 'Item ID is required'
  }),
  fromLocation: Joi.string().required().messages({
    'string.empty': 'From location is required',
    'any.required': 'From location is required'
  }),
  toLocation: Joi.string().required().messages({
    'string.empty': 'To location is required',
    'any.required': 'To location is required'
  }),
  quantity: Joi.number().integer().positive().required().messages({
    'number.base': 'Quantity must be a number',
    'number.integer': 'Quantity must be an integer',
    'number.positive': 'Quantity must be positive',
    'any.required': 'Quantity is required'
  }),
  moveTime: Joi.date().iso().required().messages({
    'date.base': 'Move time must be a valid date',
    'date.format': 'Move time must be in ISO 8601 format',
    'any.required': 'Move time is required'
  })
});

// Pagination Schema
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'Page must be a number',
    'number.integer': 'Page must be an integer',
    'number.min': 'Page must be at least 1'
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    'number.base': 'Limit must be a number',
    'number.integer': 'Limit must be an integer',
    'number.min': 'Limit must be at least 1',
    'number.max': 'Limit cannot exceed 100'
  }),
  search: Joi.string().allow('').optional()
});

// General validation function for request body
const validate = (schema) => (req, res, next) => {
  const validationOptions = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true
  };

  const { error, value } = schema.validate(req.body, validationOptions);
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return res.status(400).json({ error: errorMessage });
  }

  req.validatedBody = value;
  return next();
};

// Validation function for query parameters
const validateQuery = (schema) => (req, res, next) => {
  const validationOptions = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true
  };

  const { error, value } = schema.validate(req.query, validationOptions);
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return res.status(400).json({ error: errorMessage });
  }

  req.validatedQuery = value;
  return next();
};

// Export validation middlewares
module.exports = {
  validateItem: validate(itemSchema),
  validateMovementRequest: validate(movementRequestSchema),
  validatePagination: validateQuery(paginationSchema)
};