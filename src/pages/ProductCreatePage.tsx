import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { productService } from '../services/productService'
import ProductForm from '../components/product/ProductForm'
import { PageTitle, Card, Button } from '../components/ui'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'

type ProductFormData = {
  name: string
  price: number
  description?: string
}

export default function ProductCreatePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: ProductFormData) => {
    setLoading(true)
    try {
      const created = await productService.create(data)
      toast.success('Tạo sản phẩm thành công!')
      navigate(`/admin/products/${created.id}`)
    } catch (err: unknown) {
      const error = err as AxiosError<any>
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        'Tạo sản phẩm thất bại'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageTitle
        title="Tạo sản phẩm"
        subtitle="Điền thông tin bên dưới để thêm sản phẩm mới"
        action={
          <Button
            variant="ghost"
            disabled={false}
            onClick={() => navigate('/admin/products')}
          >
            ← Quay lại
          </Button>
        }
      />

      <Card className="px-8 py-7 max-w-[860px]" style={{}}>
        <ProductForm
          defaultValues={{}}
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Tạo sản phẩm"
        />
      </Card>
    </div>
  )
}