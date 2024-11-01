import { MessagesContext } from "@/context/messages";
import { TriggerContext } from "@/context/trigger";
import { auth } from "@/lib/firebase/config";
import { ambilChats } from "@/lib/firebase/services";
import { calculateTimeDifference } from "@/utils/calculateDayBetween";
import { useContext, useEffect, useRef, useState } from "react";

const Chat = (id: { userId: string; friendId: string; friendMessages: any[] }) => {
  const { messages, setMessages }: any = useContext(MessagesContext);
  const [newMessage, setNewMessage] = useState("");
  const currentUser = auth.currentUser as any;
  const roomId = [id.userId, id.friendId].sort().join("_");

  // CONTEXT :
  const { setTrigger }: any = useContext(TriggerContext);

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
            lastChat: Date | string;
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
  }, [id.userId, id.friendId, roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const timer = setInterval(async () => {
      if (id.friendMessages.length > 0) {
        const res = await fetch("/api/readmessage", {
          method: "POST",
          body: JSON.stringify({ roomId , messages: id.friendMessages}),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + currentUser.accessToken,
          },
          cache: "no-store",
        });
        const response = await res.json();
        if (!res?.ok) {
          console.log(response);
        }
      }
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // FUNCTION
  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const data = {
        message: {
          senderId: id.userId,
          text: newMessage,
          isRead: false,
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    handleSendMessage();
    const res = await fetch("/api/chatroom/update", {
      method: "POST",
      body: JSON.stringify({ roomId }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentUser.accessToken}`,
      },
      cache: "no-store",
    });
    const response = await res.json();
    if (res.ok) {
      setTrigger((prev: boolean) => !prev);
      console.log(response);
    } else {
      console.log(response);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Area Pesan */}
      <div className="p-4 overflow-y-auto bg-gray-50 flex-grow">
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
      <div className="p-3 border-t border-gray-300 bg-white">
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
