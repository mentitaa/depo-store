'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, updateOrderStatus, createProduct, uploadProductImage, getProducts, deleteProduct } from '@/lib/supabase'
import type { Order, Product, Category } from '@/lib/types'
import { PackageCheck, Plus, LogOut, RefreshCw, Upload, X, Trash2 } from 'lucide-react'

const SIZES_OPTIONS = ['XS', 'S', 'M', 'L', 'XL']
const COLOR_OPTIONS = [
  { value: '#000000', label: 'Negro' },
  { value: '#ffffff', label: 'Blanco' },
  { value: '#C85880', label: 'Rosa' },
  { value: '#3B5998', label: 'Azul' },
  { value: '#8B4513', label: 'Marrón' },
  { value: '#228B22', label: 'Verde' },
  { value: '#FF6347', label: 'Rojo' },
  { value: '#FFD700', label: 'Dorado' },
]
const CATEGORIES: Category[] = ['vestidos', 'deportiva', 'casual']

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]
}

// ─── Add Product Form (right column) ─────────────────────────────────────────

function AddProductForm({ onAdded }: { onAdded: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formError, setFormError] = useState('')
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [form, setForm] = useState({ name: '', price: '', stock: '1' })
  const [categories, setCategories] = useState<string[]>([])
  const [sizes, setSizes] = useState<string[]>([])
  const [colors, setColors] = useState<string[]>([])

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    const remaining = 4 - imageFiles.length
    const toAdd = files.slice(0, remaining)
    setImageFiles(prev => [...prev, ...toAdd])
    setImagePreviews(prev => [...prev, ...toAdd.map(f => URL.createObjectURL(f))])
    if (fileRef.current) fileRef.current.value = ''
  }

  function removeImage(index: number) {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    setSuccess(false)
    if (sizes.length === 0) { setFormError('Selecciona al menos una talla.'); return }
    if (colors.length === 0) { setFormError('Selecciona al menos un color.'); return }

    if (categories.length === 0) { setFormError('Selecciona al menos una categoría.'); return }

    setLoading(true)
    try {
      // Step 1: upload images
      let imageUrls: string[] = []
      if (imageFiles.length > 0) {
        try {
          imageUrls = await Promise.all(imageFiles.map(f => uploadProductImage(f)))
        } catch (uploadErr) {
          console.error('[Admin] Error subiendo imágenes:', uploadErr)
          throw new Error(`Error subiendo imágenes: ${uploadErr instanceof Error ? uploadErr.message : String(uploadErr)}`)
        }
      }

      // Step 2: save product
      const payload = {
        name: form.name,
        category: categories,
        price: parseFloat(form.price),
        image_urls: imageUrls,
        stock: parseInt(form.stock),
        sizes,
        colors,
      }
      console.log('[Admin] Guardando producto:', payload)
      await createProduct(payload)

      // Reset form
      setForm({ name: '', price: '', stock: '1' })
      setCategories([])
      setSizes([])
      setColors([])
      setImageFiles([])
      setImagePreviews([])
      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)
    } catch (err: unknown) {
      console.error('[Admin] Error guardando producto:', err)
      setFormError(err instanceof Error ? err.message : `Error desconocido: ${String(err)}`)
    } finally {
      setLoading(false)
      onAdded()
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[#F0D4DC] p-5 flex flex-col gap-5 sticky top-6">
      <div className="flex items-center gap-2">
        <Plus size={16} className="text-[#C85880]" />
        <h2 className="text-sm font-bold text-[#180A10]">Nuevo producto</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Image upload — full width, 200px, previews in a row */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#180A10]/50 font-medium">
            Fotos del producto ({imagePreviews.length}/4)
          </label>
          <div
            className="w-full rounded-xl border-2 border-dashed border-[#F0D4DC] overflow-hidden"
            style={{ height: 200 }}
          >
            {imagePreviews.length > 0 ? (
              <div className="flex h-full gap-1.5 p-1.5">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative h-full flex-1 rounded-lg overflow-hidden bg-[#F0D4DC]" style={{ minWidth: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/90 flex items-center justify-center hover:bg-[#F0D4DC] transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
                {imagePreviews.length < 4 && (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="h-full flex-shrink-0 w-16 rounded-lg border-2 border-dashed border-[#F0D4DC] flex flex-col items-center justify-center gap-1 hover:border-[#C85880] transition-colors group"
                  >
                    <Upload size={14} className="text-[#180A10]/30 group-hover:text-[#C85880] transition-colors" />
                    <span className="text-[10px] text-[#180A10]/40 group-hover:text-[#C85880] transition-colors">+</span>
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full h-full flex flex-col items-center justify-center gap-2 hover:border-[#C85880] transition-colors group"
              >
                <Upload size={22} className="text-[#180A10]/30 group-hover:text-[#C85880] transition-colors" />
                <span className="text-xs text-[#180A10]/40 group-hover:text-[#C85880] transition-colors">
                  Subir fotos (hasta 4)
                </span>
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#180A10]/50 font-medium">Nombre</label>
          <input
            type="text" required
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            placeholder="Vestido floral primavera"
            className="px-3 py-2 rounded-xl border border-[#F0D4DC] text-sm focus:outline-none focus:border-[#C85880] bg-[#FFF8FA]"
          />
        </div>

        {/* Categories — checkboxes */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#180A10]/50 font-medium">Categoría</label>
          <div className="flex gap-2">
            {CATEGORIES.map(c => (
              <button
                key={c} type="button"
                onClick={() => setCategories(prev => toggle(prev, c))}
                className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                  categories.includes(c)
                    ? 'border-[#C85880] bg-[#C85880] text-white'
                    : 'border-[#F0D4DC] text-[#180A10] hover:border-[#C85880]'
                }`}
              >
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#180A10]/50 font-medium">Precio (S/)</label>
          <input
            type="number" required min="0" step="0.01"
            value={form.price}
            onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
            placeholder="89.90"
            className="px-3 py-2 rounded-xl border border-[#F0D4DC] text-sm focus:outline-none focus:border-[#C85880] bg-[#FFF8FA]"
          />
        </div>

        {/* Stock */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#180A10]/50 font-medium">Stock disponible</label>
          <input
            type="number" required min="0"
            value={form.stock}
            onChange={e => setForm(p => ({ ...p, stock: e.target.value }))}
            className="px-3 py-2 rounded-xl border border-[#F0D4DC] text-sm focus:outline-none focus:border-[#C85880] bg-[#FFF8FA]"
          />
        </div>

        {/* Sizes */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#180A10]/50 font-medium">Tallas</label>
          <div className="flex gap-2 flex-wrap">
            {SIZES_OPTIONS.map(s => (
              <button
                key={s} type="button"
                onClick={() => setSizes(prev => toggle(prev, s))}
                className={`px-3 py-1 rounded-lg border text-sm transition-colors ${
                  sizes.includes(s)
                    ? 'border-[#C85880] bg-[#C85880] text-white'
                    : 'border-[#F0D4DC] text-[#180A10] hover:border-[#C85880]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-[#180A10]/50 font-medium">Colores</label>
          <div className="flex gap-2 flex-wrap">
            {COLOR_OPTIONS.map(({ value, label }) => (
              <button
                key={value} type="button"
                onClick={() => setColors(prev => toggle(prev, value))}
                title={label}
                style={{
                  backgroundColor: value,
                  boxShadow: value === '#ffffff' ? 'inset 0 0 0 1px #e5c8d0' : undefined,
                }}
                className={`w-7 h-7 rounded-full border-2 transition-all ${
                  colors.includes(value)
                    ? 'border-[#C85880] scale-110'
                    : 'border-[#F0D4DC] hover:border-[#C85880]'
                }`}
              />
            ))}
          </div>
        </div>

        {formError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-xs font-semibold text-red-600 mb-0.5">Error</p>
            <p className="text-xs text-red-500 break-words">{formError}</p>
          </div>
        )}
        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3">
            <p className="text-xs font-semibold text-green-700">Producto guardado correctamente</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full bg-[#C85880] text-white font-semibold text-sm hover:bg-[#a8446a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Guardando…' : 'GUARDAR PRODUCTO'}
        </button>
      </form>
    </div>
  )
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Auth check — redirect to /admin/login if no session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace('/admin/login')
      } else {
        setCheckingAuth(false)
      }
    })
  }, [router])

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true)
    try {
      const { data } = await supabase
        .from('orders')
        .select('*, product:products(*)')
        .order('created_at', { ascending: false })
      setOrders((data as Order[]) ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingOrders(false)
    }
  }, [])

  const fetchProducts = useCallback(async () => {
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (err) {
      console.error(err)
    }
  }, [])

  async function handleDeleteProduct(id: string) {
    setDeletingId(id)
    try {
      await deleteProduct(id)
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error('[Admin] Error eliminando producto:', err)
    } finally {
      setDeletingId(null)
    }
  }

  // Load + realtime subscription
  useEffect(() => {
    if (checkingAuth) return
    fetchOrders()
    fetchProducts()

    const channel = supabase
      .channel('orders-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [checkingAuth, fetchOrders, fetchProducts])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.replace('/admin/login')
  }

  async function handleMarkSent(id: string) {
    await updateOrderStatus(id, 'enviado')
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'enviado' } : o))
  }

  if (checkingAuth) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#FFF8FA]">
        <div className="w-8 h-8 border-2 border-[#C85880] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const pendingCount = orders.filter(o => o.status === 'pendiente').length

  return (
    <div className="min-h-dvh bg-[#FFF8FA]">
      {/* Header */}
      <header className="bg-white border-b border-[#F0D4DC] px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <span
            className="text-xl tracking-[0.3em] text-[#180A10] select-none"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            DEPO
          </span>
          <span className="text-[11px] text-[#180A10]/40 border border-[#F0D4DC] rounded-full px-2 py-0.5">
            Admin
          </span>
          {pendingCount > 0 && (
            <span className="text-[11px] bg-[#C85880] text-white rounded-full px-2 py-0.5 font-bold">
              {pendingCount} pendiente{pendingCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-[#180A10]/50 hover:text-[#C85880] transition-colors"
        >
          <LogOut size={15} />
          Cerrar sesión
        </button>
      </header>

      {/* Two-column layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

        {/* ── LEFT: Orders ──────────────────────────────────── */}
        <div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Total pedidos', value: orders.length },
              { label: 'Pendientes',    value: pendingCount,                                    highlight: pendingCount > 0 },
              { label: 'Enviados',      value: orders.filter(o => o.status === 'enviado').length },
            ].map(stat => (
              <div
                key={stat.label}
                className={`bg-white rounded-2xl border p-4 ${stat.highlight ? 'border-[#C85880]' : 'border-[#F0D4DC]'}`}
              >
                <p className="text-2xl font-bold text-[#180A10]">{stat.value}</p>
                <p className="text-xs text-[#180A10]/50 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Orders header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#180A10]">Pedidos en tiempo real</h2>
            <button
              onClick={fetchOrders}
              disabled={loadingOrders}
              className="flex items-center gap-1.5 text-xs text-[#180A10]/50 hover:text-[#C85880] transition-colors"
            >
              <RefreshCw size={13} className={loadingOrders ? 'animate-spin' : ''} />
              Actualizar
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#F0D4DC] p-12 text-center text-[#180A10]/40 text-sm">
              No hay pedidos aún.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {orders.map(order => (
                <div
                  key={order.id}
                  className={`bg-white rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center gap-3 transition-opacity ${
                    order.status === 'enviado' ? 'opacity-50 border-[#F0D4DC]' : 'border-[#F0D4DC]'
                  }`}
                >
                  {/* Badge */}
                  <span className={`self-start px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide flex-shrink-0 ${
                    order.status === 'pendiente'
                      ? 'bg-[#FFF0F4] text-[#C85880] border border-[#C85880]'
                      : 'bg-[#F0D4DC] text-[#180A10]/50'
                  }`}>
                    {order.status}
                  </span>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#180A10]">{order.customer_name}</p>
                    <p className="text-xs text-[#180A10]/50 mt-0.5">
                      {(order.product as Product | undefined)?.name ?? '—'} — Talla {order.size}
                    </p>
                    <p className="text-xs text-[#180A10]/40 mt-0.5 line-clamp-1">{order.address}</p>
                    <p className="text-xs text-[#180A10]/40">{order.phone}</p>
                  </div>

                  {/* Date */}
                  <p className="text-[11px] text-[#180A10]/30 flex-shrink-0">
                    {new Date(order.created_at).toLocaleDateString('es-PE', {
                      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>

                  {order.status === 'pendiente' && (
                    <button
                      onClick={() => handleMarkSent(order.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C85880] text-white text-xs font-semibold hover:bg-[#a8446a] transition-colors flex-shrink-0"
                    >
                      <PackageCheck size={13} />
                      Marcar enviado
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: Add product form + product list ────────── */}
        <div className="flex flex-col gap-6">
          <AddProductForm onAdded={() => { fetchOrders(); fetchProducts() }} />

          {/* Mis productos */}
          <div className="bg-white rounded-2xl border border-[#F0D4DC] p-5 flex flex-col gap-4">
            <h2 className="text-sm font-bold text-[#180A10]">Mis productos ({products.length})</h2>
            {products.length === 0 ? (
              <p className="text-xs text-[#180A10]/40 text-center py-4">No hay productos cargados.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {products.map(p => (
                  <div key={p.id} className="flex items-center gap-3 border border-[#F0D4DC] rounded-xl p-2">
                    {/* Thumbnail */}
                    <div className="w-12 h-14 rounded-lg overflow-hidden bg-[#FFF8FA] flex-shrink-0 flex items-center justify-center">
                      {p.image_urls?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.image_urls[0]} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl">👗</span>
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#180A10] line-clamp-1">{p.name}</p>
                      <p className="text-xs text-[#C85880] font-bold">S/ {p.price.toFixed(2)}</p>
                      <p className="text-[10px] text-[#180A10]/40">{(Array.isArray(p.category) ? p.category : [p.category].filter(Boolean)).join(', ')}</p>
                    </div>
                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      disabled={deletingId === p.id}
                      className="p-1.5 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors flex-shrink-0 disabled:opacity-40"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
