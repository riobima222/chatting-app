import React, { FormEvent, useContext, useEffect, useState } from "react";
import Image from "next/image";
import { AiOutlineMenu } from "react-icons/ai";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/pages/lib/firebase/config";
import Loading from "@/components/loading";
import { signOut } from "firebase/auth";
import Chat from "@/components/homepage/chat";
import { ChatAppearContext } from "@/context/chatAppear";
import { SearchAppearContext } from "@/context/searchAppear";
import Search from "@/components/homepage/search";

const ChatPage: React.FC = () => {
  const [user, setUser] = useState<User | null | boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [usersSearch, setUserSearch] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [friendFound, setFriendFound] = useState(false);
  const [friendName, setFriendName] = useState("");
  const [friendsList, setFriendsList] = useState([
    { name: "Ratna_aulia313", email: "friend@example.com" },
    { name: "rioBima354", email: "otherfriend@example.com" },
  ]);
  const [selectedFriend, setSelectedFriend] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // GET CONTEXT
  const { chatAppear, setChatAppear }: any = useContext(ChatAppearContext);
  const { searchAppear, setSearchAppear }: any =
    useContext(SearchAppearContext);

  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticating(false);
        setUser(user);
      } else {
        setUser(null);
        setIsAuthenticating(false);
      }
    });
    return () => unsubcribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/login";
    } catch (error) {
      console.error("Error saat logout:", error);
    }
  };

  const handleSearchFriend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const res = await fetch("/api/search", {
      method: "POST",
      body: JSON.stringify({ email: searchEmail }),
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    const response = await res.json();
    if (res.ok) {
      setUserSearch(response.data);
      if (response.data.length === 0) form.email.value = "";
    } else {
      form.email.value = "";
      console.log(response);
    }
  };

  const handleSelectFriend = (friendName: string) => {
    setSelectedFriend(friendName);
    setIsSidebarOpen(false); // Close sidebar on mobile after selecting a friend
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isAuthenticating) {
    return <Loading />;
  }
  if (user === null) {
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="flex justify-center items-center bg-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row w-full max-w-5xl h-screen bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Tombol Sidebar untuk Mobile */}
        <div className="md:hidden bg-red-600 text-white p-4 flex justify-between items-center">
          <h1 className="text-lg font-medium">
            {selectedFriend ? `Chat with ${selectedFriend}` : "Select a Friend"}
          </h1>
          <div className="flex items-center space-x-4">
            {/* Tambahan Tombol Logout di Navbar Mobile */}
            <button
              className="bg-white text-red-600 px-4 py-2 rounded-md hover:bg-red-50 transition-colors text-sm"
              onClick={handleLogout}
            >
              Logout
            </button>

            {/* TOOGLE UNTUK MEMUNCULKAN SIDEBAR */}
            <button
              onClick={toggleSidebar}
              className="text-white text-2xl focus:outline-none"
            >
              <AiOutlineMenu />
            </button>
          </div>
        </div>

        {/* Sidebar untuk Daftar Teman dan Search */}
        <div
          className={`${
            isSidebarOpen ? "block" : "hidden"
          } md:block w-full md:w-1/4 bg-gray-200 p-3 border-b md:border-b-0 md:border-r border-gray-300`}
        >
          <h2 className="text-lg font-semibold mb-3 text-center md:text-left">
            Friends
          </h2>

          {/* Pencarian Teman */}
          <div className="mb-3">
            <form onSubmit={handleSearchFriend}>
              <input
                type="email"
                className="w-full p-2 border rounded-md focus:outline-none text-sm"
                placeholder="Search by email..."
                name="email"
                onChange={(e) => setSearchEmail(e.target.value)}
              />
              <button
                type="submit"
                className="mt-2 bg-red-500 text-white w-full px-3 py-2 rounded-md text-sm hover:bg-red-600 transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          <ul className="space-y-2">
            {friendsList.map((friend) => (
              <li
                key={friend.email}
                className={`flex items-center gap-3 p-2 text-sm rounded-lg cursor-pointer hover:bg-red-200 transition-colors ${
                  selectedFriend === friend.name
                    ? "bg-red-500 text-white"
                    : "bg-white text-gray-700"
                }`}
                onClick={() => handleSelectFriend(friend.name)}
              >
                <Image
                  src="/images/profile.png" // Ganti dengan avatar pengguna
                  alt="Avatar"
                  width={35}
                  height={35}
                  className="rounded-full h-[1.4em] w-[1.4em]"
                />
                <span>{friend.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Area Chat */}
        <div className="flex flex-col w-full md:w-3/4 h-full">
          {/* Header Chat */}
          <div className="hidden md:flex items-center justify-between bg-red-600 p-4">
            <div className="flex w-full items-center justify-between">
              <div>Logo</div>
              <div className="flex items-center">
                <Image
                  src="/images/profile.png" // Ganti dengan avatar pengguna
                  alt="Avatar"
                  width={35}
                  height={35}
                  className="rounded-full h-[2em] w-[2em]"
                />

                {/* Tambahan Tombol Logout di Header Desktop */}
                <button
                  className="ml-4 bg-white text-red-600 px-4 py-1 rounded-md hover:bg-red-50 font-bold transition-colors text-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {chatAppear && <Chat />}
          {searchAppear && <Search usersSearch={usersSearch} />}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
