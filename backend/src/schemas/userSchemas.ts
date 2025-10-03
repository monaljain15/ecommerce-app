import Joi from 'joi';

// Update user profile schema
const updateProfileSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .optional()
        .messages({
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name must not exceed 100 characters'
        }),
    avatar: Joi.string()
        .uri()
        .optional()
        .messages({
            'string.uri': 'Avatar must be a valid URL'
        })
});

// Update user address schema
const updateAddressSchema = Joi.object({
    firstName: Joi.string()
        .min(1)
        .max(50)
        .required()
        .messages({
            'string.empty': 'First name is required',
            'string.min': 'First name must be at least 1 character long',
            'string.max': 'First name must not exceed 50 characters',
            'any.required': 'First name is required'
        }),
    lastName: Joi.string()
        .min(1)
        .max(50)
        .required()
        .messages({
            'string.empty': 'Last name is required',
            'string.min': 'Last name must be at least 1 character long',
            'string.max': 'Last name must not exceed 50 characters',
            'any.required': 'Last name is required'
        }),
    company: Joi.string()
        .max(100)
        .optional()
        .messages({
            'string.max': 'Company name must not exceed 100 characters'
        }),
    address1: Joi.string()
        .min(1)
        .max(255)
        .required()
        .messages({
            'string.empty': 'Address line 1 is required',
            'string.min': 'Address line 1 must be at least 1 character long',
            'string.max': 'Address line 1 must not exceed 255 characters',
            'any.required': 'Address line 1 is required'
        }),
    address2: Joi.string()
        .max(255)
        .optional()
        .messages({
            'string.max': 'Address line 2 must not exceed 255 characters'
        }),
    city: Joi.string()
        .min(1)
        .max(100)
        .required()
        .messages({
            'string.empty': 'City is required',
            'string.min': 'City must be at least 1 character long',
            'string.max': 'City must not exceed 100 characters',
            'any.required': 'City is required'
        }),
    state: Joi.string()
        .min(1)
        .max(100)
        .required()
        .messages({
            'string.empty': 'State is required',
            'string.min': 'State must be at least 1 character long',
            'string.max': 'State must not exceed 100 characters',
            'any.required': 'State is required'
        }),
    zipCode: Joi.string()
        .min(1)
        .max(20)
        .required()
        .messages({
            'string.empty': 'ZIP code is required',
            'string.min': 'ZIP code must be at least 1 character long',
            'string.max': 'ZIP code must not exceed 20 characters',
            'any.required': 'ZIP code is required'
        }),
    country: Joi.string()
        .min(1)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Country is required',
            'string.min': 'Country must be at least 1 character long',
            'string.max': 'Country must not exceed 100 characters',
            'any.required': 'Country is required'
        }),
    phone: Joi.string()
        .min(10)
        .max(20)
        .optional()
        .messages({
            'string.min': 'Phone number must be at least 10 characters long',
            'string.max': 'Phone number must not exceed 20 characters'
        }),
    isDefault: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'Is default must be a boolean'
        }),
    type: Joi.string()
        .valid('shipping', 'billing', 'both')
        .optional()
        .messages({
            'any.only': 'Type must be one of: shipping, billing, both'
        })
});

// User query schema
const userQuerySchema = Joi.object({
    page: Joi.number()
        .integer()
        .min(1)
        .optional()
        .messages({
            'number.base': 'Page must be a number',
            'number.integer': 'Page must be an integer',
            'number.min': 'Page must be 1 or greater'
        }),
    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .optional()
        .messages({
            'number.base': 'Limit must be a number',
            'number.integer': 'Limit must be an integer',
            'number.min': 'Limit must be 1 or greater',
            'number.max': 'Limit must not exceed 100'
        }),
    search: Joi.string()
        .max(255)
        .optional()
        .messages({
            'string.max': 'Search term must not exceed 255 characters'
        }),
    role: Joi.string()
        .valid('user', 'admin')
        .optional()
        .messages({
            'any.only': 'Role must be either user or admin'
        }),
    isActive: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'Is active must be a boolean'
        }),
    emailVerified: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'Email verified must be a boolean'
        }),
    sortBy: Joi.string()
        .valid('name', 'email', 'createdAt', 'lastLogin')
        .optional()
        .messages({
            'any.only': 'Sort by must be one of: name, email, createdAt, lastLogin'
        }),
    sortOrder: Joi.string()
        .valid('asc', 'desc')
        .optional()
        .messages({
            'any.only': 'Sort order must be either asc or desc'
        })
});

// User ID parameter schema
const userIdSchema = Joi.object({
    id: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.empty': 'User ID is required',
            'string.guid': 'User ID must be a valid UUID',
            'any.required': 'User ID is required'
        })
});

// Address ID parameter schema
const addressIdSchema = Joi.object({
    id: Joi.string()
        .uuid()
        .required()
        .messages({
            'string.empty': 'Address ID is required',
            'string.guid': 'Address ID must be a valid UUID',
            'any.required': 'Address ID is required'
        })
});

// Update user status schema (admin only)
const updateUserStatusSchema = Joi.object({
    isActive: Joi.boolean()
        .required()
        .messages({
            'boolean.base': 'Is active must be a boolean',
            'any.required': 'Is active is required'
        })
});

// Update user role schema (admin only)
const updateUserRoleSchema = Joi.object({
    role: Joi.string()
        .valid('user', 'admin')
        .required()
        .messages({
            'any.only': 'Role must be either user or admin',
            'any.required': 'Role is required'
        })
});

export {
    updateProfileSchema,
    updateAddressSchema,
    userQuerySchema,
    userIdSchema,
    addressIdSchema,
    updateUserStatusSchema,
    updateUserRoleSchema
};

// Re-export address schema from orderSchemas for user routes
export { addressSchema } from './orderSchemas';

// Re-export changePasswordSchema from authSchemas for user routes
export { changePasswordSchema } from './authSchemas';
