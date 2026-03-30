import Joi, { ValidationResult } from "joi"

import type {
  SignInData,
  SignUpData,
  ResetPasswordData,
  UpdateEmailData,
  AddPasswordData,
  UpdatePasswordData,
} from "./types"

export const validateSignIn = (obj: SignInData): ValidationResult<SignInData> => {
  const signInSchema = Joi.object<SignInData>({
    email: Joi.string()
      .min(3)
      .email({ tlds: { allow: false } })
      .required(),
    password: Joi.string().min(5).required(),
  }).options({ abortEarly: false })
  return signInSchema.validate(obj)
}

export const validateSignUp = (obj: SignUpData): ValidationResult<SignUpData> => {
  const signUpSchema = Joi.object({
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
  }).options({ abortEarly: false })
  return signUpSchema.validate(obj)
}

export const validateResetPassword = (obj: ResetPasswordData) => {
  const resetPasswordSchema = Joi.object<ResetPasswordData>({
    email: Joi.string()
      .min(3)
      .email({ tlds: { allow: false } })
      .required(),
  }).options({ abortEarly: false })
  return resetPasswordSchema.validate(obj)
}

export const validateUpdateEmail = (obj: UpdateEmailData): ValidationResult<UpdateEmailData> => {
  const updateEmailSchema = Joi.object({
    email: Joi.string()
      .min(3)
      .email({ tlds: { allow: false } })
      .required(),
  }).options({ abortEarly: false })
  return updateEmailSchema.validate(obj)
}

export const validateAddPassword = (obj: AddPasswordData): ValidationResult<AddPasswordData> => {
  const addPasswordSchema = Joi.object({
    password: Joi.string().min(5).required(),
    repeatPassword: Joi.string().valid(Joi.ref("password")).required().messages({
      "string.empty": "Repeat password cannot be empty",
      "any.only": "Passwords must match",
    }),
  }).options({ abortEarly: false })
  return addPasswordSchema.validate(obj)
}

export const validateUpdatePassword = (
  obj: UpdatePasswordData
): ValidationResult<UpdatePasswordData> => {
  const addPasswordSchema = Joi.object({
    oldPassword: Joi.string().min(5).required().label("old password"),
    password: Joi.string().min(5).required(),
    repeatPassword: Joi.string().valid(Joi.ref("password")).required().messages({
      "string.empty": "Repeat password cannot be empty",
      "any.only": "Passwords must match",
    }),
  }).options({ abortEarly: false })
  return addPasswordSchema.validate(obj)
}

//   const validateContact = (obj) => {
//     const contactSchema = new Joi.object({
//         name:  Joi.string().min(3).required(),
//         email:  Joi.string().min(3).email({ tlds: { allow: false } }).required(),
//         message:  Joi.string().min(15).allow('').optional(),
//         // message:  Joi.string().min(15),
//     }).options({ abortEarly: false })
//     return contactSchema.validate(obj);
// };
