import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import type { Pet } from '../lib/types'

export default function Dashboard() {
  const navigate = useNavigate()
  const [pets, setPets] = useState<Pet[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    idade: '',
    porte: '',
    nivel_energia: '',
    ambiente_ideal: '',
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    fetchPets()
  }, [navigate])

  async function fetchPets() {
    try {
      const { data } = await api.get('/pets')
      setPets(data.pets)
    } catch { setPets([]) }
  }

  function openCreate() {
    setEditId(null)
    setForm({ nome: '', descricao: '', idade: '', porte: '', nivel_energia: '', ambiente_ideal: '' })
    setShowForm(true)
  }

  function openEdit(pet: Pet) {
    setEditId(pet.id)
    setForm({
      nome: pet.nome,
      descricao: pet.descricao || '',
      idade: pet.idade,
      porte: pet.porte,
      nivel_energia: pet.nivel_energia,
      ambiente_ideal: pet.ambiente_ideal,
    })
    setShowForm(true)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    try {
      const payload = { ...form, descricao: form.descricao || null }
      if (editId) {
        await api.patch(`/pets/${editId}`, payload)
      } else {
        const { data } = await api.post('/pets', payload)
        setEditId(data.pet.id)
      }
      setShowForm(false)
      fetchPets()
    } catch { alert('Erro ao salvar') }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza?')) return
    try {
      await api.delete(`/pets/${id}`)
      fetchPets()
    } catch { alert('Erro ao excluir') }
  }

  async function handleUpload(files: FileList | null) {
    if (!files || !editId) return
    setUploading(true)
    try {
      const fd = new FormData()
      Array.from(files).forEach((f) => fd.append('images', f))
      await api.post(`/pets/${editId}/images`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      fetchPets()
    } catch { alert('Erro no upload') }
    finally { setUploading(false) }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={openCreate}
          className="bg-orange-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-orange-600 transition cursor-pointer"
        >
          + Novo Pet
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="border rounded-xl p-6 mb-8 space-y-4 bg-gray-50">
          <h2 className="font-bold text-lg">{editId ? 'Editar' : 'Novo'} Pet</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <input className="w-full border rounded-lg px-3 py-2" value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Idade</label>
              <input className="w-full border rounded-lg px-3 py-2" value={form.idade} onChange={(e) => setForm({...form, idade: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Porte</label>
              <input className="w-full border rounded-lg px-3 py-2" value={form.porte} onChange={(e) => setForm({...form, porte: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Energia</label>
              <input className="w-full border rounded-lg px-3 py-2" value={form.nivel_energia} onChange={(e) => setForm({...form, nivel_energia: e.target.value})} required />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Ambiente ideal</label>
              <input className="w-full border rounded-lg px-3 py-2" value={form.ambiente_ideal} onChange={(e) => setForm({...form, ambiente_ideal: e.target.value})} required />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Descrição</label>
              <textarea className="w-full border rounded-lg px-3 py-2" rows={3} value={form.descricao} onChange={(e) => setForm({...form, descricao: e.target.value})} />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition cursor-pointer">
              Salvar
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition cursor-pointer">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {editId && (
        <div className="border rounded-xl p-6 mb-8 bg-gray-50">
          <h2 className="font-bold text-lg mb-2">Imagens</h2>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleUpload(e.target.files)}
            disabled={uploading}
            className="mb-2"
          />
          {uploading && <p className="text-sm text-gray-500">Enviando...</p>}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {pets.length === 0 && <p className="text-gray-500 text-center py-10">Nenhum pet cadastrado.</p>}
        {pets.map((pet) => (
          <div key={pet.id} className="border rounded-xl p-4 flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              {pet.imagens.length > 0 ? (
                <img src={`/api/uploads/${pet.imagens[0]}`} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">🐾</div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{pet.nome}</p>
              <p className="text-sm text-gray-500">{pet.idade} &middot; {pet.porte}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(pet)} className="text-orange-500 hover:underline cursor-pointer">Editar</button>
              <button onClick={() => handleDelete(pet.id)} className="text-red-500 hover:underline cursor-pointer">Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
