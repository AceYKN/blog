<script setup lang="ts">
import { sectionTimes, semester, type Course, type CourseKind } from '~/config/schedule'
import {
  formatWeekRules,
  getAdjacentMonth,
  getCoursesForDate,
  getDateLabel,
  getDayStatus,
  getGridRow,
  getMonthGrid,
  getMonthKey,
  getMonthName,
  getTeachingWeek,
  getWeekDates,
  getWeekRangeLabel,
  weekdayNames
} from '~/utils/schedule'

type View = 'week' | 'month'

const selectedWeek = ref(1)
const selectedMonth = ref(semester.start.slice(0, 7))
const view = ref<View>('week')
const monthGrid = computed(() => getMonthGrid(selectedMonth.value))
const weekDates = computed(() => getWeekDates(selectedWeek.value))
const weekRange = computed(() => getWeekRangeLabel(selectedWeek.value))
const monthName = computed(() => getMonthName(selectedMonth.value))
const courseKindLabels: Record<CourseKind, string> = { theory: '理論', lab: '實驗', computer: '上機' }
const selectedCourse = ref<Course | null>(null)
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
  '設計模式與 UML': 'design-patterns'
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

function getTaipeiDateKey() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Taipei'
  }).formatToParts(new Date())
  const part = (type: string) => parts.find((item) => item.type === type)?.value || ''
  return `${part('year')}-${part('month')}-${part('day')}`
}

function selectWeek(week: number) {
  if (week < 1 || week > semester.totalWeeks) return
  selectedWeek.value = week
  selectedMonth.value = getMonthKey(getWeekDates(week)[0]!)
}

function selectDate(date: string) {
  const week = getTeachingWeek(date)
  if (!week) return
  selectedWeek.value = week
  selectedMonth.value = getMonthKey(date)
  view.value = 'week'
}

function courseTime(startSection: number, endSection: number) {
  const start = sectionTimes.find((item) => item.section === startSection)?.start
  const end = sectionTimes.find((item) => item.section === endSection)?.end
  return `${start}–${end}`
}

function courseTone(title: string) {
  return courseTones[title] || 'default'
}

function displayCourseText(value: string) {
  return originalCourseText[value] || value
}

function monthOffset(offset: number) {
  const next = getAdjacentMonth(selectedMonth.value, offset)
  if (next >= semester.start.slice(0, 7) && next <= semester.end.slice(0, 7)) selectedMonth.value = next
}

function getStatusLabel(date: string) {
  const status = getDayStatus(date)
  return status.type === 'normal' ? '' : status.label
}

onMounted(() => {
  const today = getTaipeiDateKey()
  const currentWeek = getTeachingWeek(today)
  if (currentWeek) {
    selectedWeek.value = currentWeek
    selectedMonth.value = getMonthKey(today)
  }
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
      <button :class="{ active: view === 'week' }" type="button" @click="view = 'week'">週課表</button>
      <button :class="{ active: view === 'month' }" type="button" @click="view = 'month'">月曆</button>
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

    <template v-else>
      <button class="schedule-step" type="button" :disabled="selectedMonth === semester.start.slice(0, 7)" @click="monthOffset(-1)">
        ← 上個月
      </button>
      <strong class="schedule-month-title">{{ monthName }}</strong>
      <button class="schedule-step" type="button" :disabled="selectedMonth === semester.end.slice(0, 7)" @click="monthOffset(1)">
        下個月 →
      </button>
    </template>
  </section>

  <section v-if="view === 'week'" class="schedule-week" :aria-label="`第 ${selectedWeek} 教學週課表`">
    <header class="schedule-week__intro">
      <div>
        <p class="eyebrow">TEACHING WEEK {{ String(selectedWeek).padStart(2, '0') }}</p>
        <h2>第 {{ selectedWeek }} 教學週</h2>
      </div>
      <p>{{ weekRange }}</p>
    </header>

    <div class="schedule-week__scroll">
      <div class="schedule-week__grid">
        <div class="schedule-time-axis" aria-hidden="true">
          <div v-for="time in sectionTimes" :key="time.section" class="schedule-time-slot" :style="{ gridRow: getGridRow(time.section) }">
            <strong>{{ String(time.section).padStart(2, '0') }}</strong>
            <span>{{ time.start }}<br />{{ time.end }}</span>
          </div>
        </div>

        <article v-for="(date, day) in weekDates" :key="date" class="schedule-day" :class="`schedule-day--${getDayStatus(date).type}`">
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
              :class="`schedule-course--${courseTone(course.title)}`"
              :aria-label="`${displayCourseText(course.title)}，${courseTime(course.startSection, course.endSection)}，${displayCourseText(course.campus)}，${displayCourseText(course.room)}，${displayCourseText(course.teacher)}`"
              :style="{ gridRow: `${getGridRow(course.startSection)} / ${getGridRow(course.endSection) + 1}` }"
              type="button"
              @click="selectedCourse = course"
            >
              <strong>{{ displayCourseText(course.title) }}</strong>
              <span>{{ courseTime(course.startSection, course.endSection) }}</span>
              <small>{{ displayCourseText(course.campus) }}</small>
              <small>{{ displayCourseText(course.room) }}</small>
              <small>{{ displayCourseText(course.teacher) }}</small>
              <em>{{ formatWeekRules(course.weekRules) }} · {{ courseKindLabels[course.kind] }}</em>
            </button>
          </div>
        </article>
      </div>
    </div>

    <aside class="schedule-legend" aria-label="日程提示">
      <p>每門課使用固定的獨立顏色；假期不顯示常規課程，調課日則按校曆執行指定日期的課表。</p>
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
          makeup: getDayStatus(date).type === 'makeup'
        }"
        type="button"
        :disabled="!getTeachingWeek(date)"
        @click="selectDate(date)"
      >
        <time :datetime="date">{{ Number(date.slice(-2)) }}</time>
        <span v-if="getStatusLabel(date)" class="schedule-month-day__label">{{ getStatusLabel(date) }}</span>
        <span v-else-if="getCoursesForDate(date).length" class="schedule-month-day__courses"
          >{{ getCoursesForDate(date).length }} 門課</span
        >
        <span v-else class="schedule-month-day__empty">—</span>
      </button>
    </div>
    <p class="schedule-month__help">點選教學期內的日期，即可查看所在教學週的完整課表。</p>
  </section>

  <Teleport to="body">
    <div v-if="selectedCourse" class="schedule-course-dialog" role="presentation" @click.self="selectedCourse = null">
      <section
        class="schedule-course-dialog__card"
        role="dialog"
        aria-modal="true"
        :aria-label="`${displayCourseText(selectedCourse.title)} 課程詳情`"
      >
        <button class="schedule-course-dialog__close" type="button" aria-label="關閉課程詳情" @click="selectedCourse = null">×</button>
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
        </dl>
      </section>
    </div>
  </Teleport>
</template>
