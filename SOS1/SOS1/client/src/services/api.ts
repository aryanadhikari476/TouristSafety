import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export async function saveUserOnServer(email: string, phone: string) {
  return axios.post(`${API_BASE}/save-user`, { email, phone })
}

export async function sendSOS(latitude: number, longitude: number) {
  return axios.post(`${API_BASE}/sos`, { latitude, longitude })
}






