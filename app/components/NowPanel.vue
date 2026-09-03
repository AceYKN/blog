<script setup lang="ts">
import { site } from '~/config/site'

const now = ref<Date | null>(null)
const weather = ref<{ temperature: number; label: string; location: string } | null>(null)
const weatherStatus = ref<'loading' | 'ready' | 'unavailable'>('loading')
const isLocating = ref(false)
const locationMessage = ref('')
let timer: number | undefined
let weatherRequestId = 0
const current = computed(() => now.value)
const weekdayNames = ['日', '月', '火', '水', '木', '金', '土']
const weekday = computed(() => {
  if (!current.value) return ''
  const index = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(
    new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'Asia/Taipei' }).format(current.value)
  )
  return weekdayNames[index] || ''
})
const dateText = computed(() => {
  if (!current.value) return '臺北日期讀取中…'
  const date = new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Taipei'
  }).format(current.value)
  return `${date}・${weekday.value}曜日`
})
const timeText = computed(() => {
  if (!current.value) return '--:--'
  return new Intl.DateTimeFormat('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Taipei'
  }).format(current.value)
})
const clock = computed(() => {
  if (!current.value) return { hour: 0, minute: 0, second: 0 }
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
const weatherText = computed(() => {
  if (weather.value) return `${weather.value.location} · ${weather.value.label} ${weather.value.temperature}°C`
  return weatherStatus.value === 'unavailable' ? `${site.weather.label}天氣暫不可用` : `${site.weather.label}天氣讀取中…`
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

async function loadWeather(
  latitude: number = site.weather.latitude,
  longitude: number = site.weather.longitude,
  location: string = site.weather.label
) {
  const requestId = ++weatherRequestId
  try {
    const response = await $fetch<{ current?: { temperature_2m: number; weather_code: number } }>(
      'https://api.open-meteo.com/v1/forecast',
      {
        params: {
          latitude,
          longitude,
          current: 'temperature_2m,weather_code',
          timezone: 'Asia/Taipei'
        }
      }
    )
    if (requestId !== weatherRequestId) return false
    if (response.current) {
      weather.value = {
        location,
        temperature: Math.round(response.current.temperature_2m),
        label: weatherLabels[response.current.weather_code] || '天氣'
      }
      weatherStatus.value = 'ready'
      return true
    }
    if (!weather.value) weatherStatus.value = 'unavailable'
  } catch {
    if (requestId === weatherRequestId && !weather.value) weatherStatus.value = 'unavailable'
  }
  return false
}

async function locationName(latitude: number, longitude: number) {
  try {
    const place = await $fetch<{ city?: string; locality?: string; principalSubdivision?: string }>(
      'https://api.bigdatacloud.net/data/reverse-geocode-client',
      { params: { latitude, longitude, localityLanguage: 'zh' } }
    )
    return place.city || place.locality || place.principalSubdivision || '目前位置'
  } catch {
    return '目前位置'
  }
}

function getCurrentPosition() {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 8_000,
      maximumAge: 30 * 60 * 1_000
    })
  })
}

async function useCurrentLocation() {
  locationMessage.value = ''
  if (!navigator.geolocation) {
    locationMessage.value = '此瀏覽器不支援定位，仍顯示臺北天氣。'
    return
  }

  isLocating.value = true
  try {
    const position = await getCurrentPosition()
    const { latitude, longitude } = position.coords
    const loaded = await loadWeather(latitude, longitude, await locationName(latitude, longitude))
    if (!loaded) locationMessage.value = '無法讀取當地天氣，已保留目前顯示。'
  } catch (error) {
    if (weather.value?.location !== site.weather.label) await loadWeather()
    locationMessage.value =
      error instanceof GeolocationPositionError && error.code === error.PERMISSION_DENIED
        ? '未取得定位權限，仍顯示臺北天氣。'
        : '無法取得目前位置，仍顯示臺北天氣。'
  } finally {
    isLocating.value = false
  }
}

function startClock() {
  now.value = new Date()
  if (!timer) timer = window.setInterval(() => (now.value = new Date()), 1_000)
}

function stopClock() {
  if (timer) {
    window.clearInterval(timer)
    timer = undefined
  }
}

function handleVisibilityChange() {
  if (document.hidden) stopClock()
  else startClock()
}

onMounted(() => {
  startClock()
  document.addEventListener('visibilitychange', handleVisibilityChange)
  void loadWeather()
})

onBeforeUnmount(() => {
  stopClock()
  document.removeEventListener('visibilitychange', handleVisibilityChange)
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
      ><small aria-live="polite">{{ weatherText }}</small
      ><button class="now-location" type="button" :disabled="isLocating" @click="useCurrentLocation">
        {{ isLocating ? '正在取得位置…' : '使用我的位置' }}
      </button>
      <small v-if="locationMessage" class="now-location__message" aria-live="polite">{{ locationMessage }}</small>
    </div>
  </aside>
</template>
