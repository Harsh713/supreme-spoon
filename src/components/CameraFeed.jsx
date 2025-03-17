import { useState, useEffect } from "react";

const CameraFeed = () => {
  const cameraURL = "http://192.168.1.7:8080/video"; // Replace with your IP camera stream URL
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    const checkCameraAvailability = async () => {
      try {
        const response = await fetch(cameraURL, { method: "HEAD" });
        if (!response.ok) {
          throw new Error("Camera not reachable");
        }
        setIsAvailable(true);
      } catch (error) {
        setIsAvailable(false);
      }
    };

    checkCameraAvailability();

    // Recheck every 10 seconds
    const interval = setInterval(checkCameraAvailability, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-2">Live IP Camera Feed</h2>

      {isAvailable ? (
        <img
          src={cameraURL}
          alt="Live Camera Feed"
          className="border rounded shadow-md w-full max-w-md"
        />
      ) : (
        <p className="text-red-500 font-semibold">
          ⚠️ Camera feed is unavailable. Please check your connection.
        </p>
      )}
    </div>
  );
};

export default CameraFeed;
