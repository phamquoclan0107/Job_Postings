// src/api/jobApi.js
import axiosInstance from './axiosInstance'

/**
 * GET /api/jobs
 * Params: keyword, location, salaryMin, salaryMax, categoryId, status, page, size, sort
 * Response: ApiResponse<Page<SummaryResponse>>
 */
export const getAllJobs = (params = {}) =>
  axiosInstance.get('/api/jobs', { params }).then((r) => r.data)

/**
 * GET /api/jobs/search (alias, same params)
 */
export const searchJobs = (params = {}) =>
  axiosInstance.get('/api/jobs/search', { params }).then((r) => r.data)

/**
 * GET /api/jobs/:id
 * Response: ApiResponse<DetailResponse>
 */
export const getJobById = (id) =>
  axiosInstance.get(`/api/jobs/${id}`).then((r) => r.data)

/**
 * GET /api/jobs/:id/similar
 * Response: ApiResponse<List<SummaryResponse>>
 */
export const getSimilarJobs = (id, limit = 4) =>
  axiosInstance.get(`/api/jobs/${id}/similar`, { params: { limit } }).then((r) => r.data)

/**
 * POST /api/jobs (requires JWT)
 */
export const createJob = (payload) =>
  axiosInstance.post('/api/jobs', payload).then((r) => r.data)

/**
 * PUT /api/jobs/:id (requires JWT)
 */
export const updateJob = (id, payload) =>
  axiosInstance.put(`/api/jobs/${id}`, payload).then((r) => r.data)

/**
 * DELETE /api/jobs/:id (requires JWT)
 */
export const deleteJob = (id) =>
  axiosInstance.delete(`/api/jobs/${id}`).then((r) => r.data)