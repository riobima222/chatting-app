import { auth, db } from "@/lib/firebase/config";
import { User, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

// ICONS
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { FaMale, FaFemale, FaCheckCircle, FaUserPlus } from "react-icons/fa";
import { AiOutlineUserDelete, AiOutlineClockCircle } from "react-icons/ai";

interface Friend {
  id: string;
  username: string;
  email: string;
  photoURL: string;
  status: string;
  age: string;
  gender: string;
}

const Search = ({ usersSearch }: { usersSearch: Friend[] }) => {
  const [userNow, setUserNow] = useState<User | null | boolean | any>(false);
  const [friendStatus, setFriendStatus] = useState<any>([]);
  const [successAddFriend, setSuccessAddFriend] = useState<boolean>(false);
  const currentUser = auth.currentUser as any;
  console.log("lihat : ", currentUser)

  // HOOKS
  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserNow(user);
      } else {
        setUserNow(null);
      }
    });
    return () => unsubcribe();
  }, []);

  useEffect(() => {
    if (successAddFriend) {
      Swal.fire({
        title: "Permintaan Dikirim",
        text: "",
        timer: 2500,
        icon: "question",
        confirmButtonText: "Close",
      });
    }
  }, [successAddFriend]);

  useEffect(() => {
    if (currentUser && usersSearch.length > 0) {
      try {
        const q1 = query(
          collection(db, "friends"),
          where("user2", "==", currentUser.uid),
          where("user1", "==", usersSearch[0].id)
        );

        const q2 = query(
          collection(db, "friends"),
          where("user1", "==", currentUser.uid),
          where("user2", "==", usersSearch[0].id)
        );

        onSnapshot(q1, (snapshot1) => {
          onSnapshot(q2, (snapshot2) => {
            const results = [...snapshot1.docs, ...snapshot2.docs];
            const dataResults = results.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setFriendStatus(dataResults[0]);
          });
        });
      } catch (err) {
        console.log(err);
      }
    }
  }, [currentUser, usersSearch]);

  // FUNCTION
  const handleAddFriend = async (friend: any) => {
    const data = {
      user1: auth.currentUser?.uid,
      user2: friend.id,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    const res = await fetch("/api/add-friend", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + currentUser.accessToken,
      },
      cache: "no-store",
    });
    const response = await res.json();
    if (response.status) {
      setSuccessAddFriend(true);
      setTimeout(() => {
        setSuccessAddFriend(false);
      }, 2500);
    } else {
      console.log("Ada yang salah dengan aplikasi", response);
    }
  };

  const renderFriendStatus = (friend: Friend) => {
    const status = friend?.status;

    // Jika email hasil pencarian adalah email user yang sedang login, jangan tampilkan tombol
    if (usersSearch[0].email === currentUser?.email) {
      return null;
    }

    // Status pending
    if (status === "pending") {
      return (
        <div className="flex items-center space-x-2 text-yellow-500">
          <AiOutlineClockCircle className="w-5 h-5" />
          <span className="text-sm">Pending</span>
        </div>
      );
    }

    // Status accepted (sudah menjadi teman)
    else if (status === "accepted") {
      return (
        <div className="flex items-center space-x-2 text-green-500">
          <FaCheckCircle className="w-5 h-5" />
          <span className="text-sm">Friend</span>
        </div>
      );
    }

    // Tampilkan tombol add friend jika belum pending/accepted
    else {
      return (
        <button
          onClick={() => handleAddFriend(usersSearch[0])}
          className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          <FaUserPlus className="w-5 h-5 mr-2" />
          <span>Add Friend</span>
        </button>
      );
    }
  };

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto border-2 border-gray-200 p-4 bg-white">
      {/* Hasil Pencarian */}
      <ul className="h-full space-y-4">
        {usersSearch.length > 0 ? (
          usersSearch.map((user) => (
            <li
              key={user.email}
              className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-md"
            >
              <div className="flex items-center space-x-3">
                {/* Avatar Teman */}
                <div className="flex-shrink-0">
                  <img
                    src={user.photoURL || "/images/profile.png"}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                </div>

                {/* Info Teman */}
                <div>
                  <p className="font-semibold text-gray-800">{user.username}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p
                    className={`text-xs mt-1 ${
                      user.status === "online"
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    {user.status}
                  </p>
                </div>

                {/* Gender Icon */}
                <div>
                  {user.gender === "male" ? (
                    <FaMale className="text-blue-500 w-6 h-6" />
                  ) : (
                    <FaFemale className="text-pink-500 w-6 h-6" />
                  )}
                </div>
              </div>

              {/* Tombol Add atau Status Pertemanan */}
              <div>{renderFriendStatus(friendStatus)}</div>
            </li>
          ))
        ) : (
          <li className="h-full flex flex-col items-center justify-center space-y-3 text-gray-600 text-sm py-8">
            {/* Ikon User Not Found */}
            <AiOutlineUserDelete className="w-16 h-16 text-gray-400" />
            <p className="font-semibold text-gray-700">No friends found</p>
            <p className="text-gray-500 text-xs">
              Try searching with a different email
            </p>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Search;
