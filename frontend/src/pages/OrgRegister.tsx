import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import api from '../services/api'

function LocationPicker({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default function OrgRegister() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    cep: '',
    endereco: '',
    whatsapp: '',
    cidade: '',
  })
  const [lat, setLat] = useState<number | null>(null)
  const [lng, setLng] = useState<number | null>(null)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    try {
      await api.post('/orgs', {
        ...form,
        ...(lat !== null && lng !== null ? { latitude: lat, longitude: lng } : {}),
      })
      navigate('/login')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao cadastrar')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Cadastrar ORG</h1>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Senha (mín. 6 caracteres)</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={form.senha}
            onChange={(e) => setForm({ ...form, senha: e.target.value })}
            minLength={6}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={form.cep}
              onChange={(e) => setForm({ ...form, cep: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={form.endereco}
            onChange={(e) => setForm({ ...form, endereco: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={form.cidade}
            onChange={(e) => setForm({ ...form, cidade: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Localização (clique no mapa para marcar)
          </label>
          <div className="h-64 rounded-lg overflow-hidden border">
            <MapContainer center={[-23.5505, -46.6333]} zoom={10} className="h-full w-full">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationPicker onPick={(lat, lng) => { setLat(lat); setLng(lng) }} />
              {lat !== null && lng !== null && <Marker position={[lat, lng]} />}
            </MapContainer>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition cursor-pointer"
        >
          Cadastrar
        </button>
      </form>
    </div>
  )
}
