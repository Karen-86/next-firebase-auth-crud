import Joi from "joi";

export const updateUserSchema = Joi.object({
  displayName: Joi.string().min(3).allow(''),
  bio: Joi.string().allow(""),
  base64PhotoURL: Joi.string().allow("")
})
  .min(1)
  .options({ abortEarly: false });

export const updateUserRolesSchema = Joi.object({
  roles: Joi.array().items(Joi.string().valid("user", "admin"))
})
  .min(1)
  .options({ abortEarly: false });
