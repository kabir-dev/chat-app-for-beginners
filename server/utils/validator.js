const Joi = require("joi");

const signupValidator = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .lowercase()
    .required(),
  password: Joi.string().min(6).max(16).required(),
});

const loginValidator = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).max(16).required(),
});

const bearerTokenValidator = Joi.object({
  refresh_token: Joi.string().required(),
});

const conversationValidator = Joi.object({
  creator: Joi.string().hex().length(24).required(),
  participant: Joi.string().hex().length(24).required(),
});
const messageValidator = Joi.object({
  text: Joi.string().required(),
  creator: Joi.string().hex().length(24).required(),
  participant: Joi.string().hex().length(24).required(),
  conversation_id: Joi.string().hex().length(24).required(),
});

const objectIdValidator = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
const searchQueryValidator = Joi.object({
  search: Joi.string().required(),
});

const updateUserValidator = Joi.object({
  name: Joi.string().min(2).max(30).required(),
});

module.exports = {
  signupValidator,
  loginValidator,
  bearerTokenValidator,
  conversationValidator,
  messageValidator,
  objectIdValidator,
  searchQueryValidator,
  updateUserValidator,
};
