import createError from "@/lib/utils/createError";

const validate = ({ schema, body }) => {
  const { error, value } = schema.validate(body || {}, { abortEarly: false });

  // if (error) throw createError(error.details.map((d) => d.message).join(", "), 400);
  if (error) throw createError(error.details[0].message, 400);

  return value;
};

export default validate;
