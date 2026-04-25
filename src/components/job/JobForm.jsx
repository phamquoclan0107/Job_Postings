// src/components/job/JobForm.jsx
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useCategories } from '../../hooks/useCategories'
import { Button, FormField, Input, Textarea, Select } from '../ui'

/**
 * Shared form for create & update job.
 * @param {Object}   defaultValues - for update, pre-fill fields
 * @param {Function} onSubmit(data) - called with validated data
 * @param {boolean}  loading
 * @param {string}   submitLabel
 */
export default function JobForm({ defaultValues, onSubmit, loading, submitLabel = 'Lưu' }) {
  const { categories } = useCategories('JOB')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues })

  // Sync default values when editing
  useEffect(() => {
    if (defaultValues) reset(defaultValues)
  }, [defaultValues, reset])

  const handleFormSubmit = (data) => {
    // strip empty strings → undefined so backend ignores them on update
    const clean = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, v === '' ? undefined : v])
    )
    // convert numeric fields
    if (clean.categoryId) clean.categoryId = Number(clean.categoryId)
    if (clean.salary) clean.salary = Number(clean.salary)
    onSubmit(clean)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div style={gridStyle}>
        {/* Title */}
        <FormField label="Tiêu đề công việc" required error={errors.title?.message} style={{ gridColumn: '1/-1' }}>
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

        {/* Category */}
        <FormField label="Danh mục" required error={errors.categoryId?.message}>
          <Select
            error={errors.categoryId}
            {...register('categoryId', { required: 'Vui lòng chọn danh mục' })}
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>
        </FormField>

        {/* Status */}
        <FormField label="Trạng thái" required error={errors.status?.message}>
          <Select
            error={errors.status}
            {...register('status', { required: 'Vui lòng chọn trạng thái' })}
          >
            <option value="">-- Chọn trạng thái --</option>
            <option value="ACTIVE">Đang tuyển (ACTIVE)</option>
            <option value="CLOSED">Đã đóng (CLOSED)</option>
          </Select>
        </FormField>

        {/* Salary */}
        <FormField label="Mức lương (VNĐ)" error={errors.salary?.message} hint="Để trống nếu thỏa thuận">
          <Input
            type="number"
            placeholder="Ví dụ: 20000000"
            min="0"
            error={errors.salary}
            {...register('salary')}
          />
        </FormField>

        {/* Location */}
        <FormField label="Địa điểm" error={errors.location?.message}>
          <Input
            placeholder="Ví dụ: Hà Nội, TP.HCM, Remote"
            error={errors.location}
            {...register('location', {
              maxLength: { value: 200, message: 'Tối đa 200 ký tự' },
            })}
          />
        </FormField>

        {/* ExpiresAt */}
        <FormField label="Ngày hết hạn" error={errors.expiresAt?.message} hint="Phải là ngày trong tương lai">
          <Input
            type="date"
            error={errors.expiresAt}
            {...register('expiresAt')}
          />
        </FormField>

        {/* Image URL */}
        <FormField label="URL hình ảnh" error={errors.imageUrl?.message} style={{ gridColumn: '1/-1' }}>
          <Input
            placeholder="https://..."
            error={errors.imageUrl}
            {...register('imageUrl', {
              maxLength: { value: 500, message: 'Tối đa 500 ký tự' },
            })}
          />
        </FormField>

        {/* Description */}
        <FormField label="Mô tả công việc" error={errors.description?.message} style={{ gridColumn: '1/-1' }}>
          <Textarea
            rows={6}
            placeholder="Mô tả chi tiết về vị trí, yêu cầu, quyền lợi..."
            error={errors.description}
            {...register('description', {
              maxLength: { value: 5000, message: 'Tối đa 5000 ký tự' },
            })}
          />
        </FormField>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
        <Button type="submit" loading={loading}>{submitLabel}</Button>
      </div>
    </form>
  )
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '0 20px',
}
