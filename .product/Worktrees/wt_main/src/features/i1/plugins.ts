export interface PluginDescriptor {
  pluginId: string
  mainProcessExecution: boolean
  networkHosts: string[]
}

export interface PluginPolicy {
  allowMainProcessExecution: boolean
  allowedHosts: string[]
}

export const validatePluginAgainstPolicy = (
  plugin: PluginDescriptor,
  policy: PluginPolicy,
): { allowed: boolean; reason?: string } => {
  if (plugin.mainProcessExecution && !policy.allowMainProcessExecution) {
    return { allowed: false, reason: 'Main process execution is blocked by policy' }
  }
  const forbiddenHost = plugin.networkHosts.find(
    (host) => !policy.allowedHosts.includes(host),
  )
  if (forbiddenHost) {
    return { allowed: false, reason: `Network egress denied for host ${forbiddenHost}` }
  }
  return { allowed: true }
}
