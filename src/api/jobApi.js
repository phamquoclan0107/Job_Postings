// src/api/jobApi.js
import axiosInstance from './axiosInstance'

/**
 * GET /api/jobs
 * Response: ApiResponse<List<SummaryResponse>>
 */
export const getAllJobs = () =>
  axiosInstance.get('/api/jobs').then((r) => r.data)

/**
 * GET /api/jobs/search
 * Params: title?, categoryId?, status?, page, size, sort
 * Response: ApiResponse<Page<SummaryResponse>>
 *
 * Page shape:
 *   { content: [...], totalElements, totalPages, number, size, ... }
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
 * POST /api/jobs  (requires JWT)
 * Body: CreateRequest
 *   { categoryId, title, description?, salary?, location?, imageUrl?, status, expiresAt? }
 * Response: ApiResponse<DetailResponse>
 */
export const createJob = (payload) =>
  axiosInstance.post('/api/jobs', payload).then((r) => r.data)

/**
 * PUT /api/jobs/:id  (requires JWT)
 * Body: UpdateRequest (all fields optional)
 * Response: ApiResponse<DetailResponse>
 */
export const updateJob = (id, payload) =>
  axiosInstance.put(`/api/jobs/${id}`, payload).then((r) => r.data)

/**
 * DELETE /api/jobs/:id  (requires JWT) — soft delete
 * Response: ApiResponse<Void>
 */
export const deleteJob = (id) =>
  axiosInstance.delete(`/api/jobs/${id}`).then((r) => r.data)
