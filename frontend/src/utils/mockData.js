// utils/mockData.js
// Data mock sementara — digunakan saat backend belum siap.
// Hapus/nonaktifkan saat backend sudah konek.

export const MOCK_USER = {
  id: 'user_001',
  name: 'Sari Dewi',
  email: 'sari@example.com',
  avatar: null,
  location: { city: 'Tangerang', lat: -6.25, lon: 106.78 },
}

export const MOCK_PRODUCTS = [
  {
    id: 'p1',
    name: 'Gentle Foam Cleanser',
    brand: 'Cetaphil',
    category: 'cleanser',
    usage_time: ['morning', 'night'],
    in_stock: true,
    notes: 'Cocok untuk kulit sensitif',
    created_at: new Date().toISOString(),
  },
  {
    id: 'p2',
    name: 'Niacinamide 10% + Zinc 1%',
    brand: 'The Ordinary',
    category: 'serum',
    usage_time: ['morning', 'night'],
    in_stock: true,
    notes: 'Kurangi pori-pori',
    created_at: new Date().toISOString(),
  },
  {
    id: 'p3',
    name: 'Ultra Facial Cream SPF 30',
    brand: 'Kiehl\'s',
    category: 'moisturizer',
    usage_time: ['morning'],
    in_stock: true,
    notes: '',
    created_at: new Date().toISOString(),
  },
  {
    id: 'p4',
    name: 'Retinol 0.5% Serum',
    brand: 'CeraVe',
    category: 'serum',
    usage_time: ['night'],
    in_stock: false,
    notes: 'Habis, perlu beli lagi',
    created_at: new Date().toISOString(),
  },
  {
    id: 'p5',
    name: 'Toner Birch Juice',
    brand: 'Glow Recipe',
    category: 'toner',
    usage_time: ['morning', 'night'],
    in_stock: true,
    notes: '',
    created_at: new Date().toISOString(),
  },
]

export const MOCK_WEATHER = {
  city: 'Tangerang',
  temp: 30,
  feels_like: 33,
  humidity: 75,
  uv_index: 6.8,
  condition: 'Partly Cloudy',
  condition_id: 802,
  icon: '02d',
  wind_speed: 4.2,
  description: 'berawan',
}

export const MOCK_REMINDERS = [
  { id: 'r1', title: 'Rutinitas Pagi', time: '07:00', days: ['Mon','Tue','Wed','Thu','Fri'], active: true },
  { id: 'r2', title: 'Rutinitas Malam', time: '21:00', days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], active: true },
  { id: 'r3', title: 'Treatment Mingguan', time: '19:00', days: ['Sat'], active: false },
]

export const PRODUCT_CATEGORIES = [
  { value: 'cleanser', label: 'Cleanser' },
  { value: 'toner', label: 'Toner' },
  { value: 'serum', label: 'Serum' },
  { value: 'moisturizer', label: 'Moisturizer' },
  { value: 'sunscreen', label: 'Sunscreen' },
  { value: 'eye_cream', label: 'Eye Cream' },
  { value: 'mask', label: 'Mask' },
  { value: 'exfoliator', label: 'Exfoliator' },
  { value: 'treatment', label: 'Treatment' },
  { value: 'other', label: 'Lainnya' },
]

export const USAGE_TIMES = [
  { value: 'morning', label: '🌅 Pagi' },
  { value: 'night', label: '🌙 Malam' },
  { value: 'special', label: '✨ Treatment Khusus' },
]
