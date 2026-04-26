import * as categoryApi from "../api/categoryApi"

const normalize = (payload) => ({
  ...payload,
  type: payload.type?.trim().toUpperCase(),
})

export const categoryService = {
  async getAll(type) {
    const res = await categoryApi.getAllCategories(type)
    return res.data
  },

  async getById(id) {
    const res = await categoryApi.getCategoryById(id)
    return res.data
  },

  async create(payload) {
    const res = await categoryApi.createCategory(normalize(payload))
    return res.data
  },

  async update(id, payload) {
    const res = await categoryApi.updateCategory(id, normalize(payload))
    return res.data
  },

  async delete(id) {
    return categoryApi.deleteCategory(id)
  },
}