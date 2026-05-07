import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User, LoginCredentials, RegisterData } from '@/types'
import { authApi } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const refreshTokenValue = ref<string | null>(localStorage.getItem('refreshToken'))
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role || null)
  const userName = computed(() => user.value?.name || '')

  // Actions
  async function login(credentials: LoginCredentials) {
    isLoading.value = true
    error.value = null

    try {
      const response = await authApi.login(credentials)
      token.value = response.access_token
      refreshTokenValue.value = response.refresh_token
      user.value = response.user

      // Persist tokens
      localStorage.setItem('token', response.access_token)
      localStorage.setItem('refreshToken', response.refresh_token)

      return true
    } catch (err: any) {
      error.value = err.response?.data?.detail || '登录失败'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function register(data: RegisterData) {
    isLoading.value = true
    error.value = null

    try {
      await authApi.register(data)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.detail || '注册失败'
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function fetchCurrentUser() {
    if (!token.value) return false

    try {
      const userData = await authApi.getCurrentUser()
      user.value = userData
      return true
    } catch (err) {
      logout()
      return false
    }
  }

  async function refreshToken() {
    if (!refreshTokenValue.value) return false

    try {
      const response = await authApi.refreshToken(refreshTokenValue.value)
      token.value = response.access_token
      localStorage.setItem('token', response.access_token)
      return true
    } catch (err) {
      logout()
      return false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    refreshTokenValue.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
  }

  function clearError() {
    error.value = null
  }

  // Initialize auth state from storage
  async function initAuth() {
    if (token.value) {
      await fetchCurrentUser()
    }
  }

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    userRole,
    userName,
    login,
    register,
    logout,
    fetchCurrentUser,
    refreshToken,
    clearError,
    initAuth
  }
})
