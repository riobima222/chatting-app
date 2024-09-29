import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AiOutlineMenu } from "react-icons/ai";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/pages/lib/firebase/config";
import Loading from "@/components/loading";
import { signOut } from "firebase/auth";

const ChatPage: React.FC = () => {
  const [user, setUser] = useState<User | null | boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  console.log("USER definition", user);
  const [messages, setMessages] = useState([
    { id: 1, sender: "Ratna_aulia313", text: "Hi, how are you?" },
    { id: 2, sender: "rioBima354", text: "I am fine, thank you!" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [friendFound, setFriendFound] = useState(false);
  const [friendName, setFriendName] = useState("");
  const [friendsList, setFriendsList] = useState([
    { name: "Ratna_aulia313", email: "friend@example.com" },
    { name: "rioBima354", email: "otherfriend@example.com" },
  ]);
  const [selectedFriend, setSelectedFriend] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    console.log("masuk kesini");
    const unsubcribe = onAuthStateChanged(auth, (user) => {
      console.log("melihat user: ", user);
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
      await signOut(auth); // Menggunakan signOut dari Firebase
      window.location.href = "/login"; // Redirect ke halaman login setelah logout
    } catch (error) {
      console.error("Error saat logout:", error);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, sender: "User1", text: newMessage },
      ]);
      setNewMessage("");
    }
  };

  const handleSearchFriend = () => {
    const foundFriend = friendsList.find(
      (friend) => friend.email === searchEmail
    );
    if (foundFriend) {
      setFriendFound(true);
      setFriendName(foundFriend.name);
    } else {
      setFriendFound(false);
      alert("Friend not found");
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
            <input
              type="email"
              className="w-full p-2 border rounded-md focus:outline-none text-sm"
              placeholder="Search by email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
            <button
              className="mt-2 bg-red-500 text-white w-full px-3 py-2 rounded-md text-sm hover:bg-red-600 transition-colors"
              onClick={handleSearchFriend}
            >
              Search
            </button>
          </div>

          <ul className="space-y-2">
            {friendsList.map((friend) => (
              <li
                key={friend.email}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-red-200 transition-colors ${
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
                  className="rounded-full h-[2em] w-[2em]"
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
            <h1 className="text-white text-lg font-medium">
              {selectedFriend
                ? `Chat with ${selectedFriend}`
                : "Select a Friend"}
            </h1>
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
                className="ml-4 bg-white text-red-600 px-4 py-2 rounded-md hover:bg-red-50 transition-colors text-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>

          {/* Area Pesan */}
          <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "User1" ? "justify-end" : "justify-start"
                } mb-2`}
              >
                <div
                  className={`rounded-lg p-2 max-w-xs text-sm ${
                    message.sender === "User1"
                      ? "bg-red-500 text-white"
                      : "bg-white text-gray-700"
                  } shadow-md`}
                >
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Pesan */}
          <div className="p-3 border-t border-gray-300 sticky bottom-0 bg-white">
            <div className="flex items-center">
              <input
                type="text"
                className="flex-grow p-2 border rounded-md focus:outline-none focus:ring focus:ring-red-500 text-sm"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                className="ml-2 bg-red-500 text-white px-3 py-2 rounded-md text-sm hover:bg-red-600 transition-colors"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
