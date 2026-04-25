// src/services/categoryService.js
import * as categoryApi from '../api/categoryApi'

export const categoryService = {
  /** Lấy tất cả categories, có thể lọc theo type: "JOB" | "PRODUCT" */
  async getAll(type) {
    const res = await categoryApi.getAllCategories(type)
    return res.data // List<CategoryDTO.Response>
  },

  async getById(id) {
    const res = await categoryApi.getCategoryById(id)
    return res.data
  },

  async create(payload) {
    const res = await categoryApi.createCategory(payload)
    return res.data
  },

  async update(id, payload) {
    const res = await categoryApi.updateCategory(id, payload)
    return res.data
  },

  async delete(id) {
    return categoryApi.deleteCategory(id)
  },
}
