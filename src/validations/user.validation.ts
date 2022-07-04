import Joi from "joi";

export const registerSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(64)
        .alphanum()
        .required(),

    email: Joi.string()
        .email()
        .min(5)
        .max(255)
        .required(),

    password: Joi.string()
        .min(8)
        .max(1024)
        .required()
});

export const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .min(5)
        .max(255)
        .required(),

    password: Joi.string()
        .min(8)
        .max(1024)
        .required()
});