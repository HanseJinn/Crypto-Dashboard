import { useEffect, useState } from 'react'

interface CryptoData {
  coin: string
  price: number
  change_24h: number
}

function App() {
  const [data, setData] = useState<CryptoData[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/crypto/prices/')
        if (!response.ok) throw new Error('Fehler beim Abrufen der Daten')
        const result = await response.json()
        setData(result.data)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Ein unbekannter Fehler ist aufgetreten')
        }
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">🪙 Krypto Dashboard</h1>

      {error && (
        <div className="bg-red-200 text-red-800 px-4 py-2 rounded mb-4">
          Fehler: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.map((coin) => (
          <div key={coin.coin} className="bg-white p-4 rounded-2xl shadow">
            <h2 className="text-xl font-semibold capitalize">{coin.coin}</h2>
            <p className="text-lg">💰 Preis: ${coin.price.toFixed(2)}</p>
            <p className={`text-sm ${coin.change_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              24h Änderung: {coin.change_24h.toFixed(2)}%
            </p>
          </div>
        ))}
      </div>

      {/* TODO: Weitere Coins, Diagramme oder Filter integrieren */}
    </div>
  )
}

export default App
