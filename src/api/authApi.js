// src/api/authApi.js
import axiosInstance from './axiosInstance'

/** POST /api/auth/register — đăng ký */
export const register = (payload) =>
  axiosInstance.post('/api/auth/register', payload).then((r) => r.data)

/** POST /api/auth/login */
export const login = (payload) =>
  axiosInstance.post('/api/auth/login', payload).then((r) => r.data)

/** POST /api/auth/refresh-token */
export const refreshToken = (refreshToken) =>
  axiosInstance.post('/api/auth/refresh-token', { refreshToken }).then((r) => r.data)

/** POST /api/auth/forgot-password */
export const forgotPassword = (payload) =>
  axiosInstance.post('/api/auth/forgot-password', payload).then((r) => r.data)

/** POST /api/auth/reset-password */
export const resetPassword = (payload) =>
  axiosInstance.post('/api/auth/reset-password', payload).then((r) => r.data)

/** GET /api/users/me — lấy thông tin profile (requires JWT) */
export const getProfile = () =>
  axiosInstance.get('/api/users/me').then((r) => r.data)

/** PUT /api/users/change-password (requires JWT) */
export const changePassword = (payload) =>
  axiosInstance.put('/api/users/change-password', payload).then((r) => r.data)

/** PUT /api/users/me (requires JWT) */
export const updateProfile = (payload) =>
  axiosInstance.put('/api/users/me', payload).then((r) => r.data)