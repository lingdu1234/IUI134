/* eslint-disable no-unused-vars */
/*
 * @Author: lingdu waong2005@126.com
 * @Date: 2022-10-03 07:46:07
 * @LastEditors: lingdu waong2005@126.com
 * @FilePath: \IUI314\src\api\system\login.ts
 * @Description: login
 */

import { ref } from 'vue'

import { ApiSysLogin } from '@/api/apis'
import { useGet, usePost } from '@/hooks'
import type {
  codeData,
  FullUserInfo,
  LoginForm,
  TokenInfo,
} from '@/types/base/login'
import type { AppRouteRecordRaw } from '@/types/base/router'

/**
 * 验证码
 */
export const useCaptcha = () => {
  const captchaData = ref<codeData | null>()

  /**
   * @description: 获取验证码
   */
  const getCaptcha = async () => {
    const { data, execute } = useGet<codeData>(ApiSysLogin.getCaptcha)
    await execute()
    captchaData.value = data.value
  }
  getCaptcha()
  return { captchaData, getCaptcha }
}

/**
 * user login
 * @param {LoginForm} user
 * @return {TokenInfo} token
 */
export const loginUser = async (user: LoginForm): Promise<TokenInfo> => {
  const { data, execute } = usePost<TokenInfo>(ApiSysLogin.login, user)
  await execute()
  return data.value!
}

/**
 * @description 获取完整用户信息
 * @return {FullUserInfo}
 */
export const getFullUserInfo = async (): Promise<FullUserInfo> => {
  const { data, execute } = useGet<FullUserInfo>(ApiSysLogin.getUserInfo)
  await execute()
  return data.value!
}

// 获取路由信息
export const getUserRouters = async (): Promise<AppRouteRecordRaw[]> => {
  const { data, execute } = useGet<AppRouteRecordRaw[]>(ApiSysLogin.getRouters)
  await execute()
  return data.value!
}

// logout
export const logOutUser = async () => {
  const { execute } = usePost(ApiSysLogin.logOut)
  await execute()
}
