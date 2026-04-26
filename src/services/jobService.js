// src/services/jobService.js
import * as jobApi from '../api/jobApi'

export const jobService = {
  async search(params = {}) {
    const res = await jobApi.getAllJobs(params)
    if (!res.success) throw new Error(res.message)
    return res.data
  },

  async getById(id) {
    const res = await jobApi.getJobById(id)
    if (!res.success) throw new Error(res.message)
    return res.data
  },

  async getSimilar(id, limit = 4) {
    const res = await jobApi.getSimilarJobs(id, limit)
    if (!res.success) throw new Error(res.message)
    return res.data
  },

  async create(payload) {
    const res = await jobApi.createJob(payload)
    if (!res.success) throw new Error(res.message)
    return res.data
  },

  async update(id, payload) {
    const res = await jobApi.updateJob(id, payload)
    if (!res.success) throw new Error(res.message)
    return res.data
  },

  async delete(id) {
    return jobApi.deleteJob(id)
  },
}