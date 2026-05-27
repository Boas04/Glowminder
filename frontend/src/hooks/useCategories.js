import { useState, useEffect, useCallback } from 'react'
import { categoryAPI } from '../services/api'
import toast from 'react-hot-toast'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await categoryAPI.getAll()
      setCategories(data.data || data)
    } catch {
      toast.error('Gagal memuat kategori')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCategories() }, [fetchCategories])

  const addCategory = async (name) => {
    try {
      const { data } = await categoryAPI.create({ name })
      const newCat = data.data || data
      setCategories((prev) => [newCat, ...prev])
      toast.success('Kategori berhasil ditambahkan!')
      return newCat
    } catch { return null }
  }

  const updateCategory = async (id, name) => {
    try {
      const { data } = await categoryAPI.update(id, { name })
      const updatedCat = data.data || data
      setCategories((prev) => prev.map((c) => c.id === id ? updatedCat : c))
      toast.success('Kategori diperbarui')
      return true
    } catch { return false }
  }

  const removeCategory = async (id) => {
    try {
      await categoryAPI.remove(id)
      setCategories((prev) => prev.filter((c) => c.id !== id))
      toast.success('Kategori dihapus')
      return true
    } catch { return false }
  }

  return {
    categories, loading,
    addCategory, updateCategory, removeCategory,
    refresh: fetchCategories,
  }
}
