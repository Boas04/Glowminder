import { useState, useEffect, useCallback } from 'react'
import { brandAPI } from '../services/api'
import toast from 'react-hot-toast'

export function useBrands() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBrands = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await brandAPI.getAll()
      setBrands(data.data || data)
    } catch {
      toast.error('Gagal memuat brand')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchBrands() }, [fetchBrands])

  const addBrand = async (brandData) => {
    try {
      const { data } = await brandAPI.create(brandData)
      const newBrand = data.data || data
      setBrands((prev) => [newBrand, ...prev])
      toast.success('Brand berhasil ditambahkan!')
      return newBrand
    } catch { return null }
  }

  const updateBrand = async (id, brandData) => {
    try {
      const { data } = await brandAPI.update(id, brandData)
      const updatedBrand = data.data || data
      setBrands((prev) => prev.map((b) => b.id === id ? updatedBrand : b))
      toast.success('Brand diperbarui')
      return true
    } catch { return false }
  }

  const removeBrand = async (id) => {
    try {
      await brandAPI.remove(id)
      setBrands((prev) => prev.filter((b) => b.id !== id))
      toast.success('Brand dihapus')
      return true
    } catch { return false }
  }

  return {
    brands, loading,
    addBrand, updateBrand, removeBrand,
    refresh: fetchBrands,
  }
}
