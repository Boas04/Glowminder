// components/layout/AppLayout.jsx
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const NAV = [
  { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/products', icon: '🧴', label: 'Produk Saya' },
  { to: '/reminders', icon: '🔔', label: 'Reminder' },
  { to: '/categories', icon: '🏷️', label: 'Kategori' },
  { to: '/brands', icon: '🏢', label: 'Brand' },
]

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: collapsed ? 68 : 230,
        background: 'rgba(255,255,255,0.80)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,179,198,0.30)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 100,
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
        boxShadow: '2px 0 24px rgba(232,64,113,0.07)',
      }}>
        {/* Logo */}
        <div style={{
          padding: collapsed ? '1.25rem 0' : '1.5rem 1.25rem',
          borderBottom: '1px solid rgba(255,179,198,0.20)',
          display: 'flex', alignItems: 'center', gap: 10,
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}>
          <div style={{
            width: 36, height: 36, minWidth: 36,
            background: 'var(--gradient-accent)',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
            boxShadow: '0 4px 12px rgba(232,64,113,0.30)',
            animation: 'float 3s ease-in-out infinite',
          }}>🌸</div>
          {!collapsed && (
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.15rem',
              fontWeight: 500,
              fontStyle: 'italic',
              color: 'var(--pink-600)',
              whiteSpace: 'nowrap',
              letterSpacing: '-0.01em',
            }}>GlowMinder</span>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1rem 0.6rem', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {NAV.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: collapsed ? '0.7rem 0' : '0.7rem 0.9rem',
              justifyContent: collapsed ? 'center' : 'flex-start',
              borderRadius: 'var(--radius-md)',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--pink-600)' : 'var(--gray-500)',
              background: isActive
                ? 'linear-gradient(135deg, rgba(255,107,142,0.12), rgba(255,179,198,0.08))'
                : 'transparent',
              borderLeft: isActive && !collapsed ? '3px solid var(--pink-400)' : '3px solid transparent',
              transition: 'var(--transition)',
              whiteSpace: 'nowrap',
            })}>
              <span style={{ fontSize: 18, minWidth: 20, textAlign: 'center' }}>{icon}</span>
              {!collapsed && label}
            </NavLink>
          ))}
        </nav>

        {/* Toggle */}
        <button onClick={() => setCollapsed(!collapsed)} style={{
          position: 'absolute', top: '50%', right: -13,
          transform: 'translateY(-50%)',
          width: 26, height: 26,
          background: 'white',
          border: '1.5px solid var(--pink-200)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: 9, color: 'var(--pink-400)',
          boxShadow: '0 2px 8px rgba(232,64,113,0.15)',
          transition: 'var(--transition)',
        }}>
          {collapsed ? '▶' : '◀'}
        </button>
      </aside>

      {/* ── Main ── */}
      <main style={{
        marginLeft: collapsed ? 68 : 230,
        flex: 1,
        transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
        padding: '2rem 2.5rem',
        minHeight: '100vh',
      }}>
        <Outlet />
      </main>
    </div>
  )
}
