import React, { FormEvent, useContext, useEffect, useState } from "react";
import Image from "next/image";
import { AiOutlineMenu } from "react-icons/ai";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase/config";
import Loading from "@/components/loading";
import { signOut } from "firebase/auth";
import Chat from "@/components/homepage/chat";
import { ChatAppearContext } from "@/context/chatAppear";
import { SearchAppearContext } from "@/context/searchAppear";
import Search from "@/components/homepage/search";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Notification from "@/components/homepage/notification";
import NotificationIcon from "@/components/navbar/notificationIcon";
import { NotificationAppearContext } from "@/context/notificationAppear";
import { LoginSuccessContext } from "@/context/loginSuccess";
import { retriveFriendsList } from "@/utils/homepage/retriveFriendsList";
import { retriveMessages } from "@/utils/homepage/retriveMessages";

const ChatPage: React.FC = () => {
  const [user, setUser] = useState<User | null | boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [usersSearch, setUserSearch] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [friendsList, setFriendsList] = useState<any>([]);
  console.log("lihat friendsList: ", friendsList);
  const [selectedFriend, setSelectedFriend] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [friendRequest, setFriendRequest] = useState<any>([]);
  const [friendId, setFriendId] = useState<string>("");
  const currentUser = auth.currentUser as any;

  // GET CONTEXT
  const { chatAppear, setChatAppear }: any = useContext(ChatAppearContext);
  const { searchAppear, setSearchAppear }: any =
    useContext(SearchAppearContext);
  const { notificationAppear, setNotificationAppear }: any = useContext(
    NotificationAppearContext
  );
  const { setLoginSuccess }: any = useContext(LoginSuccessContext);

  // HOOKS :
  useEffect(() => {
    if (currentUser) {
      let unsubscribe1: () => void;
      let unsubscribe2: () => void;
      let unsubscribe3: () => void;

      try {
        const q = query(
          collection(db, "friends"),
          where("user2", "==", currentUser.uid)
        );
        unsubscribe1 = onSnapshot(q, (snapshot) => {
          const results = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          const requestPending = results.filter(
            (doc: any) => doc.status === "pending"
          );
          const friendIds = requestPending.map((doc: any) => doc.user1);
          const retriveFriends = async () => {
            await fetch("/api/get-request-friend", {
              method: "POST",
              body: JSON.stringify({ friendIds }),
              headers: {
                "Content-Type": "application/json",
              },
              cache: "no-store",
            })
              .then((res) => res.json())
              .then((data) => {
                const userOfFriendRequests: any[] = [];
                data.data.forEach((user: any) => {
                  userOfFriendRequests.push({
                    username: user.username,
                    email: user.email,
                  });
                });
                const combined = requestPending.map((request, index) => {
                  return {
                    ...request,
                    user: userOfFriendRequests[index],
                  };
                });
                setFriendRequest(combined);
              });
          };
          retriveFriends();
        });
      } catch (err) {
        console.log(err);
      }

      // AMBIL FRIENDS LIST
      try {
        unsubscribe2 = retriveFriendsList(currentUser.uid, (data: any) => {
          setFriendsList(data);
          if (data && data.length > 0) {
            setFriendsList(data);
            // Set up messages listener after friends list is updated
            try {
              unsubscribe3 = retriveMessages(
                currentUser.uid,
                data, // Use friendsData instead of friendsList state
                (updateFriendsList: any) => {
                  const sortedUsers = updateFriendsList.sort((a: any, b: any) => {
                      const aMessagesLength = a.messages?.length || 0; // menggunakan optional chaining
                      const bMessagesLength = b.messages?.length || 0;

                      const aHasMultipleMessages = aMessagesLength > 0 ? 1 : 0;
                      const bHasMultipleMessages = bMessagesLength > 0 ? 1 : 0;

                      return bHasMultipleMessages - aHasMultipleMessages;
                    }
                  );
                  setFriendsList(sortedUsers);
                }
              );
            } catch (err) {
              console.error("Error in retrieve messages:", err);
            }
          }
        });
      } catch (err) {
        console.log(err);
      }
      return () => {
        if (unsubscribe1) unsubscribe1();
        if (unsubscribe2) unsubscribe2();
        if (unsubscribe3) unsubscribe3();
      };
    }
  }, [currentUser]);

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
    setChatAppear(false);
    setNotificationAppear(false);
    setSearchAppear(true);
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

  const handleSelectFriend = (friend: any) => {
    setFriendId(friend.id);
    setSelectedFriend(friend.username);
    setIsSidebarOpen(false); // Close sidebar on mobile after selecting a friend
    setChatAppear(true);
    setNotificationAppear(false);
    setSearchAppear(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAcceptRequest = async (friendId: string) => {
    await fetch("/api/friends/accept", {
      method: "POST",
      body: JSON.stringify({ friendId }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + currentUser.accessToken,
      },
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((response) => {
        setLoginSuccess(true);
        setTimeout(() => {
          setLoginSuccess(false);
        }, 3500);
      });
  };

  const handleDeclineRequest = async () => {};

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
            {friendsList.map((friend: any, key: number) => (
              <li
                key={key}
                className={`flex items-center justify-between p-2 text-sm rounded-lg cursor-pointer hover:bg-red-200 transition-colors ${
                  selectedFriend === friend.username
                    ? "bg-red-500 text-white"
                    : "bg-white text-gray-700"
                }`}
                onClick={() => handleSelectFriend(friend)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Image
                      src="/images/profile.png" // Ganti dengan avatar pengguna
                      alt="Avatar"
                      width={35}
                      height={35}
                      className="rounded-full h-[1.4em] w-[1.4em]"
                    />
                    {/* Notifikasi pesan yang belum dibaca */}
                    <span
                      className={`${
                        friend.messages?.length > 0 ? "" : "hidden"
                      } absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full`}
                    >
                      {friend.messages?.length}
                    </span>
                  </div>
                  <span>{friend.username}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Area Chat */}
        <div className="flex flex-col w-full md:w-3/4 h-full">
          {/* Header Chat */}
          <div className="hidden md:flex items-center justify-between bg-red-600 px-4 py-1">
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col justify-center items-center">
                <Image
                  src={"/images/chatting-app-logo.png"}
                  alt="logo-image"
                  width={35}
                  height={35}
                  className="h-[2em] w-[2em]"
                />
                <span className="text-white">erchat</span>
              </div>
              <div className="flex items-center">
                <NotificationIcon notificationCount={friendRequest.length} />
                <div className="flex flex-col justufy-center ml-4 items-center">
                  <Image
                    src="/images/profile.png" // Ganti dengan avatar pengguna
                    alt="Avatar"
                    width={35}
                    height={35}
                    className="rounded-full h-[2em] w-[2em]"
                  />
                  <span className="text-white">{currentUser.displayName}</span>
                </div>

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

          {chatAppear && <Chat userId={currentUser.uid} friendId={friendId} />}
          {searchAppear && <Search usersSearch={usersSearch} />}
          {notificationAppear && (
            <Notification
              friendRequests={friendRequest}
              handleAccept={handleAcceptRequest}
              handleDecline={handleDeclineRequest}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
function unsubscribe1() {
  throw new Error("Function not implemented.");
}
