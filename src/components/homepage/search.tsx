import { auth } from "@/pages/lib/firebase/config";
import { User, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

// ICONS
import { FaMale, FaFemale } from "react-icons/fa";
import { AiOutlineUserDelete } from "react-icons/ai";

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

  // FUNCTION
  // Menyaring teman berdasarkan input pencarian
  const filterUserSearch = usersSearch.filter(
    (user) => user.email.toLowerCase() !== userNow.email
  );

  const handleAddFriend = (friend: any) => {
    // Logika untuk menambahkan teman ke daftar teman obrolan
    alert(`You have added ${friend.username} as a friend!`);
  };

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto border-2 border-gray-200 p-4 bg-white">
      {/* Hasil Pencarian */}
      <ul className="mt-4 space-y-4">
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

              {/* Tombol Add user */}
              {user.email.toLowerCase() !== userNow.email && (
                <button
                  onClick={() => handleAddFriend(user)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Add Friend
                </button>
              )}
            </li>
          ))
        ) : (
          <li className="flex flex-col items-center justify-center space-y-3 text-gray-600 text-sm py-8">
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
