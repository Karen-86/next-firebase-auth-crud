import Joi from "joi";

export const createPageSchema = Joi.object({
  status: Joi.string().allow("").required(),
  slug: Joi.string().allow("").min(3).required(),
  metadata: Joi.object({
    metaTitle: Joi.string().allow(""),
    metaDescription: Joi.string().allow(""),
  }),
}).options({ abortEarly: false });

export const updatePageSchema = Joi.object({
  status: Joi.string(),
  slug: Joi.string().min(3),
  metaDescription: Joi.string().allow(""),
  metadata: Joi.object({
    metaTitle: Joi.string().allow(""),
    metaDescription: Joi.string().allow(""),
  }),
})
  .min(1)
  .options({ abortEarly: false });
