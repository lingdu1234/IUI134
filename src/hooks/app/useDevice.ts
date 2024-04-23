import { useScreenOrientation, useWindowSize } from '@vueuse/core'
import { onMounted, onUnmounted, ref, watch } from 'vue'

import { useAppStore, useUserStore } from '@/stores'

const mobileWidth = 768

export function useMobile() {
  const appStore = useAppStore()
  const { width } = useWindowSize()
  const isMobile = ref(false)
  watch(
    () => width.value,
    (v: number) => {
      isMobile.value = getIsMobile(v)
      appStore.setIsMobile(isMobile.value)
    },
    { immediate: true },
  )
  return {
    isMobile,
  }
}

export function useToken() {
  const userStore = useUserStore()
  const now = new Date().getTime() / 1000 // 分钟
  const exp = (userStore.token.expires - now) / (24 * 60 * 60) // 天
  const isExpiredSoon = exp < 1
  const valid = exp > 0
  return {
    isExpiredSoon,
    valid,
    token: `${userStore.token.type} ${userStore.token.value}`,
  }
}

// 获取屏幕方向
export function useOrientation() {
  const { angle } = useScreenOrientation()
  const isPortrait = ref(false)
  watch(() => angle.value, (v: number) => {
    isPortrait.value = v % 20 === 0
  }, { immediate: true })

  return {
    isPortrait,
  }
}

enum OS {
  WINDOWS,
  MACOS,
  IOS,
  ANDROID,
  OTHER,
}

// 获取系统OS
function getOS(): OS {
  const u = navigator.userAgent
  if (!!u.match(/compatible/i) || u.match(/Windows/i))
    return OS.WINDOWS
  else if (!!u.match(/Macintosh/i) || u.match(/MacIntel/i))
    return OS.MACOS
  else if (!!u.match(/iphone/i) || u.match(/Ipad/i))
    return OS.IOS
  else if (u.match(/android/i))
    return OS.ANDROID
  else
    return OS.OTHER
}

//  获取是否移动设备
function getIsMobile(screenSize: number): boolean {
  let isMobile = false
  const os = getOS()
  if (screenSize < mobileWidth)
    isMobile = true
  else if ((os === OS.ANDROID || os === OS.IOS) && screenSize <= 1200)
    isMobile = true
  return isMobile
}

export function useTime() {
  let timer: number | undefined // 定时器
  const year = ref(0) // 年份
  const month = ref(0) // 月份
  const week = ref('') // 星期几
  const day = ref(0) // 天数
  const hour = ref('') // 小时
  const minute = ref('0') // 分钟
  const second = ref(0) // 秒

  // 更新时间
  const updateTime = () => {
    const date = new Date()
    year.value = date.getFullYear()
    month.value = date.getMonth() + 1
    week.value = '日一二三四五六'.charAt(date.getDay())
    day.value = date.getDate()
    hour.value
      = (`${date.getHours()}`)?.padStart(2, '0')
      || new Intl.NumberFormat(undefined, { minimumIntegerDigits: 2 }).format(
        date.getHours(),
      )
    minute.value
      = (`${date.getMinutes()}`)?.padStart(2, '0')
      || new Intl.NumberFormat(undefined, { minimumIntegerDigits: 2 }).format(
        date.getMinutes(),
      )
    second.value = date.getSeconds()
  }

  updateTime()

  onMounted(() => {
    clearInterval(timer)
    timer = setInterval(() => updateTime(), 1000) as any
  })

  onUnmounted(() => {
    clearInterval(timer)
  })

  return { month, day, hour, minute, second, week }
}
