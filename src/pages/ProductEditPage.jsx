import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productService } from '../services/productService'
import ProductForm from '../components/product/ProductForm'
import { PageTitle, Card, Button, Spinner } from '../components/ui'
import toast from 'react-hot-toast'

export default function ProductEditPage() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const [product, setProduct]   = useState(null)
  const [fetching, setFetching] = useState(true)
  const [saving, setSaving]     = useState(false)
  const [fetchErr, setFetchErr] = useState(null)

  useEffect(() => {
    productService.getById(id)
      .then((data) => { setProduct(data); setFetching(false) })
      .catch((err) => { setFetchErr(err?.response?.data?.message || 'Không tải được dữ liệu'); setFetching(false) })
  }, [id])

  const handleSubmit = async (data) => {
    setSaving(true)
    try {
      await productService.update(id, data)
      toast.success('Cập nhật sản phẩm thành công!')
      navigate(`/admin/products/${id}`)
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || 'Cập nhật thất bại')
    } finally {
      setSaving(false)
    }
  }

  const defaultValues = useMemo(() => {
    if (!product) return undefined
    return {
      id:           product.id,
      productCode:  product.productCode  || '',
      name:         product.name         || '',
      categoryId:   product.categoryId   != null ? String(product.categoryId) : '',
      description:  product.description  || '',
      isActive:     product.isActive !== undefined ? String(product.isActive) : 'true',
      images:       product.images       || [],
    }
  }, [product])

  return (
    <div>
      <PageTitle
        title="Chỉnh sửa sản phẩm"
        subtitle={product ? `#${product.id} · ${product.name}` : ''}
        action={
          <div className="flex gap-2.5">
            <Button variant="ghost" onClick={() => navigate(`/admin/products/${id}`)}>← Chi tiết</Button>
            <Button variant="ghost" onClick={() => navigate('/admin/products')}>Danh sách</Button>
          </div>
        }
      />
      <Card className="px-8 py-7 max-w-[860px]">
        {fetching ? (
          <div className="flex justify-center py-10"><Spinner size={32} /></div>
        ) : fetchErr ? (
          <p className="text-red text-sm">{fetchErr}</p>
        ) : (
          <ProductForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            loading={saving}
            submitLabel="Lưu thay đổi"
          />
        )}
      </Card>
    </div>
  )
}