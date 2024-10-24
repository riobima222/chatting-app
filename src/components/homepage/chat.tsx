import { auth } from "@/lib/firebase/config";
import { ambilChats } from "@/lib/firebase/services";
import { calculateTimeDifference } from "@/utils/calculateDayBetween";
import { useEffect, useRef, useState } from "react";

const Chat = (id: { userId: string; friendId: string }) => {
  const [messages, setMessages] = useState<boolean | any>(false);
  console.log("lihat messages: ", messages);
  const [newMessage, setNewMessage] = useState("");
  const currentUser = auth.currentUser as any;
  const roomId = [id.userId, id.friendId].sort().join("_");

  // REF
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  // HOOKS
  useEffect(() => {
    const checkChatRoom = async () => {
      const res = await fetch("/api/chatroom", {
        method: "POST",
        body: JSON.stringify({ user1: id.userId, user2: id.friendId }),
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
      const response = await res.json();
      if (res.ok) {
        ambilChats(
          roomId,
          (data: {
            id: string;
            createdAt: Date | string;
            senderId: string;
            text: string;
          }) => {
            setMessages(data);
          }
        );
        console.log(response);
      } else {
        console.log(response);
      }
    };
    checkChatRoom();
  }, [id.userId, id.friendId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // FUNCTION
  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const data = {
        message: {
          senderId: id.userId,
          text: newMessage,
          createdAt: new Date(),
        },
        roomId,
      };
      const res = await fetch("/api/chatroom/send", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
        cache: "no-store",
      });
      const response = await res.json();
      if (res.ok) {
        setNewMessage("");
        console.log(response);
      } else {
        console.log(response);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("masuk kesini !");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    handleSendMessage();
  };

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto">
      {/* Area Pesan */}
      <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
        {Array.isArray(messages) &&
          messages.map((message: any, index: number) => (
            <div
              key={index}
              className={`flex ${
                message.senderId === id.userId ? "justify-end" : "justify-start"
              } mb-5`}
            >
              <div>
                <div
                  className={`rounded-lg p-2 max-w-xs text-sm ${
                    message.senderId === id.userId
                      ? "bg-red-500 text-white"
                      : "bg-white text-gray-700"
                  } shadow-md`}
                >
                  <p>{message.text}</p>
                </div>
                <p
                  className={`text-xs text-gray-400 px-2 pt-1 ${
                    message.senderId === id.userId ? "text-end" : "text-start"
                  }`}
                >
                  {calculateTimeDifference(message.createdAt)}
                </p>
              </div>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Pesan */}
      <div className="p-3 border-t border-gray-300 sticky bottom-0 bg-white">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            type="text"
            ref={inputRef}
            className="flex-grow p-2 border rounded-md focus:outline-none focus:ring focus:ring-red-500 text-sm"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            className="ml-2 bg-red-500 text-white px-3 py-2 rounded-md text-sm hover:bg-red-600 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
export default Chat;
