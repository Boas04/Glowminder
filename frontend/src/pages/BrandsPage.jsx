// pages/BrandsPage.jsx
import { useState } from 'react'
import { useBrands } from '../hooks/useBrands'

export default function BrandsPage() {
  const { brands, addBrand, removeBrand } = useBrands()
  const [brandName, setBrandName] = useState('')
  const [brandCountry, setBrandCountry] = useState('')

  const handleAddBrand = async (e) => {
    e.preventDefault()
    if (!brandName.trim() || !brandCountry.trim()) return
    await addBrand({ name: brandName, country: brandCountry })
    setBrandName('')
    setBrandCountry('')
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: '1.75rem', animation: 'fadeInUp 0.4s ease' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontStyle: 'italic', fontWeight: 400, color: 'var(--gray-900)' }}>
          🏢 Kelola Brand
        </h1>
        <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem', marginTop: 2 }}>
          Atur daftar brand (merek) produk skincare Anda.
        </p>
      </div>

      <div className="card" style={{ padding: '2rem', animation: 'fadeInUp 0.5s ease' }}>
        <form onSubmit={handleAddBrand} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '2rem' }}>
          <input className="input" value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="Nama brand..." required />
          <div style={{ display: 'flex', gap: 10 }}>
            <input className="input" value={brandCountry} onChange={e => setBrandCountry(e.target.value)} placeholder="Negara asal..." required style={{ flex: 1 }} />
            <button className="btn-primary" type="submit" style={{ whiteSpace: 'nowrap' }}>➕ Tambah Brand</button>
          </div>
        </form>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {brands.map(b => (
            <li key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
              <span>
                <span style={{ fontWeight: 500, color: 'var(--gray-800)' }}>{b.name}</span>
                <span style={{ color: 'var(--gray-400)', fontSize: '0.875rem', marginLeft: 8 }}>({b.country})</span>
              </span>
              <button onClick={() => removeBrand(b.id)} style={{ border: 'none', background: 'transparent', color: '#dc2626', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>Hapus</button>
            </li>
          ))}
          {brands.length === 0 && <li style={{ color: 'var(--gray-400)', fontSize: 14, textAlign: 'center', padding: '2rem 0' }}>Belum ada brand.</li>}
        </ul>
      </div>
    </div>
  )
}
