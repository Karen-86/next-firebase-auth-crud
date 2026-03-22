import Joi from "joi";

export const createBlogSchema = Joi.object({
  status: Joi.string().allow("").required(),
  slug: Joi.string().allow("").min(3).required(),
  metaTitle: Joi.string().allow(""),
  metaDescription: Joi.string().allow(""),
  title: Joi.string().allow("").min(3),
  shortDescription: Joi.string().allow(""),
  description: Joi.string().allow(""),
  content: Joi.string().allow(""),
  editorState: Joi.string().allow(""),
  images: Joi.array().items(Joi.object()),
}).options({ abortEarly: false });

export const updateBlogSchema = Joi.object({
  status: Joi.string(),
  slug: Joi.string().min(3),
  metaTitle: Joi.string().allow(""),
  metaDescription: Joi.string().allow(""),
  title: Joi.string().allow("").min(3),
  shortDescription: Joi.string().allow(""),
  description: Joi.string().allow(""),
  content: Joi.string().allow(""),
  editorState: Joi.string().allow(""),
  images: Joi.array().items(Joi.object()),
})
  .min(1)
  .options({ abortEarly: false });
