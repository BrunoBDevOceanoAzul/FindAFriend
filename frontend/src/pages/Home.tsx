import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import api from '../services/api'
import type { Pet } from '../lib/types'

const petIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
})

export default function Home() {
  const navigate = useNavigate()
  const [cidade, setCidade] = useState('')
  const [pets, setPets] = useState<Pet[]>([])
  const [searched, setSearched] = useState(false)

  const searchPets = useCallback(async () => {
    if (!cidade.trim()) return
    try {
      const { data } = await api.get('/pets', { params: { cidade } })
      setPets(data.pets)
      setSearched(true)
    } catch {
      setPets([])
      setSearched(true)
    }
  }, [cidade])

  useEffect(() => {
    if (cidade.trim()) searchPets()
  }, [cidade, searchPets])

  return (
    <div>
      <section className="bg-gradient-to-br from-orange-400 to-orange-600 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Encontre seu novo amigo</h1>
          <p className="text-lg mb-8 opacity-90">
            Adote um pet e transforme uma vida. Pesquise por cidade e encontre o animal ideal para você.
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              className="flex-1 border-none rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="Digite sua cidade..."
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchPets()}
            />
            <button
              onClick={searchPets}
              className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition cursor-pointer"
            >
              Buscar
            </button>
          </div>
        </div>
      </section>

      {searched && (
        <section className="max-w-6xl mx-auto px-4 py-10">
          {pets.length === 0 ? (
            <p className="text-gray-500 text-center text-lg">
              Nenhum pet encontrado em <strong>{cidade}</strong>.
            </p>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Pets em {cidade} ({pets.length})
              </h2>

              <div className="h-80 mb-8 rounded-xl overflow-hidden border">
                <MapContainer center={[-23.5505, -46.6333]} zoom={5} className="h-full w-full">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {pets.map((pet) => (
                    <Marker
                      key={pet.id}
                      position={[-23.5505, -46.6333]}
                      icon={petIcon}
                    >
                      <Popup>
                        <strong>{pet.nome}</strong>
                        <br />
                        <button
                          className="text-orange-500 underline mt-1 cursor-pointer"
                          onClick={() => navigate(`/pets/${pet.id}`)}
                        >
                          Ver detalhes
                        </button>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {pets.map((pet) => (
                  <div
                    key={pet.id}
                    className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
                    onClick={() => navigate(`/pets/${pet.id}`)}
                  >
                    <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400 overflow-hidden">
                      {pet.imagens.length > 0 ? (
                        <img
                          src={`/api/uploads/${pet.imagens[0]}`}
                          alt={pet.nome}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl">🐾</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-800">{pet.nome}</h3>
                      <p className="text-sm text-gray-500">
                        {pet.idade} &middot; {pet.porte}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      )}
    </div>
  )
}
