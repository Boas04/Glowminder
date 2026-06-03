// pages/ProductsPage.jsx
import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../hooks/useCategories'
import { useBrands } from '../hooks/useBrands'
import ProductCard from '../components/features/ProductCard'
import ProductModal from '../components/features/ProductModal'
import DataManagementModal from '../components/features/DataManagementModal'

export default function ProductsPage() {
  const { products, loading, addProduct, updateProduct, removeProduct, classifyProduct } = useProducts()
  const { categories } = useCategories()
  const { brands } = useBrands()

  const [modal,  setModal]  = useState(null) // null | 'add' | product object | 'manage_data'
  const [filter, setFilter] = useState({ time: 'all', category_id: 'all', stock: 'all', search: '' })

  const filtered = products.filter(p => {
    const inStock = p.in_stock !== false
    if (filter.time !== 'all' && p.usage_time !== filter.time) return false
    if (filter.category_id !== 'all' && String(p.category_id) !== String(filter.category_id)) return false
    if (filter.stock === 'in_stock' && !inStock)  return false
    if (filter.stock === 'out'      && inStock)   return false
    
    // safe brand matching if we map brand id to name
    const brandName = brands.find(b => b.id === p.brand_id)?.name || ''
    if (filter.search && !`${p.name} ${brandName}`.toLowerCase().includes(filter.search.toLowerCase())) return false
    return true
  })

  const handleSave = async (form) => {
    if (form.id) await updateProduct(form.id, form)
    else         await addProduct(form)
  }

  const hasFilter = filter.time !== 'all' || filter.category_id !== 'all' || filter.stock !== 'all' || filter.search

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.75rem', animation: 'fadeInUp 0.4s ease', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontStyle: 'italic', fontWeight: 400, color: 'var(--gray-900)' }}>
            🧴 Produk Saya
          </h1>
          <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem', marginTop: 2 }}>
            {products.length} produk tersimpan
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn-ghost" onClick={() => setModal('manage_data')}>
            ⚙️ Kelola Master
          </button>
          <button className="btn-primary" onClick={() => setModal('add')}>
            ➕ Tambah Produk
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.65rem', alignItems: 'center' }}>
        {/* Search */}
        <input
          className="input"
          placeholder="🔍 Cari nama atau brand..."
          value={filter.search}
          onChange={e => setFilter({ ...filter, search: e.target.value })}
          style={{ width: 220, flex: '1 1 180px' }}
        />

        {/* Waktu */}
        <div className="select-wrapper" style={{ flex: '1 1 140px' }}>
          <select
            className="input"
            value={filter.time}
            onChange={e => setFilter({ ...filter, time: e.target.value })}
          >
            <option value="all">Semua Waktu</option>
            <option value="morning">🌅 Pagi</option>
            <option value="night">🌙 Malam</option>
            <option value="special_treatment">✨ Khusus</option>
          </select>
        </div>

        {/* Kategori */}
        <div className="select-wrapper" style={{ flex: '1 1 160px' }}>
          <select
            className="input"
            value={filter.category_id}
            onChange={e => setFilter({ ...filter, category_id: e.target.value })}
          >
            <option value="all">Semua Kategori</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Stok */}
        <div className="select-wrapper" style={{ flex: '1 1 130px' }}>
          <select
            className="input"
            value={filter.stock}
            onChange={e => setFilter({ ...filter, stock: e.target.value })}
          >
            <option value="all">Semua Stok</option>
            <option value="in_stock">✅ Tersedia</option>
            <option value="out">❌ Habis</option>
          </select>
        </div>

        {hasFilter && (
          <button
            className="btn-ghost"
            onClick={() => setFilter({ time: 'all', category_id: 'all', stock: 'all', search: '' })}
            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
          >
            ✕ Reset
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="card" style={{ padding: '1.25rem', height: 190 }}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 12 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ height: 14, marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 10, width: '55%' }} />
                </div>
              </div>
              <div className="skeleton" style={{ height: 10, marginBottom: 6 }} />
              <div className="skeleton" style={{ height: 10, width: '70%' }} />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--gray-400)' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🌸</div>
          <div style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--gray-600)' }}>
            {products.length === 0 ? 'Belum ada produk' : 'Tidak ada produk yang cocok'}
          </div>
          <div style={{ fontSize: '0.875rem', marginTop: 4 }}>
            {products.length === 0 ? 'Tambahkan produk skincare pertamamu!' : 'Coba ubah filter pencarian'}
          </div>
          {products.length === 0 && (
            <button className="btn-primary" onClick={() => setModal('add')} style={{ marginTop: '1.5rem' }}>
              ➕ Tambah Produk Pertama
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {filtered.map(p => {
             const pBrand = brands.find(b => b.id === p.brand_id)
             const pCat = categories.find(c => c.id === p.category_id)
             return (
              <ProductCard
                key={p.id} product={p} brand={pBrand} category={pCat}
                onEdit={prod => setModal(prod)}
                onDelete={removeProduct}
                onClassify={classifyProduct}
              />
             )
          })}
        </div>
      )}

      {modal === 'manage_data' && (
        <DataManagementModal onClose={() => setModal(null)} />
      )}
      
      {modal && modal !== 'manage_data' && (
        <ProductModal
          product={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
