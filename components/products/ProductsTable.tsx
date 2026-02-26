"use client"

import { useState } from "react"
import { useProducts, useDeleteProduct } from "@/lib/hooks/useProducts"
import { formatCurrency } from "@/lib/utils/currency"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, Search } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Product } from "@/types"

interface ProductsTableProps {
  onEdit: (product: Product) => void
}

const CATEGORIES = [
  "iPhone",
  "Samsung",
  "Xiaomi",
  "Motorola",
  "Acessórios",
  "Outros",
]

export function ProductsTable({ onEdit }: ProductsTableProps) {
  const { data: products, isLoading } = useProducts()
  const deleteProduct = useDeleteProduct()
  const { toast } = useToast()
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = products?.filter((p) => {
    const term = search.toLowerCase()
    const matchesSearch =
      p.name.toLowerCase().includes(term) ||
      (p.brand?.toLowerCase().includes(term) ?? false) ||
      (p.sku?.toLowerCase().includes(term) ?? false)

    const matchesCategory =
      categoryFilter === "all" || p.category === categoryFilter

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && p.active) ||
      (statusFilter === "inactive" && !p.active)

    return matchesSearch && matchesCategory && matchesStatus
  })

  async function handleDelete(id: string) {
    try {
      await deleteProduct.mutateAsync(id)
      toast({ title: "Produto excluído" })
    } catch {
      toast({ title: "Erro ao excluir produto", variant: "destructive" })
    }
  }

  function getStockBadge(stock: number) {
    if (stock === 0) {
      return <Badge variant="destructive">0</Badge>
    }
    if (stock <= 5) {
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">{stock}</Badge>
    }
    return <Badge className="bg-green-600 hover:bg-green-700">{stock}</Badge>
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar produtos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas categorias</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {!filtered?.length ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {search || categoryFilter !== "all" || statusFilter !== "all"
                    ? "Nenhum produto encontrado com os filtros aplicados."
                    : "Nenhum produto cadastrado. Adicione os modelos que você vende."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {product.brand || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {product.category || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatCurrency(product.price)}
                  </TableCell>
                  <TableCell>{getStockBadge(product.stock)}</TableCell>
                  <TableCell>
                    <Badge variant={product.active ? "default" : "secondary"}>
                      {product.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(product)}>
                          <Pencil className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
