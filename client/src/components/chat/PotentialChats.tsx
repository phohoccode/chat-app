import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

interface PotentialChatsProps {
  potentialChats: any;
  onlineUsers: {
    userId: string;
    socketId: string;
  }[];
  createChat: (fisrtId: string, secondId: string) => Promise<void>;
}

const PotentialChats = () => {
  const { user }: any = useContext(AuthContext);
  const { potentialChats, createChat, onlineUsers }: PotentialChatsProps =
    useContext(ChatContext as any);
    
  return (
    <>
      <div className="all-users">
        {potentialChats?.map((u: any, index: number) => (
          <div
            className="single-user"
            key={index}
            onClick={() => createChat(user._id, u._id)}
          >
            {u?.name}
            <span
              className={`${
                onlineUsers?.some((user: any) => user?.userId === u._id)
                  ? "user-online"
                  : ""
              }`}
            ></span>
          </div>
        ))}
      </div>
    </>
  );
};

export default PotentialChats;
