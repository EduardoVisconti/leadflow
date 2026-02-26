"use client"

import { useState } from "react"
import { ProductsTable } from "@/components/products/ProductsTable"
import { AddProductModal } from "@/components/products/AddProductModal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Product } from "@/types"

export default function ProductsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  function handleEdit(product: Product) {
    setEditingProduct(product)
    setModalOpen(true)
  }

  function handleClose() {
    setModalOpen(false)
    setEditingProduct(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground">Gerencie seu catálogo de produtos.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      <ProductsTable onEdit={handleEdit} />

      <AddProductModal
        open={modalOpen}
        onClose={handleClose}
        product={editingProduct}
      />
    </div>
  )
}
