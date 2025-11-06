import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveUserOnServer } from '../services/api'
import axios from 'axios'
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

function Setup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  // Prefill existing values for editing
  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/user`)
        if (data?.email) setEmail(data.email)
        if (data?.phone) setPhone(data.phone)
      } catch (e) {
        // ignore
      }
    })()
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !phone) {
      alert('Please enter both email and phone number')
      return
    }
    try {
      setLoading(true)
      // Save to backend, which writes to Firestore via Admin SDK
      await saveUserOnServer(email, phone)
      localStorage.setItem('sos_has_profile', 'true')
      navigate('/')
    } catch (err) {
      console.error(err)
      alert('Failed to save info. Check server and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
        <h2>Set up your contact info</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }} />
        <input type="tel" placeholder="Phone (E.164, e.g. +15551234567)" value={phone} onChange={(e) => setPhone(e.target.value)} required style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc' }} />
        <button type="submit" disabled={loading} style={{ background: '#111827', color: 'white', border: 'none', padding: '10px 16px', borderRadius: 6, cursor: 'pointer' }}>
          {loading ? 'Saving…' : 'Save'}
        </button>
      </form>
    </div>
  )
}

export default Setup


