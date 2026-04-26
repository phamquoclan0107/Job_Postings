// src/api/productApi.js
import axiosInstance from './axiosInstance'

/**
 * GET /api/products
 * Params: categoryId, isActive, page, size, sort
 * Response: ApiResponse<Page<ProductDTO.Response>>
 */
export const getAllProducts = (params = {}) =>
  axiosInstance.get('/api/products', { params }).then((r) => r.data)

/**
 * GET /api/products/:id
 * Response: ApiResponse<ProductDTO.Response>
 */
export const getProductById = (id) =>
  axiosInstance.get(`/api/products/${id}`).then((r) => r.data)

/**
 * POST /api/products (requires JWT)
 */
export const createProduct = (payload) =>
  axiosInstance.post('/api/products', payload).then((r) => r.data)

/**
 * PUT /api/products/:id (requires JWT)
 */
export const updateProduct = (id, payload) =>
  axiosInstance.put(`/api/products/${id}`, payload).then((r) => r.data)

/**
 * DELETE /api/products/:id (requires JWT)
 */
export const deleteProduct = (id) =>
  axiosInstance.delete(`/api/products/${id}`).then((r) => r.data)

/**
 * POST /api/products/:id/images (requires JWT)
 */
export const addProductImages = (id, files) => {
  const fd = new FormData()
  files.forEach((f) => fd.append('files', f))
  return axiosInstance.post(`/api/products/${id}/images`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data)
}

/**
 * DELETE /api/products/:id/images/:imageId (requires JWT)
 */
export const deleteProductImage = (productId, imageId) =>
  axiosInstance.delete(`/api/products/${productId}/images/${imageId}`).then((r) => r.data)