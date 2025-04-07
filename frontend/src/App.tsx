import { useEffect, useState } from "react";
import axios from "axios";

type Crypto = {
  id: number;
  symbol: string;
  price: number;
  volume: number;
  timestamp: string;
};

function App() {
  
  const [data, setData] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Fetching the data using async/await and error handling
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/prices/");
        setData(response.data);
      } catch (err) {
        const errorMessage =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : "Failed to fetch data. Please try again. Check Connection.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
      <div className="text-2xl text-red-500">{error}</div>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-150"
      >
        Retry
      </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-10">Crypto Dashboard</h1>
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-lg overflow-x-auto">
        <table className="w-full text-left border border-gray-200 rounded-md">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">Symbol</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">Price</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">Volume</th>
              <th className="px-4 py-3 text-sm font-semibold text-gray-600">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {data.map((coin) => (
              <tr key={coin.id} className="border-t hover:bg-gray-50 transition duration-150">
                <td className="px-4 py-3">{coin.symbol.toUpperCase()}</td>
                <td className="px-4 py-3 text-green-600 font-medium">${coin.price.toFixed(2)}</td>
                <td className="px-4 py-3">{coin.volume.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{new Date(coin.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      <footer className="mt-10 text-center text-gray-500">
        <p className="text-sm">© 2023 Crypto Dashboard. All rights reserved.</p>
        <p className="text-sm">Built with React and Tailwind CSS</p>
        <p className="text-sm">Data provided by CoinGecko API</p>
      </footer>
      <div className="flex justify-center mt-5">
      </div>
    </div>
      
    </div>
  );
}

export default App;
