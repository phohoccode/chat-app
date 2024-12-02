import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { getRequest, baseUrl } from "../utils/services";

export const useFetchLastestMessage = (chat: any) => {
  const { newMessage, notifications }: any = useContext(ChatContext);
  const [lastestMessage, setLastestMessage] = useState<any>(null);

  useEffect(() => {
    const getMessages = async () => {
      const response = await getRequest(`${baseUrl}/messages/${chat?._id}`);

      if (response.error) {
        return console.log("Error fetching messages", response.error);
      }

      const lastestMessage = response[response.length - 1];

      setLastestMessage(lastestMessage);
    };

    getMessages();
  }, [newMessage, notifications]);

  return { lastestMessage };
};

export default useFetchLastestMessage;
