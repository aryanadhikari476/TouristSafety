import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

function Home() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const hasProfile = localStorage.getItem('sos_has_profile') === 'true'
    if (!hasProfile) {
      // First-time users will be redirected when they click the button
    }
  }, [])

  const onClickSOS = async () => {
    const hasProfile = localStorage.getItem('sos_has_profile') === 'true'
    if (!hasProfile) {
      navigate('/setup')
      return
    }

    if (!('geolocation' in navigator)) {
      alert('Geolocation is not supported in this browser.')
      return
    }

    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords
          await axios.post(`${API_BASE}/sos`, { latitude, longitude })
          alert('SOS sent! Check your email and phone.')
        } catch (err) {
          console.error(err)
          alert('Failed to send SOS. Please try again.')
        } finally {
          setLoading(false)
        }
      },
      (err) => {
        console.error(err)
        alert('Failed to get location. Please allow location access.')
        setLoading(false)
      },
      { enableHighAccuracy: true }
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <h1>Emergency SOS</h1>
      <button onClick={onClickSOS} disabled={loading} style={{ background: '#e11d48', color: 'white', border: 'none', padding: '16px 32px', borderRadius: 8, fontSize: 24, cursor: 'pointer' }}>
        {loading ? 'Sending…' : 'SOS'}
      </button>
      <button onClick={() => navigate('/setup')} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 16px', borderRadius: 6, cursor: 'pointer' }}>
        Edit contact
      </button>
      <p style={{ color: '#555' }}>First click will ask for your contact info.</p>
    </div>
  )
}

export default Home


