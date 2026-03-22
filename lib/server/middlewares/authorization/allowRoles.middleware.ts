// RBAC
import createError from "@/lib/utils/createError";

type Props = {
  userRoles: string[];
  allowedRoles: string[];
};

const allowRoles = ({ userRoles = [], allowedRoles = [] }: Props) => {
  const hasRole = userRoles.some((role) => allowedRoles.includes(role));

  if (!hasRole) throw createError("Forbidden: no allowed role", 403);

  return true;
};

export default allowRoles;
