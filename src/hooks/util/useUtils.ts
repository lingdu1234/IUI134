import { useDateFormat } from '@vueuse/core'
import type { DateModelType } from 'element-plus'
import { ref } from 'vue'

import { useSetupI18n } from '@/i18n'
import { useAppStore, useDictsStore } from '@/stores'
import type { pageQueryParam } from '@/types/base/apis'
import type { dictUse } from '@/types/system/dict'

const opt = Object.prototype.toString

export function isString(obj: any): obj is string {
  return opt.call(obj) === '[object String]'
}

/**
 * 动态标题
 */
export function useDynamicTitle() {
  const appStore = useAppStore()

  const { i18n } = useSetupI18n()
  const { t } = i18n.global

  const setDynamicTitle = () => {
    if (appStore.app.dynamicTitle) {
      const title = appStore.app.titleI18n
        ? t(`route.${appStore.app.titleI18n}`)
        : appStore.app.title
      window.document.title = `${title}-${t('APP')}`
    }
    else {
      window.document.title = t('APP')
    }
  }
  return {
    setDynamicTitle,
  }
}

/**
 * 获取字典数据
 * @param dictTypes
 */
export function useDicts(...dictTypes: string[]) {
  const result = ref<Record<string, dictUse[]>>({})
  for (const dictType of dictTypes) {
    useDictsStore()
      .getDict(dictType)
      .then((data: dictUse[]) => {
        result.value[dictType] = data
      })
  }
  return result
}

/**
 *  解析时间
 * @param time 时间
 * @param format
 * @returns
 */
export function parseTime(time: any, format?: string) {
  if (!format)
    format = 'YYYY-MM-DD HH:mm:ss'

  if (time === undefined || time === '' || time === null)
    return ''
  const formatted = useDateFormat(time, format)
  return formatted.value
}

export function addTimeQueryParam<T extends pageQueryParam>(queryParams: T, time: [DateModelType, DateModelType] | undefined) {
  const res = {
    ...queryParams,
  }
  if (time) {
    res.begin_time = time[0] as string
    res.end_time = time[1] as string
  }

  return res
}
