import { useState, useEffect } from "react";
import supabase from "../services/supabaseClient";
import SensorChart from "../components/SensorChart";
import "../styles/global.css";

const Dashboard = () => {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]); // ✅ Store last 5 updates

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("sensor_data")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        setSensorData(data);
      }
      setLoading(false);
    };

    fetchData();

    // ✅ Fetch Last 5 Updates
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from("sensor_data")
        .select("timestamp, temperature, gas_value, pir_state, ldr_value")
        .order("timestamp", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching logs:", error);
      } else {
        setLogs(data);
      }
    };

    fetchLogs();

    // ✅ Subscribe to Real-time Updates
    const subscription = supabase
      .channel("realtime:sensor_data")
      .on("postgres_changes", { event: "*", schema: "public", table: "sensor_data" }, (payload) => {
        setSensorData(payload.new);
        setLogs((prevLogs) => [payload.new, ...prevLogs.slice(0, 4)]); // Keep last 5 logs
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {loading ? (
        <p className="text-gray-600 text-lg font-medium">Loading sensor data...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "PIR Sensor", value: sensorData?.pir_state ? "Motion Detected" : "No Motion", color: "bg-blue-100 text-blue-600" },
            { label: "LDR Value", value: sensorData?.ldr_value, color: "bg-yellow-100 text-yellow-600" },
            { label: "Temperature", value: `${sensorData?.temperature}°C`, color: "bg-red-100 text-red-600" },
            { label: "Gas Level", value: sensorData?.gas_value, color: "bg-green-100 text-green-600" },
          ].map((item, index) => (
            <div key={index} className={`p-4 ${item.color} shadow-md rounded-lg text-center`}>
              <h2 className="text-lg font-semibold">{item.label}</h2>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 Real-Time Sensor Chart */}
      <div className="mt-6">
        <SensorChart />
      </div>

      {/* 🔹 Last 5 Sensor Updates */}
      <div className="mt-6 bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Sensor Updates</h2>
        <ul className="space-y-2">
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <li key={index} className="p-3 bg-gray-50 rounded shadow-sm">
                <span className="font-medium text-gray-700">
                  {new Date(log.timestamp).toLocaleTimeString()}:
                </span>{" "}
                <span className="text-red-600 font-semibold">Temp: {log.temperature}°C</span>,{" "}
                <span className="text-green-600 font-semibold">Gas: {log.gas_value}</span>,{" "}
                <span className="text-blue-600 font-semibold">
                  PIR: {log.pir_state ? "Motion" : "No Motion"}
                </span>,{" "}
                <span className="text-yellow-600 font-semibold">LDR: {log.ldr_value}</span>
              </li>
            ))
          ) : (
            <p className="text-gray-600">No recent updates available.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
