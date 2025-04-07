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
            : "Failed to fetch data. Please try again later.";
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
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-8">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
          Crypto Dashboard
        </h1>
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="table-auto w-full text-left bg-white border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Symbol</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Volume</th>
                <th className="px-4 py-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {data.map((coin) => (
                <tr key={coin.id} className="border-b">
                  <td className="px-4 py-2">{coin.symbol.toUpperCase()}</td>
                  <td className="px-4 py-2 text-green-500">
                    ${coin.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-2">{coin.volume.toLocaleString()}</td>
                  <td className="px-4 py-2">
                    {new Date(coin.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
