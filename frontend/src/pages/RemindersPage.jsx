// pages/RemindersPage.jsx
import { useEffect, useRef, useState } from 'react'
import { reminderAPI } from '../services/api'
import { getUserCoords } from '../services/weather'
import toast from 'react-hot-toast'

const DAYS = ['Sen','Sel','Rab','Kam','Jum','Sab','Min']
const DAYS_EN = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
const DAY_INDEX = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function RemindersPage() {
  const [reminders, setReminders] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ title: '', time: '07:00', days: ['Mon','Tue','Wed','Thu','Fri'] })
  const lastTriggeredRef = useRef(new Map())
  const [coords, setCoords] = useState(null)

  useEffect(() => {
    getUserCoords().then(setCoords)
  }, [])

  useEffect(() => {
    let alive = true

    const loadReminders = async () => {
      try {
        const { data } = await reminderAPI.getAll()
        if (!alive) return
        setReminders(data.data || data)
      } catch {
        toast.error('Gagal memuat reminder')
      }
    }

    loadReminders()
    return () => { alive = false }
  }, [])

  useEffect(() => {
    if (!('Notification' in window)) {
      return undefined
    }

    if (Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {})
    }

    const checkReminders = async () => {
      const now = new Date()
      const dayKey = DAY_INDEX[now.getDay()]
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const timeKey = `${hours}:${minutes}`
      const stamp = `${now.toISOString().slice(0, 10)} ${timeKey}`

      for (const reminder of reminders) {
        const reminderTime = reminder.time?.slice(0, 5) || reminder.time
        if (!reminder.active) continue
        if (!reminder.days.includes(dayKey)) continue
        if (reminderTime !== timeKey) continue

        const lastStamp = lastTriggeredRef.current.get(reminder.id)
        if (lastStamp === stamp) continue

        lastTriggeredRef.current.set(reminder.id, stamp)
        let reminderText = `${reminder.title} (${reminderTime})`

        try {
          const payload = coords ? { lat: coords.lat, lon: coords.lon } : {}
          const { data } = await reminderAPI.personalized(payload)
          reminderText = data?.data?.reminder_text || reminderText
        } catch {
          // fallback to basic text
        }

        toast.success(`🔔 ${reminderText}`)

        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('GlowMinder Reminder', {
            body: reminderText,
          })
        }
      }
    }

    checkReminders()
    const timer = setInterval(checkReminders, 30000)

    return () => clearInterval(timer)
  }, [reminders])

  const toggleDay = (d) => {
    setForm((prev) => ({
      ...prev,
      days: prev.days.includes(d) ? prev.days.filter((x) => x !== d) : [...prev.days, d],
    }))
  }

  const toggleActive = async (id) => {
    try {
      const { data } = await reminderAPI.toggle(id)
      const updated = data.data || data
      setReminders((prev) => prev.map((r) => (r.id === id ? updated : r)))
    } catch {
      toast.error('Gagal mengubah status reminder')
    }
  }

  const addReminder = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || form.days.length === 0) {
      toast.error('Lengkapi form terlebih dahulu')
      return
    }
    try {
      const { data } = await reminderAPI.create(form)
      const newReminder = data.data || data
      setReminders((prev) => [newReminder, ...prev])
      setForm({ title: '', time: '07:00', days: ['Mon','Tue','Wed','Thu','Fri'] })
      setShowAdd(false)
      toast.success('Reminder ditambahkan! 🔔')
    } catch {
      toast.error('Gagal menambahkan reminder')
    }
  }

  const deleteReminder = async (id) => {
    try {
      await reminderAPI.remove(id)
      setReminders((prev) => prev.filter((r) => r.id !== id))
      toast.success('Reminder dihapus')
    } catch {
      toast.error('Gagal menghapus reminder')
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '1.75rem',
        animation: 'fadeInUp 0.4s ease',
      }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: 'var(--gray-900)' }}>
            🔔 Reminder
          </h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginTop: 2 }}>
            {reminders.filter((r) => r.active).length} reminder aktif
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? '✕ Batal' : '➕ Tambah'}
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', animation: 'fadeInUp 0.3s ease' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--gray-800)', marginBottom: '1rem' }}>
            Reminder Baru
          </h3>
          <form onSubmit={addReminder} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--gray-600)', display: 'block', marginBottom: 6 }}>Judul</label>
                <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Misal: Rutinitas Pagi" required />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--gray-600)', display: 'block', marginBottom: 6 }}>Waktu</label>
                <input className="input" type="time" value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })} style={{ width: 110 }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--gray-600)', display: 'block', marginBottom: 8 }}>Hari</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {DAYS_EN.map((d, i) => {
                  const active = form.days.includes(d)
                  return (
                    <button key={d} type="button" onClick={() => toggleDay(d)} style={{
                      width: 40, height: 40, borderRadius: '50%', border: `1.5px solid ${active ? 'var(--pink-400)' : 'var(--gray-200)'}`,
                      background: active ? 'var(--gradient-accent)' : 'white',
                      color: active ? 'white' : 'var(--gray-500)', cursor: 'pointer',
                      fontSize: '0.75rem', fontWeight: 600, transition: 'var(--transition)',
                    }}>
                      {DAYS[i]}
                    </button>
                  )
                })}
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end', padding: '0.6rem 1.5rem' }}>
              Simpan Reminder
            </button>
          </form>
        </div>
      )}

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {reminders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--gray-400)' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔔</div>
            <div>Belum ada reminder</div>
          </div>
        ) : reminders.map((r, i) => (
          <div key={r.id} className="card" style={{
            padding: '1.25rem 1.5rem',
            display: 'flex', alignItems: 'center', gap: '1rem',
            opacity: r.active ? 1 : 0.6,
            animation: `fadeInUp 0.4s ease ${i * 0.05}s both`,
            transition: 'var(--transition)',
          }}>
            {/* Toggle */}
            <div onClick={() => toggleActive(r.id)} style={{
              width: 44, height: 26, borderRadius: 13,
              background: r.active ? 'var(--gradient-accent)' : 'var(--gray-200)',
              cursor: 'pointer', position: 'relative',
              transition: 'var(--transition)', flexShrink: 0,
              boxShadow: r.active ? 'var(--shadow-sm)' : 'none',
            }}>
              <div style={{
                position: 'absolute', top: 3,
                left: r.active ? 21 : 3,
                width: 20, height: 20, borderRadius: '50%',
                background: 'white', transition: 'var(--transition)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
              }} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--gray-800)', marginBottom: 4 }}>
                {r.title}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                <span style={{
                  fontSize: '0.8rem', fontWeight: 600,
                  color: 'var(--pink-600)',
                  background: 'var(--pink-50)',
                  padding: '2px 8px', borderRadius: 6,
                }}>⏰ {r.time?.slice(0, 5) || r.time}</span>
                {r.days.map((d, di) => (
                  <span key={d} className="badge badge-gray" style={{ fontSize: '0.65rem' }}>
                    {DAYS[DAYS_EN.indexOf(d)] || d}
                  </span>
                ))}
              </div>
            </div>

            <button onClick={() => deleteReminder(r.id)} style={{
              width: 32, height: 32, border: 'none',
              background: 'none', cursor: 'pointer',
              color: 'var(--gray-300)', fontSize: 18,
              borderRadius: 8, transition: 'var(--transition)',
            }} onMouseEnter={(e) => { e.target.style.background = '#fef2f2'; e.target.style.color = '#dc2626' }}
               onMouseLeave={(e) => { e.target.style.background = 'none'; e.target.style.color = 'var(--gray-300)' }}>
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
