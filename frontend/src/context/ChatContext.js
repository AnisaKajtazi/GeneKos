import { createContext, useState } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [selectedChatUser, setSelectedChatUser] = useState(null);

  return (
    <ChatContext.Provider value={{ selectedChatUser, setSelectedChatUser }}>
      {children}
    </ChatContext.Provider>
  );
};
