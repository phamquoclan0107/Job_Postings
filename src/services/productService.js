// src/services/productService.js
import * as productApi from '../api/productApi'

export const productService = {
  async search(params = {}) {
    const res = await productApi.getAllProducts(params)
    if (!res.success) throw new Error(res.message)
    return res.data
  },

  async getById(id) {
    const res = await productApi.getProductById(id)
    if (!res.success) throw new Error(res.message)
    return res.data
  },

  async create(payload) {
    const res = await productApi.createProduct(payload)
    if (!res.success) throw new Error(res.message)
    return res.data
  },

  async update(id, payload) {
    const res = await productApi.updateProduct(id, payload)
    if (!res.success) throw new Error(res.message)
    return res.data
  },

  async delete(id) {
    return productApi.deleteProduct(id)
  },

  async addImages(id, files) {
    const res = await productApi.addProductImages(id, files)
    if (!res.success) throw new Error(res.message)
    return res.data
  },

  async deleteImage(productId, imageId) {
    return productApi.deleteProductImage(productId, imageId)
  },
}