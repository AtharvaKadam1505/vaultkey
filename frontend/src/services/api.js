import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || ''

const client = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
})

// Attach auth token to every request
function authHeader(token) {
  return { headers: { Authorization: `Bearer ${token}` } }
}

export async function getPasswords(token) {
  const res = await client.get('/passwords', authHeader(token))
  return res.data
}

export async function createPassword(token, data) {
  const res = await client.post('/passwords', data, authHeader(token))
  return res.data
}

export async function updatePassword(token, id, data) {
  const res = await client.put(`/passwords/${id}`, data, authHeader(token))
  return res.data
}

export async function deletePassword(token, id) {
  const res = await client.delete(`/passwords/${id}`, authHeader(token))
  return res.data
}
