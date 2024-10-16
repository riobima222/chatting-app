import { auth, db } from "@/pages/lib/firebase/config";
import { User, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

// ICONS
import {
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
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
  const [friendsStatus, setFriendsStatus] = useState<any>({});
  const [successAddFriend, setSuccessAddFriend] = useState<boolean>(false);
  const [friendRequest, setFriendRequest] = useState<any>();
  console.log("lihat friend request: ", friendRequest);
  const currentUser = auth.currentUser as any;
  // console.log("userNow: ", currentUser)

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
    if (currentUser) {
      try {
        const q = query(
          collection(db, "friends"),
          where("userId", "==", currentUser.uid)
        );
        onSnapshot(q, (snapshot) => {
          const results = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          const statusFriends: { [friendId: string]: string } = {};
          results.map((doc: any) => {
            statusFriends[doc.friendId] = doc.status;
          });
          setFriendsStatus(statusFriends);
        });
      } catch (err) {
        console.log(err);
      }

      try {
        const q = query(
          collection(db, "friends"),
          where("friendId", "==", currentUser.uid)
        );
        onSnapshot(q, (snapshot) => {
          const results = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          const requestPending = results.filter(
            (doc: any) => doc.status === "pending"
          );
          setFriendRequest(requestPending);
        });
      } catch (err) {
        console.log(err);
      }
    }
  }, [currentUser]);

  // FUNCTION
  const handleAddFriend = async (friend: any) => {
    const data = {
      userId: auth.currentUser?.uid,
      friendId: friend.id,
      status: "pending",
      createdAt: new Date(),
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
    const status = friendsStatus[friend.id];

    // Jika email hasil pencarian adalah email user yang sedang login, jangan tampilkan tombol
    if (friend.email === currentUser?.email) {
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
          onClick={() => handleAddFriend(friend)}
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
              <div>{renderFriendStatus(user)}</div>
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
