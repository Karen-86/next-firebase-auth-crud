import Joi from "joi";

export const createBannerSchema = Joi.object({
  base64URL: Joi.string()
}).options({ abortEarly: false });

export const updateBannerSchema = Joi.object({
  base64URL: Joi.string().allow("")

})
  .min(1)
  .options({ abortEarly: false });
