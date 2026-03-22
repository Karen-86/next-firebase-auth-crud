const hierarchy = {
  user: 1,
  moderator: 2,
  admin: 3,
  superAdmin: 4,
}

const getHighestRoleLevel = (roles = [], roleHierarchy = {}) => {
  return roles.reduce((max, role) => Math.max(max, roleHierarchy[role] || 0), 0)
}

const checkRoleHierarchy = ({
  user = "",
  foundUser = "",
  allowOwner = false,
  roleHierarchy = hierarchy,
  ignoreTargetUserNotFound = false,
}: any = {}) => {
  const actingUser = user
  const targetUser = foundUser

  if (!targetUser && ignoreTargetUserNotFound) {
    if (getHighestRoleLevel(actingUser.roles, roleHierarchy) > 1) return true
    return false
  }

  if (!actingUser || !targetUser) return false

  const actingLevel = getHighestRoleLevel(actingUser.roles, roleHierarchy)
  const targetLevel = getHighestRoleLevel(targetUser.roles, roleHierarchy)

  if (allowOwner && actingUser.uid.toString() === targetUser.uid.toString())
    return true

  if (actingLevel > targetLevel) return true

  return false
}

export default checkRoleHierarchy
