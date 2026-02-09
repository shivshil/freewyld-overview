import { useState } from 'react'
import FreewyldOverview from './FreewyldOverview'

const PASS = 'freewyldfoundry'

function App() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('fw_auth') === '1')
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input === PASS) {
      sessionStorage.setItem('fw_auth', '1')
      setAuthed(true)
    } else {
      setError(true)
      setTimeout(() => setError(false), 1500)
    }
  }

  if (authed) return <FreewyldOverview />

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-bold text-white tracking-tight">Freewyld Foundry</h1>
          <p className="text-sm text-gray-500">Enter password to continue</p>
        </div>
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Password"
          autoFocus
          className={`w-full px-4 py-3 rounded-lg bg-gray-900 border text-white text-sm placeholder-gray-600 outline-none transition-colors ${
            error ? 'border-red-500' : 'border-gray-700 focus:border-blue-500'
          }`}
        />
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
        >
          Enter
        </button>
        {error && <p className="text-center text-xs text-red-400">Incorrect password</p>}
      </form>
    </div>
  )
}

export default App
