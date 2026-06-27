import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import type { Pet, Org } from '../lib/types'

export default function PetProfile() {
  const { id } = useParams<{ id: string }>()
  const [pet, setPet] = useState<Pet | null>(null)
  const [org, setOrg] = useState<Org | null>(null)
  const [imgIndex, setImgIndex] = useState(0)

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await api.get(`/pets/${id}`)
        setPet(data.pet)
        if (data.pet.org_id) {
          const { data: orgData } = await api.get(`/orgs/${data.pet.org_id}`)
          setOrg(orgData)
        }
      } catch {
        setPet(null)
      }
    })()
  }, [id])

  if (!pet) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-xl">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link to="/" className="text-orange-500 hover:underline mb-6 inline-block">
        &larr; Voltar
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="h-80 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center text-gray-400 mb-2">
            {pet.imagens.length > 0 ? (
              <img
                src={`/api/uploads/${pet.imagens[imgIndex]}`}
                alt={pet.nome}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-6xl">🐾</span>
            )}
          </div>
          {pet.imagens.length > 1 && (
            <div className="flex gap-2">
              {pet.imagens.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setImgIndex(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer ${
                    i === imgIndex ? 'border-orange-500' : 'border-transparent'
                  }`}
                >
                  <img src={`/api/uploads/${img}`} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{pet.nome}</h1>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-orange-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Idade</p>
              <p className="font-semibold text-gray-800">{pet.idade}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Porte</p>
              <p className="font-semibold text-gray-800">{pet.porte}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Energia</p>
              <p className="font-semibold text-gray-800">{pet.nivel_energia}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Ambiente</p>
              <p className="font-semibold text-gray-800">{pet.ambiente_ideal}</p>
            </div>
          </div>

          {pet.descricao && (
            <p className="text-gray-600 mb-6">{pet.descricao}</p>
          )}

          {org && (
            <div className="border-t pt-4">
              <h2 className="font-bold text-gray-800 mb-2">Organização</h2>
              <p className="text-gray-600">{org.nome}</p>
              <p className="text-gray-500 text-sm">{org.cidade}</p>
              <a
                href={`https://wa.me/${org.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition"
              >
                Falar no WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
