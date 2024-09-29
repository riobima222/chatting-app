import { FaSpinner } from "react-icons/fa";

const Loading: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        {/* Icon Spinner */}
        <FaSpinner className="text-red-500 text-5xl animate-spin" />

        {/* Loading Text */}
        <span className="text-gray-700 text-lg font-medium">
          Loading, please wait...
        </span>
      </div>
    </div>
  );
};

export default Loading;
