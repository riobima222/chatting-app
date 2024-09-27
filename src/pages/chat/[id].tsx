import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/pages/lib/firebase/config";
import Layout from "@/components/layout";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

const ChatPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const { id: chatId } = router.query;
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (chatId && user) {
      const q = query(
        collection(db, `chats/${chatId}/messages`),
        orderBy("createdAt")
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messages);
      });
      return unsubscribe;
    }
  }, [chatId, user]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && user && chatId) {
      await addDoc(collection(db, `chats/${chatId}/messages`), {
        text: newMessage,
        createdAt: serverTimestamp(),
        userId: user.uid,
        userName: user.displayName,
      });
      setNewMessage("");
    }
  };

  return (
    <Layout title="Chat">
      <div className="flex flex-col h-screen">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${
                message.userId === user?.uid ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  message.userId === user?.uid
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300"
                }`}
              >
                <p>{message.text}</p>
                <p className="text-xs mt-1">{message.userName}</p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="p-4 border-t">
          <div className="flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message"
              className="flex-1 border rounded-l-lg p-2"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white rounded-r-lg px-4 py-2"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ChatPage;
