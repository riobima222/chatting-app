import { useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "User1", text: "Hi, how are you?" },
    { id: 2, sender: "rioBima354", text: "I am fine, thank you!" },
    { id: 1, sender: "User1", text: "I am fine, thank you!" },
    { id: 2, sender: "rioBima354", text: "I am fine, thank you!" },
    { id: 2, sender: "User1", text: "I am fine, thank you!" },
    { id: 2, sender: "rioBima354", text: "I am fine, thank you!" },
    { id: 2, sender: "User1", text: "I am fine, thank you!" },
    { id: 2, sender: "rioBima354", text: "I am fine, thank you!" },
    { id: 2, sender: "User1", text: "I am fine, thank you!" },
    { id: 2, sender: "User1", text: "I am fine, thank you!" },
    { id: 2, sender: "User1", text: "I am fine, thank you!" },
    { id: 2, sender: "User1", text: "I am fine, thank you!" },
    { id: 2, sender: "rioBima354", text: "I am fine, thank you!" },
    { id: 2, sender: "rioBima354", text: "I am fine, thank you!" },
    { id: 2, sender: "rioBima354", text: "I am fine, thank you!" },
    { id: 2, sender: "User1", text: "I am fine, thank you!" },
    { id: 2, sender: "User1", text: "I am fine, thank you!" },
    { id: 2, sender: "rioBima354", text: "I am fine, thank you!" },
    { id: 2, sender: "rioBima354", text: "I am fine, thank you!" },
    { id: 2, sender: "User1", text: "I am fine, thank you!" },
    { id: 2, sender: "User1", text: "I am fine, thank you!" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  // HOOKS

  // FUNCTION
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, sender: "User1", text: newMessage },
      ]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto">
      {/* Area Pesan */}
      <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
        {messages.map((message: any, index: number) => (
          <div
            key={index}
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
  );
};
export default Chat;
