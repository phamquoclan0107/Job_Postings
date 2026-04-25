// src/services/jobService.js
import * as jobApi from '../api/jobApi'

export const jobService = {
  /** Lấy tất cả job (không phân trang) */
  async getAll() {
    const res = await jobApi.getAllJobs()
    return res.data // List<SummaryResponse>
  },

  /**
   * Tìm kiếm + phân trang
   * @param {Object} params - { title, categoryId, status, page, size, sort }
   * @returns {Object} Page { content, totalElements, totalPages, number, size }
   */
  async search(params = {}) {
    const res = await jobApi.searchJobs(params)
    return res.data // Page<SummaryResponse>
  },

  /** Chi tiết job */
  async getById(id) {
    const res = await jobApi.getJobById(id)
    return res.data // DetailResponse
  },

  /** Tạo job */
  async create(payload) {
    const res = await jobApi.createJob(payload)
    return res.data // DetailResponse
  },

  /** Cập nhật job */
  async update(id, payload) {
    const res = await jobApi.updateJob(id, payload)
    return res.data // DetailResponse
  },

  /** Soft delete */
  async delete(id) {
    return jobApi.deleteJob(id)
  },
}
