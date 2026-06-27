import { Link, useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <header className="bg-orange-500 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          FindAFriend
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          {token ? (
            <>
              <Link to="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="hover:underline cursor-pointer">
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Entrar
              </Link>
              <Link
                to="/register"
                className="bg-white text-orange-500 px-4 py-1.5 rounded-full font-semibold hover:bg-orange-100 transition"
              >
                Cadastrar ORG
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
