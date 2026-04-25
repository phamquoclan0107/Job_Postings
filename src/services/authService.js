// src/services/authService.js
import * as authApi from '../api/authApi'

const TOKEN_KEY   = 'accessToken'
const REFRESH_KEY = 'refreshToken'
const ADMIN_KEY   = 'adminInfo'

export const authService = {
  // ─── Register ──────────────────────────────────────────────────────────────
  async register(username, email, password, confirmPassword) {
    return authApi.register({ username, email, password, confirmPassword })
  },

  // ─── Login ─────────────────────────────────────────────────────────────────
  async login(username, password) {
    const res = await authApi.login({ username, password })
    const { accessToken, refreshToken, admin } = res.data
    localStorage.setItem(TOKEN_KEY,   accessToken)
    localStorage.setItem(REFRESH_KEY, refreshToken)
    localStorage.setItem(ADMIN_KEY,   JSON.stringify(admin))
    return admin
  },

  // ─── Logout ────────────────────────────────────────────────────────────────
  logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_KEY)
    localStorage.removeItem(ADMIN_KEY)
  },

  getToken()   { return localStorage.getItem(TOKEN_KEY) },
  isLoggedIn() { return !!localStorage.getItem(TOKEN_KEY) },
  getAdmin()   {
    const raw = localStorage.getItem(ADMIN_KEY)
    return raw ? JSON.parse(raw) : null
  },

  // ─── Change Password ───────────────────────────────────────────────────────
  // FE gửi: oldPassword + newPassword + confirmPassword
  // BE nhận qua DTO → verify → hash → lưu password_hash
  async changePassword(oldPassword, newPassword, confirmPassword) {
    return authApi.changePassword({ oldPassword, newPassword, confirmPassword })
  },

  // ─── Forgot Password — B1: yêu cầu OTP ────────────────────────────────────
  async forgotPassword(email) {
    return authApi.forgotPassword({ email })
  },

  // ─── Forgot Password — B2: xác thực OTP + đặt mật khẩu mới ───────────────
  // FE gửi: email + otp + newPassword + confirmPassword
  // BE nhận qua DTO → verify OTP → hash → lưu password_hash
  async resetPassword(email, otp, newPassword, confirmPassword) {
    return authApi.resetPassword({ email, otp, newPassword, confirmPassword })
  },

  // ─── Update Profile ────────────────────────────────────────────────────────
  async updateProfile(payload) {
    const res = await authApi.updateProfile(payload)
    const current = this.getAdmin()
    if (current) {
      localStorage.setItem(ADMIN_KEY, JSON.stringify({ ...current, ...res.data }))
    }
    return res.data
  },
}
