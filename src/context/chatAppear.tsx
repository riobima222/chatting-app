import React, { createContext, useState } from "react";

export const ChatAppearContext = createContext({});

const ChatAppearProvider = ({ children }: { children: React.ReactNode }) => {
  const [ chatAppear, setChatAppear] = useState(false);

  return (
    <ChatAppearContext.Provider value={{ chatAppear, setChatAppear }}>
      {children}
    </ChatAppearContext.Provider>
  );
};

export default ChatAppearProvider;
