import React from "react";
import Joi from "joi";

export default function useValidation() {
  const validateSignIn = (obj) => {
    const signInSchema = new Joi.object({
      email: Joi.string()
        .min(3)
        .email({ tlds: { allow: false } })
        .required(),
      password: Joi.string().min(5).required(),
    }).options({ abortEarly: false });
    return signInSchema.validate(obj);
  };

  const validateSignUp = (obj) => {
    const signUpSchema = new Joi.object({
      // name:  Joi.string().min(3).required(),
      name: Joi.string().min(3).required(),
      email: Joi.string()
        .min(3)
        .email({ tlds: { allow: false } })
        .required(),
      password: Joi.string().min(5).required(),
      // repeatPassword: Joi.string().valid(Joi.ref('password')).required().messages({
      //     'any.only': 'Passwords must match'
      // })
      repeatPassword: Joi.string().valid(Joi.ref("password")).required().messages({
        "string.empty": "Repeat password cannot be empty",
        "any.only": "Passwords must match",
      }),

  
      // message:  Joi.string().min(15).allow('').optional(),
    }).options({ abortEarly: false });
    return signUpSchema.validate(obj);
  };

  const validateResetPassword = (obj) => {
    const resetPasswordSchema = new Joi.object({
      email: Joi.string()
        .min(3)
        .email({ tlds: { allow: false } })
        .required(),
    }).options({ abortEarly: false });
    return resetPasswordSchema.validate(obj);
  };
  
  const validateUpdateEmail = (obj) => {
    const updateEmailSchema = new Joi.object({
      email: Joi.string()
        .min(3)
        .email({ tlds: { allow: false } })
        .required(),
    }).options({ abortEarly: false });
    return updateEmailSchema.validate(obj);
  };

  const validateAddPassword = (obj) => {
    const addPasswordSchema = new Joi.object({
      password: Joi.string().min(5).required(),
      repeatPassword: Joi.string().valid(Joi.ref("password")).required().messages({
        "string.empty": "Repeat password cannot be empty",
        "any.only": "Passwords must match",
      }),
    }).options({ abortEarly: false });
    return addPasswordSchema.validate(obj);
  };
  const validateUpdatePassword = (obj) => {
    const addPasswordSchema = new Joi.object({
      oldPassword: Joi.string().min(5).required().label('old password'),
      password: Joi.string().min(5).required(),
      repeatPassword: Joi.string().valid(Joi.ref("password")).required().messages({
        "string.empty": "Repeat password cannot be empty",
        "any.only": "Passwords must match",
      }),
    }).options({ abortEarly: false });
    return addPasswordSchema.validate(obj);
  };

  const validateContact = (obj) => {
    const contactSchema = new Joi.object({
        name:  Joi.string().min(3).required(),
        email:  Joi.string().min(3).email({ tlds: { allow: false } }).required(),
        message:  Joi.string().min(15).allow('').optional(),
        // message:  Joi.string().min(15),
    }).options({ abortEarly: false })
    return contactSchema.validate(obj);
};

  return { validateSignIn, validateSignUp, validateResetPassword, validateContact, validateAddPassword,validateUpdatePassword, validateUpdateEmail };
}
