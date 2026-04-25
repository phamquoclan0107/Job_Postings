// src/api/categoryApi.js
import axiosInstance from './axiosInstance'

/**
 * GET /api/categories?type=JOB|PRODUCT
 * Response: ApiResponse<List<CategoryDTO.Response>>
 *   { id, name, type, createdAt }
 */
export const getAllCategories = (type) =>
  axiosInstance.get('/api/categories', { params: type ? { type } : {} }).then((r) => r.data)

/**
 * GET /api/categories/:id
 * Response: ApiResponse<CategoryDTO.Response>
 */
export const getCategoryById = (id) =>
  axiosInstance.get(`/api/categories/${id}`).then((r) => r.data)

/**
 * POST /api/categories  (requires JWT)
 * Body: { name, type }  — type: "JOB" | "PRODUCT"
 * Response: ApiResponse<CategoryDTO.Response>
 */
export const createCategory = (payload) =>
  axiosInstance.post('/api/categories', payload).then((r) => r.data)

/**
 * PUT /api/categories/:id  (requires JWT)
 * Body: { name, type }
 * Response: ApiResponse<CategoryDTO.Response>
 */
export const updateCategory = (id, payload) =>
  axiosInstance.put(`/api/categories/${id}`, payload).then((r) => r.data)

/**
 * DELETE /api/categories/:id  (requires JWT)
 * Response: ApiResponse<Void>
 */
export const deleteCategory = (id) =>
  axiosInstance.delete(`/api/categories/${id}`).then((r) => r.data)
