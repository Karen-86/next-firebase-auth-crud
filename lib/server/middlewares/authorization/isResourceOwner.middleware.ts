import createError from "@/lib/utils/createError";

const isResourceOwner = ({ actingUser = {}, resource = {} }: any) => {
  const isResourceOwner = actingUser.uid === resource.userId;

  if (!isResourceOwner) throw createError(`You are not the owner of this document`, 403);

  return true;
};

export default isResourceOwner;
