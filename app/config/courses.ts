// Course/section labels for content/source/**. Kept separate from app/utils/library.ts
// so that adding a new course only means editing this file, not the traversal logic.
//
// `directoryLabels` is a manual override map keyed by the last path segment of a
// directory (e.g. "algo", "os", "vue"). When a folder isn't listed here, library.ts
// falls back to the `title` frontmatter of that folder's own index.md before finally
// falling back to the raw folder name.

export const courseLabels: Record<string, string> = {
  'cs/os': '操作系統',
  'cs/db': '資料庫系統',
  'cs/algo': '演算法',
  'cs/se': '軟體工程',
  'cs/dm': '離散數學',
  'code/vue': 'Vue',
  code: '程式設計',
  math: '數學',
  language: '語言'
}

export const topLevelLabels: Record<string, string> = {
  cs: '計算機科學',
  code: '程式設計',
  language: '言語',
  math: '數學'
}

// Mirrors the navigational names already used by my-note's VitePress sidebar.
// Paths remain untouched; this only makes the reader-facing tree intelligible.
export const directoryLabels: Record<string, string> = {
  abstract_algebra: '抽象代數',
  math_analysis: '數學分析',
  ode: '常微分方程',
  os: '操作系統',
  algo: '算法設計與分析',
  db: '資料庫系統',
  dm: '離散數學',
  se: '軟體工程',
  vue: 'Vue.js 完整課程',
  deutsch: 'Deutsch',
  nihongo: '日本語',
  'german-for-reading': 'German for Reading',
  notes: 'ノート',
  note: 'ノート',
  notesbychap: '章節ノート',
  review: '復習',
  review202505: '復習 2025',
  testbank: '題庫',
  pastpapers: '過去問',
  HW: '宿題',
  tutorial: '考試導讀',
  '100+70': '100＋70 題庫'
}

export const courseAliases: Record<string, string[]> = {
  'cs/os': ['操作系統', '操作系统', 'operating system', 'operating systems', 'os'],
  'cs/db': ['資料庫系統', '数据库系统', '資料庫', '数据库', 'database', 'db'],
  'cs/algo': ['算法設計與分析', '算法设计与分析', '演算法', '算法', 'algorithm', 'algo'],
  'cs/se': ['軟體工程', '软件工程', 'software engineering', 'se'],
  'cs/dm': ['離散數學', '离散数学', 'discrete mathematics', 'dm'],
  'code/vue': ['vue', 'vue.js', 'vuejs'],
  math: ['數學', '数学', 'math'],
  language: ['言語', '語言', '语言', 'language']
}
