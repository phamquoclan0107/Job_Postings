import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCategories } from '../../hooks/useCategories'
import { Button, FormField, Input, Textarea, Select } from '../ui'

export default function JobForm({ defaultValues, onSubmit, loading, submitLabel = 'Lưu' }) {
  const { categories, loading: catLoading, error: catError } = useCategories('JOB')
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({ defaultValues })

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues)
    }
  }, [defaultValues, reset])

  const handleFormSubmit = (data) => {
    const min = data.salaryMin ? Number(data.salaryMin) : null
    const max = data.salaryMax ? Number(data.salaryMax) : null
    if (min !== null && max !== null && min > max) {
      setError('salaryMax', { type: 'manual', message: 'Lương tối đa phải >= lương tối thiểu' })
      return
    }
    clearErrors('salaryMax')

    const clean = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, v === '' ? undefined : v])
    )
    if (clean.categoryId) clean.categoryId = Number(clean.categoryId)
    if (clean.salaryMin)  clean.salaryMin  = Number(clean.salaryMin)
    if (clean.salaryMax)  clean.salaryMax  = Number(clean.salaryMax)

    onSubmit(clean)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="grid grid-cols-2 gap-x-5">

        {/* Title — full width */}
        <div className="col-span-2">
          <FormField label="Tiêu đề công việc" required error={errors.title?.message}>
            <Input
              placeholder="Ví dụ: Senior React Developer"
              error={errors.title}
              {...register('title', {
                required: 'Tiêu đề không được để trống',
                minLength: { value: 5, message: 'Tối thiểu 5 ký tự' },
                maxLength: { value: 200, message: 'Tối đa 200 ký tự' },
              })}
            />
          </FormField>
        </div>

        {/* Company Name */}
        <div className="col-span-2">
          <FormField label="Tên công ty" error={errors.companyName?.message}>
            <Input
              placeholder="Ví dụ: Công ty Dược phẩm FreMed"
              error={errors.companyName}
              {...register('companyName', {
                maxLength: { value: 200, message: 'Tối đa 200 ký tự' },
              })}
            />
          </FormField>
        </div>

        {/* Category */}
        <FormField label="Danh mục" required error={catError || errors.categoryId?.message}>
          <Select
            error={catError || errors.categoryId}
            disabled={catLoading}
            {...register('categoryId', { required: 'Vui lòng chọn danh mục' })}
          >
            {catLoading
              ? <option value="">Đang tải danh mục...</option>
              : catError
                ? <option value="">Lỗi tải danh mục — thử lại</option>
                : <>
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                    {categories.length === 0 && (
                      <option disabled value="">Chưa có danh mục nào</option>
                    )}
                  </>
            }
          </Select>
        </FormField>

        {/* Status */}
        <FormField label="Trạng thái" required error={errors.status?.message}>
          <Select error={errors.status} {...register('status', { required: 'Vui lòng chọn trạng thái' })}>
            <option value="">-- Chọn trạng thái --</option>
            <option value="ACTIVE">Đang tuyển (ACTIVE)</option>
            <option value="CLOSED">Đã đóng (CLOSED)</option>
          </Select>
        </FormField>

        {/* Job Type */}
        <FormField label="Hình thức làm việc" error={errors.jobType?.message}>
          <Select error={errors.jobType} {...register('jobType')}>
            <option value="">-- Chọn hình thức --</option>
            <option value="FULL_TIME">Toàn thời gian</option>
            <option value="PART_TIME">Bán thời gian</option>
            <option value="CONTRACT">Hợp đồng</option>
            <option value="REMOTE">Làm từ xa (Remote)</option>
            <option value="INTERNSHIP">Thực tập</option>
          </Select>
        </FormField>

        {/* Experience Level */}
        <FormField label="Cấp độ kinh nghiệm" error={errors.experienceLevel?.message}>
          <Select error={errors.experienceLevel} {...register('experienceLevel')}>
            <option value="">-- Chọn cấp độ --</option>
            <option value="FRESHER">Fresher (chưa có kinh nghiệm)</option>
            <option value="JUNIOR">Junior (1-2 năm)</option>
            <option value="MID">Mid-level (2-4 năm)</option>
            <option value="SENIOR">Senior (4+ năm)</option>
            <option value="LEAD">Lead / Manager</option>
          </Select>
        </FormField>

        {/* Salary Min */}
        <FormField label="Lương tối thiểu (VNĐ)" error={errors.salaryMin?.message} hint="Để trống nếu thỏa thuận">
          <Input
            type="number" placeholder="Ví dụ: 10000000" min="0"
            error={errors.salaryMin}
            {...register('salaryMin', { min: { value: 0, message: 'Không được âm' } })}
          />
        </FormField>

        {/* Salary Max */}
        <FormField label="Lương tối đa (VNĐ)" error={errors.salaryMax?.message}>
          <Input
            type="number" placeholder="Ví dụ: 20000000" min="0"
            error={errors.salaryMax}
            {...register('salaryMax', { min: { value: 0, message: 'Không được âm' } })}
          />
        </FormField>

        {/* Salary Type */}
        <FormField label="Loại lương" error={errors.salaryType?.message}>
          <Select error={errors.salaryType} {...register('salaryType')}>
            <option value="">-- Chọn loại lương --</option>
            <option value="GROSS">Gross</option>
            <option value="NET">Net</option>
            <option value="NEGOTIATE">Thỏa thuận</option>
          </Select>
        </FormField>

        {/* Location */}
        <FormField label="Địa điểm" error={errors.location?.message}>
          <Input
            placeholder="Ví dụ: Hà Nội, TP.HCM, Remote"
            error={errors.location}
            {...register('location', { maxLength: { value: 200, message: 'Tối đa 200 ký tự' } })}
          />
        </FormField>

        {/* Contact Email — required, dùng job.contactEmail thay vì hardcode */}
        <FormField label="Email liên hệ" required error={errors.contactEmail?.message}
          hint="Email này hiển thị cho ứng viên để nộp hồ sơ">
          <Input
            type="email"
            placeholder="Ví dụ: hr@company.com"
            error={errors.contactEmail}
            {...register('contactEmail', {
              required: 'Email liên hệ không được để trống',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Email không đúng định dạng',
              },
              maxLength: { value: 255, message: 'Tối đa 255 ký tự' },
            })}
          />
        </FormField>

        {/* ExpiresAt */}
        <FormField label="Ngày hết hạn" error={errors.expiresAt?.message} hint="Phải là ngày trong tương lai">
          <Input type="date" error={errors.expiresAt} {...register('expiresAt')} />
        </FormField>

        {/* Description */}
        <div className="col-span-2">
          <FormField label="Mô tả công việc" error={errors.description?.message}>
            <Textarea
              rows={5}
              placeholder="Mô tả chi tiết về vị trí công việc..."
              error={errors.description}
              {...register('description', { maxLength: { value: 5000, message: 'Tối đa 5000 ký tự' } })}
            />
          </FormField>
        </div>

        {/* Requirements */}
        <div className="col-span-2">
          <FormField label="Yêu cầu ứng viên" error={errors.requirements?.message}>
            <Textarea
              rows={4}
              placeholder="Ví dụ: Tốt nghiệp Đại học, 2+ năm kinh nghiệm React..."
              error={errors.requirements}
              {...register('requirements')}
            />
          </FormField>
        </div>

        {/* Benefits */}
        <div className="col-span-2">
          <FormField label="Quyền lợi" error={errors.benefits?.message}>
            <Textarea
              rows={4}
              placeholder="Ví dụ: Thưởng tháng 13, Bảo hiểm sức khỏe, Du lịch hàng năm..."
              error={errors.benefits}
              {...register('benefits')}
            />
          </FormField>
        </div>

      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div className="flex gap-2.5 justify-end mt-2">
        <Button type="submit" loading={loading}>{submitLabel}</Button>
      </div>
    </form>
  )
}