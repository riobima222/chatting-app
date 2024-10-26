import { createContext, useState } from "react";

export const MessagesContext = createContext({});

const MessagesProvider = ({children}: {children: React.ReactNode}) => {
    const [messages, setMessages] = useState([]);
    
    return (
        <MessagesContext.Provider value={{messages, setMessages}}>
            {children}
        </MessagesContext.Provider>
    )
}
export default MessagesProvider

