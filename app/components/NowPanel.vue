<script setup lang="ts">
import { site } from '~/config/site'

const offset = ref(0)
const now = ref(new Date())
const weather = ref<{ temperature: number; label: string; location: string } | null>(null)
let timer: number | undefined
const current = computed(() => new Date(now.value.getTime() + offset.value))
const weekdayNames = ['日', '月', '火', '水', '木', '金', '土']
const weekday = computed(
  () =>
    weekdayNames[
      ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(
        new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'Asia/Taipei' }).format(current.value)
      )
    ] || ''
)
const dateText = computed(
  () =>
    `${new Intl.DateTimeFormat('zh-TW', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Taipei' }).format(current.value)}・${weekday.value}曜日`
)
const timeText = computed(() =>
  new Intl.DateTimeFormat('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Taipei' }).format(current.value)
)
const clock = computed(() => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    timeZone: 'Asia/Taipei'
  }).formatToParts(current.value)
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value || 0)
  const hour = value('hour')
  const minute = value('minute')
  const second = value('second')
  return { hour: hour * 30 + minute * 0.5, minute: minute * 6, second: second * 6 }
})
const weatherLabels: Record<number, string> = {
  0: '晴',
  1: '晴時多雲',
  2: '多雲',
  3: '陰',
  45: '霧',
  51: '毛毛雨',
  61: '雨',
  71: '雪',
  80: '陣雨',
  95: '雷雨'
}

async function loadWeather(latitude: number, longitude: number, location: string) {
  try {
    const response = await $fetch<{ current?: { temperature_2m: number; weather_code: number } }>(
      'https://api.open-meteo.com/v1/forecast',
      { params: { latitude, longitude, current: 'temperature_2m,weather_code', timezone: 'auto' } }
    )
    if (response.current)
      weather.value = {
        location,
        temperature: Math.round(response.current.temperature_2m),
        label: weatherLabels[response.current.weather_code] || '天氣'
      }
  } catch {
    /* The rest of the page remains useful without weather. */
  }
}

async function locationName(latitude: number, longitude: number) {
  try {
    const place = await $fetch<{ city?: string; locality?: string; principalSubdivision?: string }>(
      'https://api.bigdatacloud.net/data/reverse-geocode-client',
      { params: { latitude, longitude, localityLanguage: 'zh' } }
    )
    return place.city || place.locality || place.principalSubdivision || '你的所在地'
  } catch {
    return '你的所在地'
  }
}

onMounted(async () => {
  timer = window.setInterval(() => {
    now.value = new Date()
  }, 1_000)
  try {
    const remote = await $fetch<{ dateTime?: string }>('https://timeapi.io/api/time/current/zone?timeZone=Asia%2FTaipei')
    if (remote.dateTime) {
      const time = Date.parse(`${remote.dateTime}+08:00`)
      if (!Number.isNaN(time)) offset.value = time - Date.now()
    }
  } catch {
    /* Browser time is a sensible fallback. */
  }
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(
      async (position) =>
        loadWeather(
          position.coords.latitude,
          position.coords.longitude,
          await locationName(position.coords.latitude, position.coords.longitude)
        ),
      () => loadWeather(site.weather.latitude, site.weather.longitude, site.weather.label),
      { enableHighAccuracy: false, timeout: 8_000, maximumAge: 30 * 60 * 1_000 }
    )
  else loadWeather(site.weather.latitude, site.weather.longitude, site.weather.label)
})

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer)
})
</script>

<template>
  <aside class="now-panel">
    <div class="analogue-clock" aria-hidden="true">
      <i v-for="index in 12" :key="index" :style="{ transform: `rotate(${index * 30}deg)` }" /><b
        class="hand hour"
        :style="{ transform: `rotate(${clock.hour}deg)` }"
      /><b class="hand minute" :style="{ transform: `rotate(${clock.minute}deg)` }" /><b
        class="hand second"
        :style="{ transform: `rotate(${clock.second}deg)` }"
      />
    </div>
    <div>
      <p class="eyebrow">いま · 臺北時間</p>
      <time>{{ timeText }}</time
      ><span>{{ dateText }}</span
      ><small>{{ weather ? `${weather.location} · ${weather.label} ${weather.temperature}°C` : '空模様を読み込み中' }}</small>
    </div>
  </aside>
</template>
