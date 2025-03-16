import { useState, useEffect } from "react";
import supabase from "../services/supabaseClient";
import SensorChart from "../components/SensorChart";
import ThemeToggle from "../components/ThemeToggle"; // ✅ Import theme toggle
import "../styles/global.css";

const Dashboard = () => {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("sensor_data")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(1)
        .single();

      if (error) console.error("Error fetching data:", error);
      else setSensorData(data);

      setLoading(false);
    };

    fetchData();

    // Fetch last 5 updates
    const fetchLogs = async () => {
      const { data, error } = await supabase
        .from("sensor_data")
        .select("timestamp, temperature, gas_value, pir_state, ldr_value")
        .order("timestamp", { ascending: false })
        .limit(5);

      if (error) console.error("Error fetching logs:", error);
      else setLogs(data);
    };

    fetchLogs();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel("realtime:sensor_data")
      .on("postgres_changes", { event: "*", schema: "public", table: "sensor_data" }, (payload) => {
        setSensorData(payload.new);
        setLogs((prevLogs) => [payload.new, ...prevLogs.slice(0, 4)]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* 🔹 Navbar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <ThemeToggle /> {/* ✅ Theme Toggle Button */}
      </div>

      {/* 🔹 Sensor Overview */}
      {loading ? (
        <p className="text-lg font-medium">Loading sensor data...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "PIR Sensor", value: sensorData?.pir_state ? "Motion Detected" : "No Motion", color: "bg-blue-100 dark:bg-blue-800" },
            { label: "LDR Value", value: sensorData?.ldr_value, color: "bg-yellow-100 dark:bg-yellow-800" },
            { label: "Temperature", value: `${sensorData?.temperature}°C`, color: "bg-red-100 dark:bg-red-800" },
            { label: "Gas Level", value: sensorData?.gas_value, color: "bg-green-100 dark:bg-green-800" },
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
      <div className="mt-6 p-6 shadow-md rounded-lg bg-white dark:bg-gray-800">
        <h2 className="text-xl font-semibold mb-4">Recent Sensor Updates</h2>
        <ul className="space-y-2">
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <li key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded shadow-sm">
                <span className="font-medium">{new Date(log.timestamp).toLocaleTimeString()}:</span>{" "}
                <span className="text-red-600 dark:text-red-400 font-semibold">Temp: {log.temperature}°C</span>,{" "}
                <span className="text-green-600 dark:text-green-400 font-semibold">Gas: {log.gas_value}</span>,{" "}
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  PIR: {log.pir_state ? "Motion" : "No Motion"}
                </span>,{" "}
                <span className="text-yellow-600 dark:text-yellow-400 font-semibold">LDR: {log.ldr_value}</span>
              </li>
            ))
          ) : (
            <p>No recent updates available.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
