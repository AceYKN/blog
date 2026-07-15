export type CourseKind = 'theory' | 'lab' | 'computer'

export interface WeekRule {
  start: number
  end: number
  parity?: 'odd' | 'even'
}

export interface Course {
  id: string
  title: string
  day: number
  startSection: number
  endSection: number
  campus: string
  room: string
  teacher: string
  kind: CourseKind
  weekRules: WeekRule[]
}

export const semester = {
  label: '2026–2027 學年度第 1 學期',
  start: '2026-08-31',
  end: '2027-01-15',
  totalWeeks: 20
} as const

export const sectionTimes = [
  { section: 1, start: '08:00', end: '08:50', period: '上午' },
  { section: 2, start: '09:00', end: '09:50', period: '上午' },
  { section: 3, start: '10:10', end: '11:00', period: '上午' },
  { section: 4, start: '11:10', end: '12:00', period: '上午' },
  { section: 5, start: '14:00', end: '14:50', period: '下午' },
  { section: 6, start: '15:00', end: '15:50', period: '下午' },
  { section: 7, start: '16:00', end: '16:50', period: '下午' },
  { section: 8, start: '17:00', end: '17:50', period: '下午' },
  { section: 9, start: '19:00', end: '19:50', period: '晚上' },
  { section: 10, start: '20:00', end: '20:50', period: '晚上' },
  { section: 11, start: '21:00', end: '21:50', period: '晚上' }
] as const

export const courses: Course[] = [
  {
    id: 'data-structures-lab',
    title: '數據結構實驗',
    day: 0,
    startSection: 1,
    endSection: 2,
    campus: '長安校區',
    room: '計算機技術實驗室 321',
    teacher: '劉曉寧',
    kind: 'lab',
    weekRules: [{ start: 1, end: 18 }]
  },
  {
    id: 'web-mining-tuesday-week9',
    title: 'Web 數據挖掘（雙語）',
    day: 1,
    startSection: 1,
    endSection: 2,
    campus: '長安校區',
    room: '1405',
    teacher: '楊建鋒',
    kind: 'theory',
    weekRules: [{ start: 9, end: 9 }]
  },
  {
    id: 'software-testing',
    title: '軟件測試（雙語）',
    day: 0,
    startSection: 3,
    endSection: 4,
    campus: '長安校區',
    room: '3406',
    teacher: '蘇临之',
    kind: 'theory',
    weekRules: [{ start: 1, end: 18 }]
  },
  {
    id: 'software-testing-computer',
    title: '軟件測試（雙語）',
    day: 0,
    startSection: 9,
    endSection: 10,
    campus: '長安校區',
    room: '計算機技術實驗室 321',
    teacher: '蘇临之',
    kind: 'computer',
    weekRules: [{ start: 3, end: 12 }]
  },
  {
    id: 'web-mining-tuesday',
    title: 'Web 數據挖掘（雙語）',
    day: 1,
    startSection: 1,
    endSection: 2,
    campus: '長安校區',
    room: '1405',
    teacher: '郝星星',
    kind: 'theory',
    weekRules: [
      { start: 1, end: 8 },
      { start: 10, end: 18 }
    ]
  },
  {
    id: 'computer-networks-early',
    title: '計算機網絡',
    day: 1,
    startSection: 3,
    endSection: 4,
    campus: '長安校區',
    room: '1310',
    teacher: '謝倩茹',
    kind: 'theory',
    weekRules: [{ start: 1, end: 9 }]
  },
  {
    id: 'computer-networks-late',
    title: '計算機網絡',
    day: 1,
    startSection: 3,
    endSection: 4,
    campus: '長安校區',
    room: '1310',
    teacher: '徐丹',
    kind: 'theory',
    weekRules: [{ start: 10, end: 18 }]
  },
  {
    id: 'computer-networks-lab',
    title: '計算機網絡實驗',
    day: 1,
    startSection: 5,
    endSection: 8,
    campus: '長安校區',
    room: '計算機技術實驗室 321',
    teacher: '徐丹、劉晨',
    kind: 'lab',
    weekRules: [{ start: 1, end: 9 }]
  },
  {
    id: 'computer-organization-lab',
    title: '計算機組成原理實驗',
    day: 1,
    startSection: 9,
    endSection: 11,
    campus: '長安校區',
    room: '微機原理實驗室 523',
    teacher: '邢雅璇',
    kind: 'lab',
    weekRules: [{ start: 10, end: 18 }]
  },
  {
    id: 'it-project-management-day',
    title: 'IT 項目管理（雙語）（含上機）',
    day: 2,
    startSection: 3,
    endSection: 4,
    campus: '長安校區',
    room: '1210',
    teacher: '張雨禾',
    kind: 'computer',
    weekRules: [{ start: 1, end: 18 }]
  },
  {
    id: 'artificial-intelligence-early',
    title: '人工智能（雙語）',
    day: 2,
    startSection: 5,
    endSection: 6,
    campus: '長安校區',
    room: '1310',
    teacher: '曹瑞',
    kind: 'lab',
    weekRules: [{ start: 1, end: 15 }]
  },
  {
    id: 'artificial-intelligence-tuesday-computer',
    title: '人工智能（雙語）',
    day: 1,
    startSection: 7,
    endSection: 8,
    campus: '長安校區',
    room: '計算機技術實驗室 321',
    teacher: '曹瑞',
    kind: 'lab',
    weekRules: [{ start: 10, end: 18 }]
  },
  {
    id: 'it-project-management-evening',
    title: 'IT 項目管理（雙語）（含上機）',
    day: 2,
    startSection: 7,
    endSection: 8,
    campus: '長安校區',
    room: '計算機技術實驗室 321',
    teacher: '張雨禾',
    kind: 'computer',
    weekRules: [{ start: 10, end: 18 }]
  },
  {
    id: 'xi-thought',
    title: '習近平新時代中國特色社會主義思想概論',
    day: 3,
    startSection: 1,
    endSection: 3,
    campus: '長安校區',
    room: '6505',
    teacher: '王妍晴',
    kind: 'theory',
    weekRules: [{ start: 1, end: 18 }]
  },
  {
    id: 'it-project-management-thursday',
    title: 'IT 項目管理（雙語）（含上機）',
    day: 3,
    startSection: 5,
    endSection: 6,
    campus: '長安校區',
    room: '1209',
    teacher: '張雨禾',
    kind: 'computer',
    weekRules: [{ start: 1, end: 17, parity: 'odd' }]
  },
  {
    id: 'machine-learning',
    title: '機器學習',
    day: 3,
    startSection: 5,
    endSection: 8,
    campus: '長安校區',
    room: '3307',
    teacher: '崔磊',
    kind: 'theory',
    weekRules: [{ start: 2, end: 18, parity: 'even' }]
  },
  {
    id: 'machine-learning-odd',
    title: '機器學習',
    day: 3,
    startSection: 7,
    endSection: 8,
    campus: '長安校區',
    room: '3307',
    teacher: '崔磊',
    kind: 'theory',
    weekRules: [{ start: 1, end: 17, parity: 'odd' }]
  },
  {
    id: 'computer-networks-friday-first',
    title: '計算機網絡',
    day: 4,
    startSection: 1,
    endSection: 2,
    campus: '長安校區',
    room: '1209',
    teacher: '謝倩茹',
    kind: 'theory',
    weekRules: [{ start: 1, end: 9, parity: 'odd' }]
  },
  {
    id: 'web-mining-friday',
    title: 'Web 數據挖掘（雙語）',
    day: 4,
    startSection: 1,
    endSection: 2,
    campus: '長安校區',
    room: '1209',
    teacher: '郝星星',
    kind: 'theory',
    weekRules: [{ start: 2, end: 18, parity: 'even' }]
  },
  {
    id: 'computer-networks-friday-late',
    title: '計算機網絡',
    day: 4,
    startSection: 1,
    endSection: 2,
    campus: '長安校區',
    room: '1209',
    teacher: '徐丹',
    kind: 'theory',
    weekRules: [{ start: 11, end: 17, parity: 'odd' }]
  },
  {
    id: 'design-patterns',
    title: '設計模式與 UML',
    day: 4,
    startSection: 3,
    endSection: 4,
    campus: '長安校區',
    room: '1106',
    teacher: '龔曉慶',
    kind: 'theory',
    weekRules: [{ start: 1, end: 18 }]
  },
  {
    id: 'artificial-intelligence-late',
    title: '人工智能（雙語）',
    day: 2,
    startSection: 5,
    endSection: 6,
    campus: '長安校區',
    room: '1310',
    teacher: '孫霞',
    kind: 'lab',
    weekRules: [{ start: 16, end: 18 }]
  }
]
