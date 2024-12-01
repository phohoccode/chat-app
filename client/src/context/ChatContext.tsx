import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { getRequest, baseUrl, postRequest } from "../utils/services";
import { io } from "socket.io-client";

interface ChatProviderProps {
  children: ReactNode;
  user: any;
}

export interface ChatContextType {
  userChats: any;
  isUserChatsLoading: boolean;
  userChatsError: string | null;
  potentialChats: any;
  messages: any;
  isMessagesLoading: boolean;
  messagesError: string | null;
  currentChat: any;
  onlineUsers: {
    userId: string;
    socketId: string;
  };
  notifications: any;
  allUsers: any;
  createChat: (fisrtId: string, secondId: string) => Promise<void>;
  updateCurrentChat: (chat: any) => void;
  sendTextMessage: (
    textMessage: string,
    sender: any,
    currentChatId: string,
    setTextMessage: (value: string) => void
  ) => Promise<void>;
  markAllNotificationsAsRead: (notifications: any) => void;
  markNotificationAsRead: (
    n: any,
    userChats: any,
    user: any,
    notifications: any
  ) => void;
}

export const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children, user }: ChatProviderProps) => {
  const [userChats, setUserChats] = useState<any>(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState<boolean>(false);
  const [userChatsError, setUserChatsError] = useState<string | null>(null);
  const [potentialChats, setPotentialChats] = useState<any>([]);
  const [currentChat, setCurrentChat] = useState<any>(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState<boolean>(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [messages, setMessages] = useState<any>([]);
  const [sendTextMessageError, setSendTextMessageError] = useState<
    string | null
  >(null);
  const [newMessage, setNewMessage] = useState<any>(null);
  const [socket, setSocket] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState<any>([]);
  const [notifications, setNotifications] = useState<any>([]);
  const [allUsers, setAllUsers] = useState<any>([]);

  console.log("notifications", notifications);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // add online users
  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (res: any) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  // send message
  useEffect(() => {
    if (socket === null) return;

    // lấy ra id người nhận từ cuộc trò chuyện hiện tại
    const recipientId = currentChat?.members?.find(
      (id: string) => id !== user?._id
    );

    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  // receive message and notifycation
  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (res: any) => {
      console.log(">>> receive chat", res);

      if (currentChat?._id !== res.chatId) {
        console.log("Id phòng chat không trùng khớp");
        return;
      }

      setMessages((prev: any) => [...prev, res]);
    });

    socket.on("getNotification", (res: any) => {
      console.log(">>> getNotification", res);

      const isChatOpen = currentChat?.members?.some(
        (id: string) => id === res.senderId
      );

      if (isChatOpen) {
        setNotifications((prev: any) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev: any) => [res, ...prev]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

  // khi người dùng login -> get cuộc trò chuyện
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

  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);

      if (response.error) {
        return console.log("Error fetching users", response);
      }

      // lọc ra các người dùng chưa chat với người dùng hiện tại
      const pChats = response.filter((u: any) => {
        let isChatCreated = false;

        // lọc ra những user mà không phải là user hiện tại
        if (user?._id === u._id) {
          return false;
        }

        // kiểm tra xem đã tạo chat với user này chưa
        if (userChats) {
          isChatCreated = userChats.some((chat: any) => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });
        }

        return !isChatCreated;
      });

      setPotentialChats(pChats);
      setAllUsers(response);
    };

    getUsers();
  }, [userChats]);

  // run khi người dùng trò chuyện
  useEffect(() => {
    const getMessages = async () => {
      setIsMessagesLoading(true);
      setMessagesError(null);

      const response = await getRequest(
        `${baseUrl}/messages/${currentChat?._id}`
      );

      setIsMessagesLoading(false);

      if (response.error) {
        return setMessagesError(response.error);
      }

      setMessages(response);
    };
    getMessages();
  }, [currentChat]);

  const sendTextMessage = useCallback(
    async (
      textMessage: string,
      sender: any,
      currentChatId: string,
      setTextMessage: (value: string) => void
    ) => {
      if (!textMessage.trim()) {
        return console.log("Empty message");
      }

      const response = await postRequest(`${baseUrl}/messages`, {
        chatId: currentChatId,
        senderId: sender._id,
        text: textMessage,
      });

      if (response.error) {
        return setSendTextMessageError(response.error);
      }

      setNewMessage(response);
      setMessages((prev: any) => [...prev, response]);
      setTextMessage("");
    },
    []
  );

  const createChat = useCallback(async (firstId: string, secondId: string) => {
    const response = await postRequest(`${baseUrl}/chats`, {
      firstId,
      secondId,
    });

    if (response.error) {
      return console.log("Lỗi khi tạo cuộc trò chuyện!", response);
    }

    setUserChats((prev: any) => [...prev, response]);
  }, []);

  // kích hoạt khi nhấn vào người dùng khác
  const updateCurrentChat = useCallback((chat: any) => {
    setCurrentChat(chat);
  }, []);

  const markAllNotificationsAsRead = useCallback((notifications: any) => {
    const mNofications = notifications?.map((n: any) => {
      return { ...n, isRead: true };
    });

    setNotifications(mNofications);
  }, []);

  const markNotificationAsRead = useCallback(
    (n: any, userChats: any, user: any, notifications: any) => {
      // find chat to open

      const desiredChat = userChats.find((chat: any) => {
        const chatMembers = [user._id, n.senderId];
        const isDesiredChat = chat?.members?.every((member: any) => {
          return chatMembers.includes(member);
        });

        return isDesiredChat;
      });

      // đánh dấu thông báo đã đọc
      const mNofications = notifications?.map((el: any) => {
        if (n.senderId === el.senderId) {
          return { ...n, isRead: true };
        } else {
          return el;
        }
      });

      updateCurrentChat(desiredChat);
      setNotifications(mNofications);
    },
    []
  );

  return (
    <ChatContext.Provider
      value={{
        allUsers,
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        messages,
        isMessagesLoading,
        messagesError,
        currentChat,
        onlineUsers,
        notifications,
        createChat,
        updateCurrentChat,
        sendTextMessage,
        markAllNotificationsAsRead,
        markNotificationAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
