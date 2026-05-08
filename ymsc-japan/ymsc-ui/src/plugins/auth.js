import store from '@/store'

function authPermission(permission) {
  const all_permission = "*:*:*";
  const permissions = store.getters && store.getters.permissions
  if (permission && permission.length > 0) {
    return permissions.some(v => {
      return all_permission === v || v === permission
    })
  } else {
    return false
  }
}

function authRole(role) {
  const super_admin = "admin";
  const roles = store.getters && store.getters.roles
  if (role && role.length > 0) {
    return roles.some(v => {
      return super_admin === v || v === role
    })
  } else {
    return false
  }
}

export default {
  // ユーザーが特定の権限を持っているかどうかを検証
  hasPermi(permission) {
    return authPermission(permission);
  },
  // ユーザーが指定された権限を保有しているかどうかを検証（いずれか1つを含めば可）
  hasPermiOr(permissions) {
    return permissions.some(item => {
      return authPermission(item)
    })
  },
  // ユーザーが指定された権限を保有しているかどうかを検証（全てを保有する必要がある）
  hasPermiAnd(permissions) {
    return permissions.every(item => {
      return authPermission(item)
    })
  },
  // ユーザーが特定のロールを持っているかどうかを検証
  hasRole(role) {
    return authRole(role);
  },
  // ユーザーが指定されたロールを保有しているかどうかを検証（いずれか1つを含めば可）
  hasRoleOr(roles) {
    return roles.some(item => {
      return authRole(item)
    })
  },
  // ユーザーが指定されたロールを保有しているかどうかを検証（全てを保有する必要がある）
  hasRoleAnd(roles) {
    return roles.every(item => {
      return authRole(item)
    })
  }
}