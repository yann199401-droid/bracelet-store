import { getAuthUser } from './auth'

export function requireAdmin(request) {
  const auth = getAuthUser(request)
  if (!auth || auth.role !== 'ADMIN') {
    return null
  }
  return auth
}
