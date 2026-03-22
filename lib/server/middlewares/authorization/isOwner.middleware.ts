import createError from "@/lib/utils/createError";

const isOwner = ({ actingUser = "", targetUser = "" }: any) => {
  const isOwner = actingUser.uid === targetUser.uid;

  if (!isOwner) throw createError("You are not the owner", 403);

  return true;
};

export default isOwner;
