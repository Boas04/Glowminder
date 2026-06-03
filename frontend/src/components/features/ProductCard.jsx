// components/features/ProductCard.jsx
import { useState } from 'react'

const CATEGORY_ICONS = {
  cleanser: '🫧', toner: '💧', serum: '✨', moisturizer: '🧴',
  sunscreen: '☀️', eye_cream: '👁️', mask: '🎭', exfoliator: '🌿',
  treatment: '💊', other: '📦',
}

export default function ProductCard({ product, brand, category, onEdit, onDelete, onClassify }) {
  const [deleting,   setDeleting]   = useState(false)
  const [classifying,setClassifying]= useState(false)
  const inStock = product.in_stock !== false

  // fallback to generic icon if unknown
  const catName = category?.name?.toLowerCase() || ''
  const catIcon  = CATEGORY_ICONS[catName] || '📦'
  const catLabel = category ? category.name : 'Unknown'
  const brandName = brand ? brand.name : 'Unknown Brand'

  const handleDelete = async () => {
    if (!confirm(`Hapus "${product.name}"?`)) return
    setDeleting(true)
    await onDelete(product.id)
    setDeleting(false)
  }

  const handleClassify = async () => {
    setClassifying(true)
    await onClassify(product.id)
    setClassifying(false)
  }

  return (
    <div className="card" style={{
      padding: '1.25rem',
      opacity: deleting ? 0.5 : 1,
      animation: 'fadeInUp 0.4s ease',
      transition: 'var(--transition)',
      cursor: 'default',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: '0.875rem' }}>
        <div style={{
          width: 44, height: 44, minWidth: 44,
          background: 'linear-gradient(135deg, var(--pink-50), var(--rose-100))',
          borderRadius: 12, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: 22, border: '1px solid var(--pink-100)',
          boxShadow: '0 2px 8px rgba(232,64,113,0.10)',
        }}>{catIcon}</div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--gray-800)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {product.name}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: 2 }}>{brandName}</div>
        </div>
        <span className="badge" style={{
          background: inStock ? '#d1fae5' : '#fee2e2',
          color: inStock ? '#065f46' : '#dc2626',
          fontSize: '0.65rem', flexShrink: 0,
        }}>
          {inStock ? '● Tersedia' : '✗ Habis'}
        </span>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: '0.875rem' }}>
        <span className="badge badge-pink" style={{ fontSize: '0.7rem' }}>{catLabel}</span>
        {product.usage_time && (
          <span className="badge badge-lavender" style={{ fontSize: '0.7rem' }}>
            {product.usage_time === 'morning' ? '🌅 Pagi' : product.usage_time === 'night' ? '🌙 Malam' : '✨ Khusus'}
          </span>
        )}
      </div>
      
      {product.ingredients && (
        <div style={{ fontSize: '0.7rem', color: 'var(--gray-500)', marginBottom: '0.875rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          <strong>Ingredients:</strong> {product.ingredients}
        </div>
      )}

      {product.description && (
        <p style={{
          fontSize: '0.75rem', color: 'var(--gray-500)',
          background: 'rgba(255,240,245,0.6)',
          borderRadius: 8, padding: '0.4rem 0.65rem',
          marginBottom: '0.875rem', fontStyle: 'italic',
          borderLeft: '2px solid var(--pink-200)',
        }}>{product.description}</p>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 6 }}>
        <button onClick={() => onEdit(product)} style={{
          flex: 1, padding: '0.45rem',
          border: '1.5px solid var(--pink-200)', borderRadius: 10,
          background: 'transparent', cursor: 'pointer',
          fontSize: '0.75rem', color: 'var(--pink-500)', fontWeight: 500,
          transition: 'var(--transition)',
        }} onMouseEnter={e => e.target.style.background = 'var(--pink-50)'}
           onMouseLeave={e => e.target.style.background = 'transparent'}>
          ✏️ Edit
        </button>
        <button onClick={handleClassify} disabled={classifying} style={{
          flex: 1, padding: '0.45rem',
          border: '1.5px solid var(--pink-200)', borderRadius: 10,
          background: 'transparent', cursor: 'pointer',
          fontSize: '0.75rem', color: 'var(--pink-500)', fontWeight: 500,
          transition: 'var(--transition)', opacity: classifying ? 0.7 : 1,
        }} onMouseEnter={e => !classifying && (e.target.style.background = 'var(--pink-50)')}
           onMouseLeave={e => e.target.style.background = 'transparent'}>
          {classifying ? '⏳' : '🤖 AI'}
        </button>
        <button onClick={handleDelete} disabled={deleting} style={{
          padding: '0.45rem 0.65rem',
          border: '1.5px solid #fee2e2', borderRadius: 10,
          background: 'transparent', cursor: 'pointer',
          fontSize: '0.75rem', color: '#dc2626',
          transition: 'var(--transition)',
        }} onMouseEnter={e => e.target.style.background = '#fef2f2'}
           onMouseLeave={e => e.target.style.background = 'transparent'}>
          🗑️
        </button>
      </div>
    </div>
  )
}
