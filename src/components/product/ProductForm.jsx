import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useCategories } from '../../hooks/useCategories'
import { Button, FormField, Input, Textarea, Select } from '../ui'

export default function ProductForm({ defaultValues, onSubmit, loading, submitLabel = 'Lưu' }) {
  const { categories, loading: catLoading, error: catError } = useCategories('PRODUCT')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues })

  useEffect(() => {
    if (defaultValues) reset(defaultValues)
  }, [defaultValues, reset])

  const handleFormSubmit = (data) => {
    const clean = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, v === '' ? undefined : v])
    )
    if (clean.categoryId) clean.categoryId = Number(clean.categoryId)
    if (clean.isActive !== undefined) clean.isActive = clean.isActive === 'true' || clean.isActive === true
    onSubmit(clean)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="grid grid-cols-2 gap-x-5">

        {/* Product Code — full width */}
        <div className="col-span-2">
          <FormField label="Mã sản phẩm" required error={errors.productCode?.message} hint="Chỉ chữ hoa, số, dấu gạch. VD: SP_001">
            <Input
              placeholder="VD: SP_001"
              error={errors.productCode}
              {...register('productCode', {
                required: 'Mã sản phẩm không được để trống',
                maxLength: { value: 50, message: 'Tối đa 50 ký tự' },
                pattern: { value: /^[A-Z0-9_-]+$/, message: 'Chỉ chứa chữ hoa, số, dấu gạch' },
              })}
            />
          </FormField>
        </div>

        {/* Name — full width */}
        <div className="col-span-2">
          <FormField label="Tên sản phẩm" required error={errors.name?.message}>
            <Input
              placeholder="VD: Áo thun cao cấp"
              error={errors.name}
              {...register('name', {
                required: 'Tên sản phẩm không được để trống',
                minLength: { value: 2, message: 'Tối thiểu 2 ký tự' },
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
        <FormField label="Trạng thái" error={errors.isActive?.message}>
          <Select error={errors.isActive} {...register('isActive')}>
            <option value="true">Hiển thị</option>
            <option value="false">Ẩn</option>
          </Select>
        </FormField>

        {/* Description — full width */}
        <div className="col-span-2">
          <FormField label="Mô tả sản phẩm" error={errors.description?.message}>
            <Textarea
              rows={5}
              placeholder="Mô tả chi tiết sản phẩm..."
              error={errors.description}
              {...register('description', { maxLength: { value: 5000, message: 'Tối đa 5000 ký tự' } })}
            />
          </FormField>
        </div>

      </div>

      <div className="flex gap-2.5 justify-end mt-2">
        <Button type="submit" loading={loading}>{submitLabel}</Button>
      </div>
    </form>
  )
}