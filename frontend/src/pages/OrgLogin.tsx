import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function OrgLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    try {
      const { data } = await api.post('/sessions', { email, senha })
      localStorage.setItem('token', data.token)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao entrar')
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Entrar</h1>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition cursor-pointer"
        >
          Entrar
        </button>
      </form>
    </div>
  )
}
