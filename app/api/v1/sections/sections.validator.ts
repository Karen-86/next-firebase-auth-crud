import Joi from "joi";

export const createSectionSchema = Joi.object({
  status: Joi.string().allow("").required(),
  sectionName: Joi.string().allow("").min(3),
  title: Joi.string().allow("").min(3),
  description: Joi.string().allow("").min(3),
  images: Joi.array().items(Joi.object()),
}).options({ abortEarly: false });

export const updateSectionSchema = Joi.object({
  status: Joi.string(),
  sectionName: Joi.string().allow("").min(3),
  metaDescription: Joi.string().allow(""),
  title: Joi.string().allow("").min(3),
  description: Joi.string().allow("").min(3),
  images: Joi.array().items(Joi.object()),
})
  .min(1)
  .options({ abortEarly: false });
