"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { productSchema, type ProductFormValues } from "@/lib/validations/product.schema"
import { useCreateProduct, useUpdateProduct } from "@/lib/hooks/useProducts"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import type { Product } from "@/types"

interface AddProductModalProps {
  open: boolean
  onClose: () => void
  product?: Product | null
}

const CATEGORIES = [
  "iPhone",
  "Samsung",
  "Xiaomi",
  "Motorola",
  "Acessórios",
  "Outros",
]

export function AddProductModal({ open, onClose, product }: AddProductModalProps) {
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const { toast } = useToast()
  const isEditing = !!product

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      brand: product?.brand ?? "",
      category: product?.category ?? "",
      price: product?.price ?? null,
      stock: product?.stock ?? 0,
      sku: product?.sku ?? "",
      description: product?.description ?? "",
      active: product?.active ?? true,
    },
  })

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name ?? "",
        brand: product.brand ?? "",
        category: product.category ?? "",
        price: product.price ?? null,
        stock: product.stock ?? 0,
        sku: product.sku ?? "",
        description: product.description ?? "",
        active: product.active ?? true,
      })
    } else {
      form.reset({
        name: "",
        brand: "",
        category: "",
        price: null,
        stock: 0,
        sku: "",
        description: "",
        active: true,
      })
    }
  }, [product, form])

  const loading = createProduct.isPending || updateProduct.isPending

  async function onSubmit(values: ProductFormValues) {
    try {
      if (isEditing && product) {
        await updateProduct.mutateAsync({ id: product.id, ...values })
        toast({ title: "Produto atualizado" })
      } else {
        await createProduct.mutateAsync(values)
        toast({ title: "Produto criado" })
      }
      form.reset()
      onClose()
    } catch {
      toast({ title: "Erro ao salvar produto", variant: "destructive" })
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Produto" : "Novo Produto"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Atualize os detalhes do produto."
              : "Adicione um novo produto ao seu catálogo."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input id="name" {...form.register("name")} placeholder="Ex: iPhone 15 Pro Max" />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Marca</Label>
              <Input id="brand" {...form.register("brand")} placeholder="Ex: Apple" />
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select
                value={form.watch("category") ?? "none"}
                onValueChange={(v) => form.setValue("category", v === "none" ? null : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Não especificado</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Preço</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                {...form.register("price")}
                placeholder="0,00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Estoque</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                {...form.register("stock")}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" {...form.register("sku")} placeholder="Ex: IP15PM-256" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Detalhes do produto..."
              rows={3}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              className="h-4 w-4 rounded border-gray-300"
              checked={form.watch("active") ?? true}
              onChange={(e) => form.setValue("active", e.target.checked)}
            />
            <Label htmlFor="active" className="cursor-pointer">
              Produto ativo
            </Label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
