import { useState, useEffect } from "react";
import supabase from "../services/supabaseClient";
import "tailwindcss";

const Controls = () => {
  const [deviceStates, setDeviceStates] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔹 Fetch current device states from Supabase
    const fetchDeviceStates = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("device_states")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("❌ Error fetching device states:", error);
      } else {
        console.log("✅ Fetched Device States:", data);
        setDeviceStates(data);
      }
      setLoading(false);
    };

    fetchDeviceStates();
  }, []);

  // 🔹 Handle toggle switch
  const toggleDevice = async (device) => {
    if (!deviceStates) return;

    const updatedState = !deviceStates[device];

    console.log(`🔄 Toggling ${device}:`, updatedState);

    // Update state locally for instant UI feedback
    setDeviceStates((prevState) => ({
      ...prevState,
      [device]: updatedState,
    }));

    // 🔹 Fetch the latest row's ID
    const { data, error: fetchError } = await supabase
      .from("device_states")
      .select("id")
      .order("timestamp", { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !data) {
      console.error("❌ Error fetching latest device state ID:", fetchError);
      return;
    }

    const latestId = data.id;
    console.log("🆔 Updating Row with ID:", latestId);

    // 🔹 Ensure proper Boolean type and update the latest row
    const { error: updateError } = await supabase
      .from("device_states")
      .update({ [device]: updatedState }) // Ensuring strict Boolean type
      .match({ id: latestId });

    if (updateError) {
      console.error("❌ Error updating device state:", updateError);
    } else {
      console.log(`✅ ${device} updated successfully in Supabase.`);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Device Controls</h1>

      {loading ? (
        <p>Loading device states...</p>
      ) : deviceStates ? (
        <div className="mt-4 space-y-4">
          {Object.keys(deviceStates)
            .filter((device) => device !== "id" && device !== "timestamp") // Exclude non-switch fields
            .map((device) => (
              <div
                key={device}
                className="flex items-center justify-between p-4 border rounded-lg shadow"
              >
                <span className="font-semibold">
                  {device.replace("_", " ").toUpperCase()}
                </span>
                <button
                  className={`px-4 py-2 rounded ${
                    deviceStates[device] ? "bg-green-500" : "bg-gray-400"
                  }`}
                  onClick={() => toggleDevice(device)}
                >
                  {deviceStates[device] ? "ON" : "OFF"}
                </button>
              </div>
            ))}
        </div>
      ) : (
        <p>No device states available.</p>
      )}
    </div>
  );
};

export default Controls;
