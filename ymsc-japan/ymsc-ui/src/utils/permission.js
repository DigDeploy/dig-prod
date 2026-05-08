import store from '@/store'

/**
 * 文字列権限検証
 * @param {Array} value 検証値
 * @returns {Boolean}
 */
export function checkPermi(value) {
  if (value && value instanceof Array && value.length > 0) {
    // ストアから取得した権限リスト
    const permissions = store.getters && store.getters.permissions
    // 検証対象の権限リスト
    const permissionDatas = value
    // 全量権限（すべての操作を許可する権限）
    const all_permission = "*:*:*";

    // 権限の有無を判定（全量権限を持つ、または検証対象権限のいずれかを持つ場合を許可）
    const hasPermission = permissions.some(permission => {
      return all_permission === permission || permissionDatas.includes(permission)
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`権限が必要です！例：checkPermi="['system:user:add','system:user:edit']"`)
    return false
  }
}

/**
 * ロール権限検証
 * @param {Array} value 検証値
 * @returns {Boolean}
 */
export function checkRole(value) {
  if (value && value instanceof Array && value.length > 0) {
    // ストアから取得したロールリスト
    const roles = store.getters && store.getters.roles
    // 検証対象のロールリスト
    const permissionRoles = value
    // スーパー管理者ロール（全権限を持つロール）
    const super_admin = "admin";

    // ロールの有無を判定（スーパー管理者ロールを持つ、または検証対象ロールのいずれかを持つ場合を許可）
    const hasRole = roles.some(role => {
      return super_admin === role || permissionRoles.includes(role)
    })

    if (!hasRole) {
      return false
    }
    return true
  } else {
    console.error(`ロールが必要です！例：checkRole="['admin','editor']"`)
    return false
  }
}