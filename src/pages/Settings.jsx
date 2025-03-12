import { useState, useEffect } from "react";
import supabase from "../services/supabaseClient";
import "tailwindcss";

const Settings = () => {
  const [rules, setRules] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Fetch automation rules
    const fetchRules = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("automation_rules")
        .select("*")
        .limit(1)
        .single();

      if (error) {
        console.error("❌ Error fetching rules:", error);
      } else {
        setRules(data);
      }
      setLoading(false);
    };

    fetchRules();
  }, []);

  // 🔹 Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRules((prevRules) => ({
      ...prevRules,
      [name]: value,
    }));
  };

  // 🔹 Update Rules in Supabase
  const updateRules = async () => {
    if (!rules) return;

    setSaving(true);

    const { error } = await supabase
      .from("automation_rules")
      .update({
        ldr_threshold: Number(rules.ldr_threshold),
        temp_threshold: Number(rules.temp_threshold),
        gas_threshold: Number(rules.gas_threshold),
        auto_mode: rules.auto_mode === "true" || rules.auto_mode === true, // Convert to Boolean
      })
      .eq("id", rules.id);

    if (error) {
      console.error("❌ Error updating rules:", error);
    } else {
      console.log("✅ Automation rules updated successfully.");
    }

    setSaving(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Automation Settings</h1>

      {loading ? (
        <p>Loading settings...</p>
      ) : rules ? (
        <div className="mt-4 space-y-4">
          <div className="p-4 border rounded-lg shadow">
            <h2 className="font-semibold">LDR Threshold</h2>
            <input
              type="number"
              name="ldr_threshold"
              value={rules.ldr_threshold}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="p-4 border rounded-lg shadow">
            <h2 className="font-semibold">Temperature Threshold (°C)</h2>
            <input
              type="number"
              name="temp_threshold"
              value={rules.temp_threshold}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="p-4 border rounded-lg shadow">
            <h2 className="font-semibold">Gas Threshold</h2>
            <input
              type="number"
              name="gas_threshold"
              value={rules.gas_threshold}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="p-4 border rounded-lg shadow">
            <h2 className="font-semibold">Automation Mode</h2>
            <select
              name="auto_mode"
              value={rules.auto_mode}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </div>

          <button
            className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            onClick={updateRules}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      ) : (
        <p>No automation rules found.</p>
      )}
    </div>
  );
};

export default Settings;
