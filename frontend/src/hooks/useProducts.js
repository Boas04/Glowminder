// hooks/useProducts.js
import { useState, useEffect, useCallback } from 'react'
import { productAPI } from '../services/api'
import { MOCK_PRODUCTS } from '../utils/mockData'
import toast from 'react-hot-toast'

const USE_MOCK = true // ← Ganti ke false saat backend siap

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 600))
        setProducts(MOCK_PRODUCTS)
      } else {
        const { data } = await productAPI.getAll()
        setProducts(data.products || data)
      }
    } catch {
      toast.error('Gagal memuat produk')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const addProduct = async (productData) => {
    try {
      if (USE_MOCK) {
        const newProd = { ...productData, id: `p${Date.now()}`, created_at: new Date().toISOString() }
        setProducts((prev) => [newProd, ...prev])
        toast.success('Produk berhasil ditambahkan! ✨')
        return newProd
      }
      const { data } = await productAPI.create(productData)
      setProducts((prev) => [data, ...prev])
      toast.success('Produk berhasil ditambahkan! ✨')
      return data
    } catch { return null }
  }

  const updateProduct = async (id, updates) => {
    try {
      if (USE_MOCK) {
        setProducts((prev) => prev.map((p) => p.id === id ? { ...p, ...updates } : p))
        toast.success('Produk diperbarui')
        return true
      }
      const { data } = await productAPI.update(id, updates)
      setProducts((prev) => prev.map((p) => p.id === id ? data : p))
      toast.success('Produk diperbarui')
      return true
    } catch { return false }
  }

  const removeProduct = async (id) => {
    try {
      if (!USE_MOCK) await productAPI.remove(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
      toast.success('Produk dihapus')
      return true
    } catch { return false }
  }

  const classifyProduct = async (id) => {
    try {
      toast.loading('AI sedang mengklasifikasi produk...')
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 1500))
        toast.dismiss()
        toast.success('Klasifikasi AI selesai ✨')
        return { category: 'serum', usage_time: ['morning', 'night'] }
      }
      const { data } = await productAPI.classify(id)
      toast.dismiss()
      toast.success('Klasifikasi AI selesai ✨')
      return data
    } catch {
      toast.dismiss()
      return null
    }
  }

  // Filter produk berdasarkan waktu penggunaan
  const getProductsByTime = (time) => products.filter((p) => p.usage_time?.includes(time))
  const getMorningProducts = () => getProductsByTime('morning')
  const getNightProducts = () => getProductsByTime('night')
  const getInStockProducts = () => products.filter((p) => p.in_stock)

  return {
    products, loading,
    addProduct, updateProduct, removeProduct, classifyProduct,
    getMorningProducts, getNightProducts, getInStockProducts,
    refresh: fetchProducts,
  }
}
