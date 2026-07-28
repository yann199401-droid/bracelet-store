import prisma from '@/lib/prisma'

const DEFAULTS = {
  maintenance: 'false',
  maintenanceMessage: '网站正在更新中，请稍后再来访问。',
  lastPublishedAt: '',
}

export async function getSetting(key) {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key } })
    return setting?.value ?? DEFAULTS[key] ?? ''
  } catch {
    return DEFAULTS[key] ?? ''
  }
}

export async function setSetting(key, value) {
  try {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    })
    return true
  } catch (err) {
    console.error('Failed to set setting:', err.message)
    return false
  }
}

export async function getMaintenanceMode() {
  const enabled = await getSetting('maintenance')
  const message = await getSetting('maintenanceMessage')
  return { enabled: enabled === 'true', message }
}

export async function setMaintenanceMode(enabled, message) {
  await setSetting('maintenance', enabled ? 'true' : 'false')
  if (message) await setSetting('maintenanceMessage', message)
}

export async function getPublishStatus() {
  const maintenance = await getMaintenanceMode()
  const lastPublishedAt = await getSetting('lastPublishedAt')
  return { maintenance, lastPublishedAt }
}
