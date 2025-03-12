import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import supabase from "../services/supabaseClient";

const SensorChart = () => {
  const [sensorHistory, setSensorHistory] = useState([]);

  useEffect(() => {
    const fetchSensorHistory = async () => {
      const { data, error } = await supabase
        .from("sensor_data")
        .select("timestamp, temperature, gas_value")
        .order("timestamp", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching sensor history:", error);
      } else {
        const formattedData = data.map((entry) => ({
          timestamp: new Date(entry.timestamp).toLocaleTimeString(),
          temperature: entry.temperature,
          gas: entry.gas_value,
        }));

        setSensorHistory(formattedData.reverse());
      }
    };

    fetchSensorHistory();
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow bg-white">
      <h2 className="text-xl font-semibold">Temperature & Gas Levels Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={sensorHistory}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="temperature" stroke="#FF5733" />
          <Line type="monotone" dataKey="gas" stroke="#33B5FF" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SensorChart;
