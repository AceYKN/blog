export type ContentKind = 'notes' | 'essays' | 'tech' | 'projects'
export type SourceEntry = { id?: string; stem?: string; path?: string }
export function contentIdentity(sourceFile: string): {
  kind: ContentKind
  directory: string
  path: string
  stem: string
  url: string
}
export function sourceFileForEntry(entry: SourceEntry): string
export function publicContentUrl(entry: SourceEntry): string
export function tagUrl(tag: string): string
export function compareContentOrder(left: { path: string; order?: number }, right: { path: string; order?: number }): number
