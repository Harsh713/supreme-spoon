import { useState, useEffect } from "react";
import supabase from "../services/supabaseClient";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("sensor_data")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(20);

      if (error) {
        console.error("Error fetching history:", error);
      } else {
        setHistory(data);
      }
      setLoading(false);
    };

    fetchHistory();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Sensor History</h1>

      {loading ? (
        <p className="text-gray-600 text-lg font-medium">Loading history...</p>
      ) : history.length > 0 ? (
        <div className="overflow-x-auto bg-white p-6 shadow-md rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3 border">Timestamp</th>
                <th className="p-3 border">Temperature (°C)</th>
                <th className="p-3 border">Gas Level</th>
                <th className="p-3 border">PIR Motion</th>
                <th className="p-3 border">LDR Value</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry, index) => (
                <tr key={index} className="text-center border-t">
                  <td className="p-3 border">{new Date(entry.timestamp).toLocaleString()}</td>
                  <td className="p-3 border">{entry.temperature}</td>
                  <td className="p-3 border">{entry.gas_value}</td>
                  <td className="p-3 border">{entry.pir_state ? "Motion" : "No Motion"}</td>
                  <td className="p-3 border">{entry.ldr_value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600 text-lg font-medium">No history available.</p>
      )}
    </div>
  );
};

export default History;
