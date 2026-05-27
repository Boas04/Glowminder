import { useState } from 'react'
import { useCategories } from '../../hooks/useCategories'
import { useBrands } from '../../hooks/useBrands'

export default function DataManagementModal({ onClose }) {
  const [tab, setTab] = useState('categories')
  const { categories, addCategory, removeCategory } = useCategories()
  const { brands, addBrand, removeBrand } = useBrands()

  const [catName, setCatName] = useState('')
  const [brandName, setBrandName] = useState('')
  const [brandCountry, setBrandCountry] = useState('')

  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!catName.trim()) return
    await addCategory(catName)
    setCatName('')
  }

  const handleAddBrand = async (e) => {
    e.preventDefault()
    if (!brandName.trim() || !brandCountry.trim()) return
    await addBrand({ name: brandName, country: brandCountry })
    setBrandName('')
    setBrandCountry('')
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(30,10,20,0.35)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem', animation: 'fadeIn 0.2s ease',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'rgba(255,255,255,0.97)',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem', width: '100%', maxWidth: 480,
        maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 24px 80px rgba(232,64,113,0.18)',
        border: '1px solid rgba(255,179,198,0.35)',
        animation: 'fadeInUp 0.3s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: '1.25rem', color: 'var(--pink-700)' }}>
            ⚙️ Kelola Data Master
          </h2>
          <button onClick={onClose} style={{
            width: 32, height: 32, border: 'none',
            background: 'var(--pink-50)', borderRadius: '50%',
            cursor: 'pointer', fontSize: 14, color: 'var(--pink-400)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'var(--transition)',
          }}>✕</button>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: '1rem', borderBottom: '1px solid var(--gray-200)', paddingBottom: 10 }}>
          <button onClick={() => setTab('categories')} style={{
            background: tab === 'categories' ? 'var(--pink-100)' : 'transparent',
            border: 'none', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)',
            color: tab === 'categories' ? 'var(--pink-700)' : 'var(--gray-500)',
            fontWeight: 600, cursor: 'pointer'
          }}>Kategori</button>
          <button onClick={() => setTab('brands')} style={{
            background: tab === 'brands' ? 'var(--pink-100)' : 'transparent',
            border: 'none', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)',
            color: tab === 'brands' ? 'var(--pink-700)' : 'var(--gray-500)',
            fontWeight: 600, cursor: 'pointer'
          }}>Brand</button>
        </div>

        {tab === 'categories' && (
          <div>
            <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: 10, marginBottom: '1rem' }}>
              <input className="input" value={catName} onChange={e => setCatName(e.target.value)} placeholder="Nama kategori baru..." required />
              <button className="btn-primary" type="submit">Tambah</button>
            </form>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {categories.map(c => (
                <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
                  <span>{c.name}</span>
                  <button onClick={() => removeCategory(c.id)} style={{ border: 'none', background: 'transparent', color: 'red', cursor: 'pointer' }}>Hapus</button>
                </li>
              ))}
              {categories.length === 0 && <li style={{ color: 'var(--gray-400)', fontSize: 14 }}>Belum ada kategori.</li>}
            </ul>
          </div>
        )}

        {tab === 'brands' && (
          <div>
            <form onSubmit={handleAddBrand} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1rem' }}>
              <input className="input" value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="Nama brand..." required />
              <div style={{ display: 'flex', gap: 10 }}>
                <input className="input" value={brandCountry} onChange={e => setBrandCountry(e.target.value)} placeholder="Negara asal..." required />
                <button className="btn-primary" type="submit">Tambah</button>
              </div>
            </form>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {brands.map(b => (
                <li key={b.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
                  <span>{b.name} <small style={{ color: 'var(--gray-400)' }}>({b.country})</small></span>
                  <button onClick={() => removeBrand(b.id)} style={{ border: 'none', background: 'transparent', color: 'red', cursor: 'pointer' }}>Hapus</button>
                </li>
              ))}
              {brands.length === 0 && <li style={{ color: 'var(--gray-400)', fontSize: 14 }}>Belum ada brand.</li>}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
