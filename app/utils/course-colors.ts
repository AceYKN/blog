import type { Course } from '~/config/schedule'

export interface CourseColorPair {
  container: string
  onContainer: string
  accent: string
}

export interface CourseThemeColorVars {
  light: CourseColorPair
  dark: CourseColorPair
}

const LIGHT_PAPER = '#f5f1e6'
const DARK_PAPER = '#161914'

// Twelve evenly distributed hue families. The second tier revisits them at
// distinct LCh tones so courses stay separated across light and dark paper.
const SCHEDULE_HUES = [250, 70, 160, 340, 100, 280, 190, 10, 130, 310, 220, 40] as const

// Calm mineral/washi tones aligned with the site's warm paper palette.
const LIGHT_TONES: ReadonlyArray<readonly [number, number]> = [
  [90, 6],
  [89, 8],
  [91, 7],
  [88, 9],
  [92, 5],
  [87, 8],
  [90, 7],
  [88, 7],
  [91, 8],
  [89, 6],
  [87, 9],
  [90, 8],
  [88, 6],
  [91, 6],
  [89, 9],
  [92, 6],
  [87, 7],
  [90, 5],
  [88, 8],
  [91, 9],
  [89, 7],
  [87, 9],
  [92, 7],
  [90, 9]
]

const DARK_TONES: ReadonlyArray<readonly [number, number]> = [
  [23, 8],
  [20, 9],
  [24, 7],
  [21, 10],
  [22, 6],
  [19, 8],
  [25, 7],
  [21, 7],
  [23, 9],
  [20, 6],
  [24, 9],
  [22, 8],
  [19, 6],
  [25, 6],
  [21, 9],
  [23, 6],
  [20, 8],
  [24, 8],
  [22, 10],
  [19, 9],
  [25, 8],
  [21, 8],
  [23, 7],
  [20, 10]
]

interface RgbColor {
  r: number
  g: number
  b: number
}

export function courseNameKey(name: string): string {
  return name.replaceAll('\u00a0', ' ').replace(/\s+/g, ' ').trim().toLocaleLowerCase()
}

function stableHash(value: string): number {
  let hash = 0x811c9dc5
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return hash
}

function parseHexColor(hex: string): RgbColor {
  const clean = hex.replace('#', '')
  const value = Number.parseInt(clean, 16)
  return {
    r: (value >> 16) & 0xff,
    g: (value >> 8) & 0xff,
    b: value & 0xff
  }
}

function formatHexColor({ r, g, b }: RgbColor): string {
  const byte = (channel: number) =>
    Math.max(0, Math.min(255, Math.round(channel)))
      .toString(16)
      .padStart(2, '0')
  return `#${byte(r)}${byte(g)}${byte(b)}`
}

function lerpRgb(from: RgbColor, to: RgbColor, t: number): RgbColor {
  return {
    r: from.r + (to.r - from.r) * t,
    g: from.g + (to.g - from.g) * t,
    b: from.b + (to.b - from.b) * t
  }
}

function relativeLuminance({ r, g, b }: RgbColor): number {
  const linear = (channel: number) => {
    const srgb = channel / 255
    return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b)
}

export function contrastRatio(backgroundHex: string, foregroundHex: string): number {
  const background = relativeLuminance(parseHexColor(backgroundHex))
  const foreground = relativeLuminance(parseHexColor(foregroundHex))
  const lighter = Math.max(background, foreground)
  const darker = Math.min(background, foreground)
  return (lighter + 0.05) / (darker + 0.05)
}

function lchToRgb(lightness: number, chroma: number, hue: number): RgbColor {
  for (let candidateChroma = chroma; candidateChroma >= 0; candidateChroma -= 1) {
    const radians = (hue * Math.PI) / 180
    const a = candidateChroma * Math.cos(radians)
    const b = candidateChroma * Math.sin(radians)
    const fy = (lightness + 16) / 116
    const fx = fy + a / 500
    const fz = fy - b / 200
    const inverseLab = (value: number) => (value > 6 / 29 ? value * value * value : 3 * (6 / 29) ** 2 * (value - 4 / 29))
    const x = 0.95047 * inverseLab(fx)
    const y = inverseLab(fy)
    const z = 1.08883 * inverseLab(fz)
    const linear = [
      3.2404542 * x - 1.5371385 * y - 0.4985314 * z,
      -0.969266 * x + 1.8760108 * y + 0.041556 * z,
      0.0556434 * x - 0.2040259 * y + 1.0572252 * z
    ]
    if (linear.some((channel) => channel < 0 || channel > 1)) continue
    const toByte = (value: number) => {
      const srgb = value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055
      return Math.max(0, Math.min(255, Math.round(srgb * 255)))
    }
    return { r: toByte(linear[0]!), g: toByte(linear[1]!), b: toByte(linear[2]!) }
  }
  return { r: 128, g: 128, b: 128 }
}

function neutralScheduleForeground(backgroundHex: string, brightness: 'light' | 'dark'): string {
  const preferred = brightness === 'light' ? '#20251e' : '#ece9dd'
  if (contrastRatio(backgroundHex, preferred) >= 4.5) return preferred
  return contrastRatio(backgroundHex, '#000000') >= contrastRatio(backgroundHex, '#ffffff') ? '#000000' : '#ffffff'
}

export function schedulePaletteLength(): number {
  return LIGHT_TONES.length
}

export function schedulePaletteIndexForName(courseName: string): number {
  return stableHash(courseNameKey(courseName)) % SCHEDULE_HUES.length
}

/**
 * Assigns distinct palette indices across a semester's courses while sharing
 * one color for entries that represent the same course name.
 */
export function schedulePaletteForCourses(courses: readonly Pick<Course, 'id' | 'title'>[]): Map<string, number> {
  const identities = [...new Set(courses.map((course) => courseNameKey(course.title)))].sort()
  const slotsByIdentity = new Map<string, number>()
  const used = new Set<number>()

  for (const identity of identities) {
    const base = stableHash(identity) % SCHEDULE_HUES.length
    let index = -1
    for (let tier = 0; tier < 2 && index < 0; tier += 1) {
      for (let probe = 0; probe < SCHEDULE_HUES.length; probe += 1) {
        const candidate = tier * SCHEDULE_HUES.length + ((base + probe * 5) % SCHEDULE_HUES.length)
        if (!used.has(candidate)) {
          index = candidate
          break
        }
      }
    }
    if (index < 0) index = used.size
    slotsByIdentity.set(identity, index)
    used.add(index)
  }

  const assigned = new Map<string, number>()
  for (const course of courses) {
    assigned.set(course.id, slotsByIdentity.get(courseNameKey(course.title)) ?? 0)
  }
  return assigned
}

export function resolveScheduleColor(
  courseName: string,
  brightness: 'light' | 'dark',
  options: { paletteIndex?: number; surfaceHex?: string } = {}
): CourseColorPair {
  const index = options.paletteIndex ?? schedulePaletteIndexForName(courseName)
  const light = brightness === 'light'
  const tones = light ? LIGHT_TONES : DARK_TONES
  const paletteLength = schedulePaletteLength()
  const [lightness, chroma] =
    index < paletteLength ? tones[index]! : light ? [88 + (index % 4), 6 + (index % 3) * 2] : [20 + (index % 4) * 2, 6 + (index % 3) * 2]
  const hue = index < paletteLength ? SCHEDULE_HUES[index % SCHEDULE_HUES.length]! : ((index - paletteLength) * 137.507764) % 360

  const accentTone = lchToRgb(lightness, chroma, hue)
  const surface = parseHexColor(options.surfaceHex ?? (light ? LIGHT_PAPER : DARK_PAPER))
  const containerRgb = lerpRgb(surface, accentTone, 0.72)
  const container = formatHexColor(containerRgb)
  const onContainer = neutralScheduleForeground(container, brightness)
  const accentRgb = lchToRgb(light ? 44 : 70, Math.min(chroma + 8, 18), hue)
  const accent = formatHexColor(lerpRgb(surface, accentRgb, 0.85))

  return { container, onContainer, accent }
}

export function resolveCourseThemeColors(course: Pick<Course, 'id' | 'title'>, palette?: Map<string, number>): CourseThemeColorVars {
  const paletteIndex = palette?.get(course.id)
  return {
    light: resolveScheduleColor(course.title, 'light', { paletteIndex }),
    dark: resolveScheduleColor(course.title, 'dark', { paletteIndex })
  }
}

export function courseColorStyleVars(course: Pick<Course, 'id' | 'title'>, palette?: Map<string, number>): Record<string, string> {
  const colors = resolveCourseThemeColors(course, palette)
  return {
    '--course-bg-light': colors.light.container,
    '--course-fg-light': colors.light.onContainer,
    '--course-accent-light': colors.light.accent,
    '--course-bg-dark': colors.dark.container,
    '--course-fg-dark': colors.dark.onContainer,
    '--course-accent-dark': colors.dark.accent
  }
}
