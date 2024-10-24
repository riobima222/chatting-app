import { FaCheck, FaTimes } from "react-icons/fa";
import { AiOutlineUserDelete } from "react-icons/ai";
import { calculateTimeDifference } from "@/utils/calculateDayBetween";
import Image from "next/image";
import { useContext, useEffect } from "react";
import { LoginSuccessContext } from "@/context/loginSuccess";
import Swal from "sweetalert2";

const Notification = ({ friendRequests, handleAccept, handleDecline }: any) => {
  const { loginSuccess }: any = useContext(LoginSuccessContext);
  useEffect(() => {
    if (loginSuccess) {
      Swal.fire({
        title: "Teman di tambahkan !",
        text: "sekarang kamu bisa chatting dengan teman kamu ini",
        timer: 3400,
        icon: "success",
        confirmButtonText: "Close",
      });
    }
  }, [loginSuccess]);
  return (
    <div className="flex flex-col w-full h-full overflow-y-auto border-2 border-gray-200 p-4 bg-white">
      {/* Daftar Notifikasi Permintaan Pertemanan */}
      <ul className="h-full space-y-4">
        {friendRequests && friendRequests.length > 0 ? (
          friendRequests.map((request: any, index: number) => (
            <li
              key={index}
              className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-md"
            >
              <div className="flex items-center space-x-3">
                <Image
                  src="/images/profile.png" // Ganti dengan avatar pengguna
                  alt="Avatar"
                  width={35}
                  height={35}
                  className="rounded-full h-[2em] w-[2em]"
                />
                {/* Info Permintaan Pertemanan */}
                <div>
                  <p className="font-semibold text-gray-800">
                    {`${request.user.username} (meminta pertemanan)`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {calculateTimeDifference(request.createdAt)}
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
              There is no Notification !
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
