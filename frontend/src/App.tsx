import { useEffect, useState } from 'react'
import axios from 'axios'

type Crypto = {
  id: number
  symbol: string
  price: number
  volume: number
  timestamp: string
}

function App() {
  const [data, setData] = useState<Crypto[]>([])

  useEffect(() => {
    axios.get('http://localhost:8000/api/prices/')
      .then(res => setData(res.data))
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Crypto Dashboard</h1>
      <table className="table-auto w-full text-left">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Price</th>
            <th>Volume</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {data.map((coin) => (
            <tr key={coin.id}>
              <td>{coin.symbol.toUpperCase()}</td>
              <td>${coin.price.toFixed(2)}</td>
              <td>${coin.volume.toLocaleString()}</td>
              <td>{new Date(coin.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
