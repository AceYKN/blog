<script setup lang="ts">
import { sectionTimes, semester, type Course, type CourseKind } from '~/config/schedule'
import {
  formatScheduleDuration,
  formatWeekRules,
  getAdjacentMonth,
  getCourseTemporalStates,
  getCourseTimeRange,
  getCoursesForDate,
  getCurrentTimeMarker,
  getDateLabel,
  getDayStatus,
  getGridRow,
  getMonthGrid,
  getMonthKey,
  getMonthName,
  getTeachingWeek,
  getTaipeiClock,
  getTodayScheduleState,
  getWeekDates,
  getWeekRangeLabel,
  weekdayNames,
  type CourseTemporalState,
  type TodayScheduleState
} from '~/utils/schedule'

type View = 'today' | 'week' | 'month'

const SCHEDULE_VIEW_KEY = 'schedule:view'
const route = useRoute()
const router = useRouter()

const now = ref<Date | null>(null)
const storedView = ref<View | null>(null)
const isMounted = ref(false)
let clockTimer: number | undefined

const courseKindLabels: Record<CourseKind, string> = { theory: '理論', lab: '實驗', computer: '上機' }
const courseTones: Record<string, string> = {
  數據結構實驗: 'data-structures',
  'Web 數據挖掘（雙語）': 'web-mining',
  '軟件測試（雙語）': 'software-testing',
  計算機網絡: 'computer-networks',
  計算機網絡實驗: 'computer-networks-lab',
  計算機組成原理實驗: 'computer-organization',
  'IT 項目管理（雙語）（含上機）': 'it-project-management',
  '人工智能（雙語）': 'artificial-intelligence',
  習近平新時代中國特色社會主義思想概論: 'xi-thought',
  機器學習: 'machine-learning',
  '設計模式與 UML': 'design-patterns',
  '大學語文★': 'college-chinese'
}
const originalCourseText: Record<string, string> = {
  數據結構實驗: '数据结构实验',
  'Web 數據挖掘（雙語）': 'Web 数据挖掘（双语）',
  '軟件測試（雙語）': '软件测试（双语）',
  計算機網絡: '计算机网络',
  計算機網絡實驗: '计算机网络实验',
  計算機組成原理實驗: '计算机组成原理实验',
  'IT 項目管理（雙語）（含上機）': 'IT项目管理（双语）（含上机）',
  '人工智能（雙語）': '人工智能（双语）',
  習近平新時代中國特色社會主義思想概論: '习近平新时代中国特色社会主义思想概论',
  機器學習: '机器学习',
  '設計模式與 UML': '设计模式与UML',
  '大學語文★': '大学语文★',
  '大學語文-0013': '大学语文-0013',
  考試: '考试',
  長安校區: '长安校区',
  '計算機技術實驗室 321': '计算机技术实验室-321',
  '微機原理實驗室 523': '微机原理实验室-523',
  劉曉寧: '刘晓宁',
  楊建鋒: '杨建锋',
  蘇峙之: '苏峙之',
  謝倩茹: '谢倩茹',
  '徐丹、劉晨': '徐丹、刘晨',
  張雨禾: '张雨禾',
  龔曉慶: '龚晓庆',
  孫霞: '孙霞'
}

function getQueryValue(key: string) {
  const value = route.query[key]
  if (Array.isArray(value)) return value[0] || undefined
  return value || undefined
}

function parseView(value: string | undefined): View | null {
  return value === 'today' || value === 'week' || value === 'month' ? value : null
}

function parseWeek(value: string | undefined) {
  if (!value || !/^\d+$/.test(value)) return null
  const week = Number(value)
  return Number.isSafeInteger(week) && week >= 1 && week <= semester.totalWeeks ? week : null
}

function isValidMonth(value: string | undefined): value is string {
  if (!value || !/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) return false
  return value >= semester.start.slice(0, 7) && value <= semester.end.slice(0, 7)
}

function getValidMonthQuery() {
  const value = getQueryValue('month')
  return isValidMonth(value) ? value : null
}

function getTaipeiDateKey(date: Date = new Date()) {
  return getTaipeiClock(date).date
}

const requestedView = computed(() => parseView(getQueryValue('view')))
const currentClock = computed(() => (now.value ? getTaipeiClock(now.value) : null))
const todayKey = computed(() => (now.value ? getTaipeiDateKey(now.value) : ''))
const currentTeachingWeek = computed(() => (todayKey.value ? getTeachingWeek(todayKey.value) : null) || 1)
const isTodayInSemester = computed(() => Boolean(todayKey.value && getTeachingWeek(todayKey.value)))
const defaultMonth = computed(() => (isTodayInSemester.value ? getMonthKey(todayKey.value) : semester.start.slice(0, 7)))
const view = computed<View>(() => requestedView.value || storedView.value || 'week')
const selectedWeek = computed(() => {
  if (view.value === 'today') return currentTeachingWeek.value
  return parseWeek(getQueryValue('week')) || currentTeachingWeek.value
})
const selectedMonth = computed(() => {
  if (view.value === 'today') return isTodayInSemester.value ? getMonthKey(todayKey.value) : defaultMonth.value
  if (view.value === 'month') return getValidMonthQuery() || defaultMonth.value
  return getMonthKey(getWeekDates(selectedWeek.value)[0]!)
})
const monthGrid = computed(() => getMonthGrid(selectedMonth.value))
const weekDates = computed(() => getWeekDates(selectedWeek.value))
const weekRange = computed(() => getWeekRangeLabel(selectedWeek.value))
const monthName = computed(() => getMonthName(selectedMonth.value))
const todayWeekday = computed(() => weekDates.value.findIndex((date) => date === todayKey.value))

const isRealtimeView = computed(() => {
  if (!currentClock.value || !isTodayInSemester.value) return false
  return view.value === 'today' || (view.value === 'week' && selectedWeek.value === currentTeachingWeek.value)
})
const todayCourses = computed(() => (todayKey.value ? getCoursesForDate(todayKey.value) : []))
const todayTemporalStates = computed(() => {
  if (!isRealtimeView.value || !currentClock.value) return []
  return getCourseTemporalStates(todayCourses.value, currentClock.value.minutes)
})
const todayTemporalStateMap = computed(() => new Map(todayTemporalStates.value.map((entry) => [entry.course.id, entry.state])))
const todaySummary = computed<TodayScheduleState | null>(() => {
  if (!isRealtimeView.value || !currentClock.value) return null
  return getTodayScheduleState(todayCourses.value, currentClock.value.minutes)
})
const currentTimeMarker = computed(() => {
  if (!isRealtimeView.value || !currentClock.value) return null
  return getCurrentTimeMarker(currentClock.value.minutes)
})
const summaryCourse = computed(() => {
  const summary = todaySummary.value
  return summary?.type === 'current' || summary?.type === 'next' ? summary.course : null
})
const summaryEyebrow = computed(() => {
  if (todaySummary.value?.type === 'current') return 'NOW'
  if (todaySummary.value?.type === 'next') return 'NEXT'
  if (todaySummary.value?.type === 'finished') return 'DONE'
  return 'TODAY'
})
const summaryCountdown = computed(() => {
  const summary = todaySummary.value
  if (!summary || (summary.type !== 'current' && summary.type !== 'next')) return ''
  return summary.type === 'current'
    ? `距离下课 ${formatScheduleDuration(summary.remainingMinutes)}`
    : `距离上课 ${formatScheduleDuration(summary.startsInMinutes)}`
})
const summaryMessage = computed(() => {
  const summary = todaySummary.value
  if (summary?.type === 'finished') return '今天课程结束'
  if (summary?.type === 'empty') {
    const label = todayKey.value ? getStatusLabel(todayKey.value) : ''
    return `今天没有课程${label ? ` · ${label}` : ''}`
  }
  return ''
})

function courseTime(startSection: number, endSection: number) {
  const range = getCourseTimeRange({ startSection, endSection })
  return `${range.startLabel}–${range.endLabel}`
}

function courseTone(title: string) {
  return courseTones[title] || 'default'
}

function displayCourseText(value: string) {
  return originalCourseText[value] || value
}

function getStatusLabel(date: string) {
  const status = getDayStatus(date)
  return status.type === 'normal' ? '' : status.label
}

function temporalStateFor(date: string, course: Course): CourseTemporalState | undefined {
  if (!isRealtimeView.value || date !== todayKey.value) return undefined
  return todayTemporalStateMap.value.get(course.id)
}

function temporalStateLabel(state: CourseTemporalState | undefined) {
  if (state === 'ended') return '已结束'
  if (state === 'current') return '正在上课'
  if (state === 'next') return '下一节'
  if (state === 'later') return '稍后'
  return ''
}

function courseClassNames(date: string, course: Course) {
  const state = temporalStateFor(date, course)
  return [`schedule-course--${courseTone(course.title)}`, state ? `schedule-course--${state}` : '']
}

function courseAriaLabel(date: string, course: Course) {
  const state = temporalStateFor(date, course)
  const status = temporalStateLabel(state)
  return [
    displayCourseText(course.title),
    courseTime(course.startSection, course.endSection),
    displayCourseText(course.campus),
    displayCourseText(course.room),
    displayCourseText(course.teacher),
    status
  ]
    .filter(Boolean)
    .join('，')
}

function isTodayColumn(date: string) {
  return isRealtimeView.value && date === todayKey.value
}

function isMonthToday(date: string) {
  return Boolean(todayKey.value && date === todayKey.value && getTeachingWeek(date))
}

function monthCourseCount(date: string) {
  return getCoursesForDate(date).length
}

function readStoredView(): View | null {
  if (!import.meta.client) return null
  return parseView(localStorage.getItem(SCHEDULE_VIEW_KEY) || undefined)
}

function baseQueryForView(nextView: View): Record<string, string> {
  if (nextView === 'today') return { view: 'today' }
  if (nextView === 'month') return { view: 'month', month: selectedMonth.value }
  return { view: 'week', week: String(selectedWeek.value) }
}

function courseIsAvailable(courseId: string, candidateView: View, candidateWeek: number) {
  if (candidateView === 'today') {
    return Boolean(todayKey.value && getCoursesForDate(todayKey.value).some((course) => course.id === courseId))
  }
  if (candidateView === 'week') {
    return getWeekDates(candidateWeek).some((date) => getCoursesForDate(date).some((course) => course.id === courseId))
  }
  return false
}

function buildCanonicalQuery(candidateView: View): Record<string, string> {
  const query: Record<string, string> = { view: candidateView }
  let candidateWeek = currentTeachingWeek.value

  if (candidateView === 'week') {
    candidateWeek = parseWeek(getQueryValue('week')) || currentTeachingWeek.value
    query.week = String(candidateWeek)
  } else if (candidateView === 'month') {
    query.month = getValidMonthQuery() || defaultMonth.value
  }

  const courseId = getQueryValue('course')
  if (courseId && courseIsAvailable(courseId, candidateView, candidateWeek)) query.course = courseId
  return query
}

function queryMatches(query: Record<string, string>) {
  const keys = Object.keys(route.query)
  const expectedKeys = Object.keys(query)
  if (keys.length !== expectedKeys.length) return false
  return expectedKeys.every((key) => route.query[key] === query[key])
}

function normalizeRoute() {
  if (!import.meta.client) return
  const query = buildCanonicalQuery(view.value)
  if (!queryMatches(query)) void router.replace({ query })
}

function selectView(nextView: View) {
  if (import.meta.client) localStorage.setItem(SCHEDULE_VIEW_KEY, nextView)
  const query = baseQueryForView(nextView)
  if (!queryMatches(query)) void router.push({ query })
}

function selectWeek(week: number) {
  if (week < 1 || week > semester.totalWeeks) return
  void router.push({ query: { view: 'week', week: String(week) } })
}

function selectDate(date: string) {
  const week = getTeachingWeek(date)
  if (!week) return
  void router.push({ query: { view: 'week', week: String(week) } })
}

function monthOffset(offset: number) {
  const next = getAdjacentMonth(selectedMonth.value, offset)
  if (next >= semester.start.slice(0, 7) && next <= semester.end.slice(0, 7)) {
    void router.push({ query: { view: 'month', month: next } })
  }
}

function openCourse(course: Course) {
  const query = { ...baseQueryForView(view.value), course: course.id }
  void router.push({ query })
}

function closeCourse() {
  void router.replace({ query: baseQueryForView(view.value) })
}

function refreshNow() {
  now.value = new Date()
}

function scrollTodayIntoView() {
  if (!import.meta.client || view.value !== 'today' || !todayKey.value) return
  void nextTick(() => {
    const today = document.querySelector<HTMLElement>(`[data-schedule-date="${todayKey.value}"]`)
    if (!today) return
    today.scrollIntoView({
      inline: 'center',
      block: 'nearest',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    })
  })
}

function handleVisibilityChange() {
  if (document.visibilityState === 'visible') refreshNow()
}

const selectedCourse = computed<Course | null>(() => {
  const courseId = getQueryValue('course')
  if (!courseId) return null
  if (view.value === 'today' && todayKey.value) {
    return getCoursesForDate(todayKey.value).find((course) => course.id === courseId) || null
  }
  if (view.value === 'week') {
    for (const date of weekDates.value) {
      const course = getCoursesForDate(date).find((candidate) => candidate.id === courseId)
      if (course) return course
    }
  }
  return null
})

watch(
  () => [route.query.view, route.query.week, route.query.month, route.query.course, todayKey.value, view.value, selectedWeek.value],
  () => {
    if (!isMounted.value) return
    normalizeRoute()
    if (view.value === 'today') scrollTodayIntoView()
  },
  { flush: 'post' }
)

onMounted(() => {
  if (!requestedView.value) storedView.value = readStoredView()
  refreshNow()
  isMounted.value = true
  normalizeRoute()
  document.addEventListener('visibilitychange', handleVisibilityChange)
  clockTimer = window.setInterval(refreshNow, 30_000)
  scrollTodayIntoView()
})

onBeforeUnmount(() => {
  if (clockTimer !== undefined) window.clearInterval(clockTimer)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})

useSeoMeta({
  title: '日程',
  description: '2026–2027 學年度第 1 學期課表與校曆。',
  ogTitle: '日程 · blog',
  ogDescription: '2026–2027 學年度第 1 學期課表與校曆。'
})
</script>

<template>
  <section class="schedule-heading">
    <p class="eyebrow">SEMESTER / 2026–2027-1</p>
    <div>
      <h1>日程</h1>
      <p>課表與校曆 · 長安校區</p>
    </div>
    <p class="schedule-heading__term">2026.08.31 — 2027.01.15<br />共 20 個教學週</p>
  </section>

  <section class="schedule-toolbar" aria-label="日程檢視與教學週控制">
    <div class="schedule-view-switch" role="group" aria-label="選擇日程檢視">
      <button :class="{ active: view === 'today' }" type="button" @click="selectView('today')">今日</button>
      <button :class="{ active: view === 'week' }" type="button" @click="selectView('week')">週課表</button>
      <button :class="{ active: view === 'month' }" type="button" @click="selectView('month')">月曆</button>
    </div>

    <template v-if="view === 'week'">
      <button class="schedule-step" type="button" :disabled="selectedWeek === 1" @click="selectWeek(selectedWeek - 1)">← 上一週</button>
      <label class="schedule-week-select">
        <span>教學週</span>
        <select :value="selectedWeek" @change="selectWeek(Number(($event.target as HTMLSelectElement).value))">
          <option v-for="week in semester.totalWeeks" :key="week" :value="week">第 {{ week }} 週</option>
        </select>
      </label>
      <button class="schedule-step" type="button" :disabled="selectedWeek === semester.totalWeeks" @click="selectWeek(selectedWeek + 1)">
        下一週 →
      </button>
    </template>

    <template v-else-if="view === 'month'">
      <button class="schedule-step" type="button" :disabled="selectedMonth === semester.start.slice(0, 7)" @click="monthOffset(-1)">
        ← 上個月
      </button>
      <strong class="schedule-month-title">{{ monthName }}</strong>
      <button class="schedule-step" type="button" :disabled="selectedMonth === semester.end.slice(0, 7)" @click="monthOffset(1)">
        下個月 →
      </button>
    </template>

    <span v-else class="schedule-toolbar__today">TODAY · {{ todayKey ? getDateLabel(todayKey) : '今日' }}</span>
  </section>

  <section
    v-if="view === 'week' || view === 'today'"
    class="schedule-week"
    :aria-label="`${view === 'today' ? '今日 · ' : ''}第 ${selectedWeek} 教學週課表`"
  >
    <header class="schedule-week__intro">
      <div>
        <p class="eyebrow">{{ view === 'today' ? 'TODAY · ' : '' }}TEACHING WEEK {{ String(selectedWeek).padStart(2, '0') }}</p>
        <h2>{{ view === 'today' ? `今天 · 第 ${selectedWeek} 教學週` : `第 ${selectedWeek} 教學週` }}</h2>
      </div>
      <p>
        {{ view === 'today' && todayKey && todayWeekday >= 0 ? `${getDateLabel(todayKey)} · ${weekdayNames[todayWeekday]}` : weekRange }}
      </p>
    </header>

    <aside v-if="isRealtimeView && todaySummary" class="schedule-now-summary" aria-label="今日课程状态">
      <p class="schedule-now-summary__eyebrow">{{ summaryEyebrow }}</p>
      <div v-if="summaryCourse" class="schedule-now-summary__body">
        <strong>{{ displayCourseText(summaryCourse.title) }}</strong>
        <span>{{ courseTime(summaryCourse.startSection, summaryCourse.endSection) }} · {{ displayCourseText(summaryCourse.room) }}</span>
      </div>
      <div v-else class="schedule-now-summary__body">
        <strong>{{ summaryMessage }}</strong>
      </div>
      <p v-if="summaryCountdown" class="schedule-now-summary__countdown">{{ summaryCountdown }}</p>
    </aside>

    <div class="schedule-week__scroll">
      <div class="schedule-week__grid">
        <div class="schedule-time-axis" aria-hidden="true">
          <div v-for="time in sectionTimes" :key="time.section" class="schedule-time-slot" :style="{ gridRow: getGridRow(time.section) }">
            <strong>{{ String(time.section).padStart(2, '0') }}</strong>
            <span>{{ time.start }}<br />{{ time.end }}</span>
          </div>
        </div>

        <article
          v-for="(date, day) in weekDates"
          :key="date"
          :data-schedule-date="date"
          class="schedule-day"
          :class="[`schedule-day--${getDayStatus(date).type}`, { 'schedule-day--today': isTodayColumn(date) }]"
          :aria-current="isTodayColumn(date) ? 'date' : undefined"
        >
          <header class="schedule-day__header">
            <p>{{ weekdayNames[day] }}</p>
            <time :datetime="date">{{ getDateLabel(date) }}</time>
            <small v-if="getStatusLabel(date)">{{ getStatusLabel(date) }}</small>
          </header>
          <div class="schedule-day__slots">
            <button
              v-for="course in getCoursesForDate(date)"
              :key="course.id"
              class="schedule-course"
              :class="courseClassNames(date, course)"
              :aria-label="courseAriaLabel(date, course)"
              :style="{ gridRow: `${getGridRow(course.startSection)} / ${getGridRow(course.endSection) + 1}` }"
              type="button"
              @click="openCourse(course)"
            >
              <strong>{{ displayCourseText(course.title) }}</strong>
              <span class="schedule-course__time">{{ courseTime(course.startSection, course.endSection) }}</span>
              <small class="schedule-course__campus">{{ displayCourseText(course.campus) }}</small>
              <small class="schedule-course__room">{{ displayCourseText(course.room) }}</small>
              <small class="schedule-course__teacher">{{ displayCourseText(course.teacher) }}</small>
              <small v-if="temporalStateFor(date, course)" class="schedule-course__status">{{
                temporalStateLabel(temporalStateFor(date, course))
              }}</small>
              <em class="schedule-course__weeks">{{ formatWeekRules(course.weekRules) }} · {{ courseKindLabels[course.kind] }}</em>
            </button>
            <div
              v-if="isRealtimeView && date === todayKey && currentTimeMarker"
              class="schedule-now-marker-row"
              :style="{ gridRow: String(currentTimeMarker.row), '--progress': currentTimeMarker.progress }"
              aria-hidden="true"
            >
              <div class="schedule-now-marker">
                <span>{{ currentTimeMarker.label }}</span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>

    <aside class="schedule-legend" aria-label="日程提示">
      <p>窄屏可左右滑動查看週末；每門課使用固定的獨立顏色，假期不顯示常規課程，調課日則按校曆執行指定日期的課表。</p>
    </aside>
  </section>

  <section v-else class="schedule-month" :aria-label="`${monthName} 月曆`">
    <header class="schedule-month__weekdays" aria-hidden="true">
      <span v-for="day in weekdayNames" :key="day">{{ day }}</span>
    </header>
    <div class="schedule-month__grid">
      <button
        v-for="date in monthGrid"
        :key="date"
        class="schedule-month-day"
        :class="{
          muted: getMonthKey(date) !== selectedMonth,
          holiday: getDayStatus(date).type === 'holiday',
          makeup: getDayStatus(date).type === 'makeup',
          today: isMonthToday(date)
        }"
        type="button"
        :disabled="!getTeachingWeek(date)"
        @click="selectDate(date)"
      >
        <time :datetime="date">{{ Number(date.slice(-2)) }}</time>
        <span v-if="getStatusLabel(date)" class="schedule-month-day__label">{{ getStatusLabel(date) }}</span>
        <span v-if="monthCourseCount(date)" class="schedule-month-day__dots" aria-hidden="true">
          <i v-for="dot in Math.min(5, monthCourseCount(date))" :key="dot" />
        </span>
        <span v-if="monthCourseCount(date)" class="schedule-month-day__courses">{{ monthCourseCount(date) }} COURSES</span>
        <span v-else-if="!getStatusLabel(date)" class="schedule-month-day__empty">—</span>
      </button>
    </div>
    <p class="schedule-month__help">點選教學期內的日期，即可查看所在教學週的完整課表。</p>
  </section>

  <Teleport to="body">
    <div v-if="selectedCourse" class="schedule-course-dialog" role="presentation" @click.self="closeCourse">
      <section
        class="schedule-course-dialog__card"
        role="dialog"
        aria-modal="true"
        :aria-label="`${displayCourseText(selectedCourse.title)} 課程詳情`"
      >
        <button class="schedule-course-dialog__close" type="button" aria-label="關閉課程詳情" @click="closeCourse">×</button>
        <p class="eyebrow">{{ courseKindLabels[selectedCourse.kind] }} / {{ formatWeekRules(selectedCourse.weekRules) }}</p>
        <h2>{{ displayCourseText(selectedCourse.title) }}</h2>
        <dl>
          <div>
            <dt>時間</dt>
            <dd>
              {{ courseTime(selectedCourse.startSection, selectedCourse.endSection) }} · 第 {{ selectedCourse.startSection }}–{{
                selectedCourse.endSection
              }}
              節
            </dd>
          </div>
          <div>
            <dt>校區</dt>
            <dd>{{ displayCourseText(selectedCourse.campus) }}</dd>
          </div>
          <div>
            <dt>場地</dt>
            <dd>{{ displayCourseText(selectedCourse.room) }}</dd>
          </div>
          <div>
            <dt>教師</dt>
            <dd>{{ displayCourseText(selectedCourse.teacher) }}</dd>
          </div>
          <div v-if="selectedCourse.courseCode">
            <dt>课程号</dt>
            <dd>{{ displayCourseText(selectedCourse.courseCode) }}</dd>
          </div>
          <div v-if="selectedCourse.studentGroups?.length">
            <dt>教学班</dt>
            <dd>
              <ul class="schedule-course-dialog__groups">
                <li v-for="group in selectedCourse.studentGroups" :key="group">{{ group }}</li>
              </ul>
            </dd>
          </div>
          <div v-if="selectedCourse.assessment">
            <dt>考核</dt>
            <dd>{{ displayCourseText(selectedCourse.assessment) }}</dd>
          </div>
          <div
            v-if="
              selectedCourse.theoryHours !== undefined ||
              selectedCourse.weeklyHours !== undefined ||
              selectedCourse.totalHours !== undefined
            "
          >
            <dt>学时</dt>
            <dd class="schedule-course-dialog__hours">
              <span v-if="selectedCourse.theoryHours !== undefined">理论 {{ selectedCourse.theoryHours }}</span>
              <span v-if="selectedCourse.weeklyHours !== undefined">周学时 {{ selectedCourse.weeklyHours }}</span>
              <span v-if="selectedCourse.totalHours !== undefined">总学时 {{ selectedCourse.totalHours }}</span>
            </dd>
          </div>
          <div v-if="selectedCourse.credits !== undefined">
            <dt>学分</dt>
            <dd>{{ selectedCourse.credits.toFixed(1) }}</dd>
          </div>
        </dl>
      </section>
    </div>
  </Teleport>
</template>
