import { createContext, ReactNode, useEffect, useState } from "react";
import { getRequest, baseUrl, postRequest } from "../utils/services";

interface ChatProviderProps {
  children: ReactNode;
  user: any;
}

export const ChatContext = createContext<any>(null);

export const ChatProvider = ({ children, user }: ChatProviderProps) => {
  const [userChats, setUserChats] = useState<any>(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState<boolean>(false);
  const [userChatsError, setUserChatsError] = useState<string | null>(null);

  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
   
        setIsUserChatsLoading(true);
        setUserChatsError(null);
        const response = await getRequest(`${baseUrl}/chats/${user._id}`);
        setIsUserChatsLoading(false);

        if (response.error) {
          return setUserChatsError(response.error);
        }

        setUserChats(response);
      }
    };
    getUserChats();
  }, [user]);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        setIsUserChatsLoading,
        setUserChats,
        setUserChatsError,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
