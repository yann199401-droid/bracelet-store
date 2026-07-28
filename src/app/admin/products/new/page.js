import ProductForm from '@/components/admin/ProductForm'

export const metadata = {
  title: '新增产品',
}

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">新增产品</h1>
      <ProductForm />
    </div>
  )
}
