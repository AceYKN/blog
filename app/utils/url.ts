export function withBasePath(baseURL: string, path: string) {
  const base = baseURL.endsWith('/') ? baseURL : `${baseURL}/`
  return `${base}${path.replace(/^\/+/, '')}`
}

export function absoluteSiteUrl(siteURL: string, path: string) {
  return `${siteURL.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}
