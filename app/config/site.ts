export const site = {
  name: 'blog',
  githubUsername: 'AceYKN',
  repository: {
    url: 'https://github.com/AceYKN/blog',
    branch: 'main'
  },
  weather: {
    label: '臺北',
    latitude: 25.033,
    longitude: 121.565
  },
  quickLinks: [
    { label: 'Google', href: 'https://www.google.com/' },
    { label: 'GitHub', href: 'https://github.com/AceYKN' },
    { label: 'Codeforces', href: 'https://codeforces.com/' }
  ]
} as const

export function repositoryEditUrl(path: string) {
  const encodedPath = path
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')
  return `${site.repository.url}/edit/${site.repository.branch}/${encodedPath}`
}
