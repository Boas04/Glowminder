// components/layout/AppLayout.jsx
import { useState, useEffect } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Home, Droplet, Bell, Tag, Building2, Menu, X } from 'lucide-react'
import logoImg from '../../assets/logo.png'

const NAV = [
  { to: '/dashboard',  icon: Home,      label: 'Dashboard'   },
  { to: '/products',   icon: Droplet,   label: 'Produk Saya' },
  { to: '/reminders',  icon: Bell,      label: 'Reminder'    },
  { to: '/categories', icon: Tag,       label: 'Kategori'    },
  { to: '/brands',     icon: Building2, label: 'Brand'       },
]

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile]   = useState(window.innerWidth < 768)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) setMobileOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* ── Mobile overlay ── */}
      {isMobile && mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 150,
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* ── Sidebar (desktop) / Drawer (mobile) ── */}
      <aside style={{
        width: isMobile ? 230 : (collapsed ? 68 : 230),
        background: 'rgba(255,255,255,0.90)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,179,198,0.30)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, bottom: 0,
        left: isMobile ? (mobileOpen ? 0 : -240) : 0,
        zIndex: 200,
        transition: isMobile
          ? 'left 0.3s cubic-bezier(0.4,0,0.2,1)'
          : 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
        boxShadow: '2px 0 24px rgba(232,64,113,0.07)',
      }}>
        {/* Logo */}
        <div style={{
          padding: (!isMobile && collapsed) ? '1.25rem 0' : '1.5rem 1.25rem',
          borderBottom: '1px solid rgba(255,179,198,0.20)',
          display: 'flex', alignItems: 'center', gap: 10,
          justifyContent: (!isMobile && collapsed) ? 'center' : 'flex-start',
        }}>
          <div style={{
            width: 36, height: 36, minWidth: 36,
            borderRadius: 12, overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(232,64,113,0.30)',
            animation: 'float 3s ease-in-out infinite',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#fff',
          }}>
            <img src={logoImg} alt="GlowMinder Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {(isMobile || !collapsed) && (
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.15rem', fontWeight: 500, fontStyle: 'italic',
              color: 'var(--pink-600)', whiteSpace: 'nowrap', letterSpacing: '-0.01em',
            }}>GlowMinder</span>
          )}
          {/* Close button di mobile */}
          {isMobile && (
            <button onClick={() => setMobileOpen(false)} style={{
              marginLeft: 'auto', background: 'none', border: 'none',
              cursor: 'pointer', color: 'var(--gray-400)', padding: 4,
              display: 'flex', alignItems: 'center',
            }}>
              <X size={20} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1rem 0.6rem', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {NAV.map(({ to, icon: IconComponent, label }) => (
            <NavLink key={to} to={to}
              onClick={() => isMobile && setMobileOpen(false)}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: (!isMobile && collapsed) ? '0.7rem 0' : '0.7rem 0.9rem',
                justifyContent: (!isMobile && collapsed) ? 'center' : 'flex-start',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--pink-600)' : 'var(--gray-500)',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(255,107,142,0.12), rgba(255,179,198,0.08))'
                  : 'transparent',
                borderLeft: isActive && (isMobile || !collapsed) ? '3px solid var(--pink-400)' : '3px solid transparent',
                transition: 'var(--transition)',
                whiteSpace: 'nowrap',
              })}>
              <IconComponent size={20} style={{ minWidth: 20 }} />
              {(isMobile || !collapsed) && label}
            </NavLink>
          ))}
        </nav>

        {/* Toggle button (desktop only) */}
        {!isMobile && (
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
        )}
      </aside>

      {/* ── Mobile top bar ── */}
      {isMobile && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          height: 56,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,179,198,0.25)',
          display: 'flex', alignItems: 'center',
          padding: '0 1rem', gap: 12,
          boxShadow: '0 2px 12px rgba(232,64,113,0.07)',
        }}>
          <button onClick={() => setMobileOpen(true)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--pink-500)', display: 'flex', alignItems: 'center', padding: 4,
          }}>
            <Menu size={24} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(232,64,113,0.2)' }}>
              <img src={logoImg} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontStyle: 'italic', fontWeight: 500, color: 'var(--pink-600)' }}>GlowMinder</span>
          </div>
        </div>
      )}

      {/* ── Main ── */}
      <main style={{
        marginLeft: isMobile ? 0 : (collapsed ? 68 : 230),
        flex: 1,
        transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
        padding: isMobile ? '4.5rem 1rem 1.5rem' : '2rem 2.5rem',
        minHeight: '100vh',
      }}>
        <Outlet />
      </main>
    </div>
  )
}