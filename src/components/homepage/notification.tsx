import { FaCheck, FaTimes } from "react-icons/fa";
import { AiOutlineUserDelete } from "react-icons/ai";

const Notification = ({ friendRequests, handleAccept, handleDecline }: any) => {
  
  return (
    <div
      className="flex flex-col w-full h-full overflow-y-auto border-2 border-gray-200 p-4 bg-white"
    >
      {/* Daftar Notifikasi Permintaan Pertemanan */}
      <ul className="h-full space-y-4">
        {friendRequests && friendRequests.length > 0 ? (
          friendRequests.map((request: any) => (
            <li
              key={request.id}
              className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-md"
            >
              <div className="flex items-center space-x-3">
                {/* Info Permintaan Pertemanan */}
                <div>
                  <p className="font-semibold text-gray-800">
                    Friend request from {request.userId}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(request.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Tombol Accept dan Decline */}
              <div className="flex items-center space-x-2">
                {request.status === "pending" ? (
                  <>
                    <button
                      className="text-green-500 hover:bg-green-100 p-2 rounded-full"
                      onClick={() => handleAccept(request.id)}
                    >
                      <FaCheck />
                    </button>
                    <button
                      className="text-red-500 hover:bg-red-100 p-2 rounded-full"
                      onClick={() => handleDecline(request.id)}
                    >
                      <FaTimes />
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">
                    {request.status === "accepted" ? "Accepted" : "Declined"}
                  </p>
                )}
              </div>
            </li>
          ))
        ) : (
          <li className="h-full flex flex-col items-center justify-center space-y-3 text-gray-600 text-sm py-8">
            {/* Ikon Tidak Ada Notifikasi */}
            <AiOutlineUserDelete className="w-16 h-16 text-gray-400" />
            <p className="font-semibold text-gray-700">
              No friend requests found
            </p>
            <p className="text-gray-500 text-xs">
              You will see friend requests here.
            </p>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Notification;
