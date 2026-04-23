import { useState, useEffect, useCallback } from 'react'
import { useAuth } from "@clerk/react"
import * as api from '../services/api'
import toast from 'react-hot-toast'

export function usePasswords() {
  const { getToken } = useAuth()
  const [passwords, setPasswords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchPasswords = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const token = await getToken()
      const data = await api.getPasswords(token)
      setPasswords(data)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load credentials')
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => {
    fetchPasswords()
  }, [fetchPasswords])

  const addPassword = async (formData) => {
    const token = await getToken()
    const newEntry = await api.createPassword(token, formData)
    setPasswords(prev => [newEntry, ...prev])
    toast.success('Credential saved!')
    return newEntry
  }

  const updatePassword = async (id, formData) => {
    const token = await getToken()
    const updated = await api.updatePassword(token, id, formData)
    setPasswords(prev => prev.map(p => p._id === id ? updated : p))
    toast.success('Credential updated!')
    return updated
  }

  const deletePassword = async (id) => {
    const token = await getToken()
    await api.deletePassword(token, id)
    setPasswords(prev => prev.filter(p => p._id !== id))
    toast.success('Credential deleted')
  }

  return {
    passwords,
    loading,
    error,
    refetch: fetchPasswords,
    addPassword,
    updatePassword,
    deletePassword,
  }
}
