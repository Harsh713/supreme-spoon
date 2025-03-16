import CamFeed from "../components/CameraFeed";

const Camera = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">📷 Live Camera Feed</h1>
      <CamFeed />
    </div>
  );
};

export default Camera;
