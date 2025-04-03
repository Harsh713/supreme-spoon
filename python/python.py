import time
import random
from supabase import create_client, Client

# 🔹 Supabase Credentials 
SUPABASE_URL = "https://luvlgwgjdpcnfaicxtoe.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1dmxnd2dqZHBjbmZhaWN4dG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3NjAzNzEsImV4cCI6MjA1NzMzNjM3MX0.NlkE_d56okndlJ3E7uuEerQm041HZgqkM3Xu7FghFdQ"

# 🔹 Initialize Supabase Client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Default Thresholds (Fetched from Supabase)
LDR_THRESHOLD = 400
TEMP_THRESHOLD = 30
GAS_THRESHOLD = 300
AUTO_MODE = True

# 🔹 Simulated Sensor Readings
def read_pir_sensor():
    return random.choice([0, 1])  # 0: No motion, 1: Motion detected

def read_ldr_sensor():
    return random.randint(300, 600)  # Simulated LDR values

def read_temp_sensor():
    return round(random.uniform(20, 35), 2)  # Simulated temperature

def read_mq2_sensor():
    return random.randint(100, 500)  # Simulated gas levels

# 🔹 Fetch automation rules from Supabase
def fetch_rules():
    global LDR_THRESHOLD, TEMP_THRESHOLD, GAS_THRESHOLD, AUTO_MODE
    response = supabase.table("automation_rules").select("*").execute()

    if response.data:
        rules = response.data[0]  # Assuming one row exists
        LDR_THRESHOLD = rules.get("ldr_threshold", LDR_THRESHOLD)
        TEMP_THRESHOLD = rules.get("temp_threshold", TEMP_THRESHOLD)
        GAS_THRESHOLD = rules.get("gas_threshold", GAS_THRESHOLD)
        AUTO_MODE = rules.get("auto_mode", AUTO_MODE)
        print(f"Updated Rules: LDR={LDR_THRESHOLD}, TEMP={TEMP_THRESHOLD}, GAS={GAS_THRESHOLD}, AUTO_MODE={AUTO_MODE}")

# 🔹 Update Supabase with simulated sensor data
def update_sensor_data():
    pir_state = read_pir_sensor()
    ldr_value = read_ldr_sensor()
    temp_value = read_temp_sensor()
    gas_value = read_mq2_sensor()

    print(f"PIR: {pir_state} | LDR: {ldr_value} | Temp: {temp_value}°C | Gas: {gas_value}")

    # Insert new sensor data
    supabase.table("sensor_data").insert({
        "pir_state": pir_state,
        "ldr_value": ldr_value,
        "temperature": temp_value,
        "gas_value": gas_value
    }).execute()

    return pir_state, ldr_value, temp_value, gas_value

# 🔹 Automation Logic Based on Sensor Data
def control_devices(pir_state, ldr_value, temp_value, gas_value):
    # Fetch latest automation rules
    fetch_rules()

    if AUTO_MODE:
        fan_state = temp_value >= TEMP_THRESHOLD
        light_state = pir_state == 1
        garden_light_state = ldr_value < LDR_THRESHOLD
        buzzer_state = gas_value > GAS_THRESHOLD

        print(f"Updated Device States - Fan: {fan_state}, Indoor Lights: {light_state}, Garden Lights: {garden_light_state}, Buzzer: {buzzer_state}")

        # Update device states in Supabase
        supabase.table("device_states").insert({
            "fan_status": fan_state,
            "indoor_lights": light_state,
            "garden_lights": garden_light_state,
            "gas_alert": buzzer_state
        }).execute()

# 🔹 Main Loop
while True:
    pir, ldr, temp, gas = update_sensor_data()
    control_devices(pir, ldr, temp, gas)
    time.sleep(10)  # Simulate sensor updates every 5 seconds
