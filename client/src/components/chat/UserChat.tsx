import { Stack } from "react-bootstrap";
import useFetchRecipientUser from "../../hooks/useFetchRecipient";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";

const UserChat = ({ chat, user }: any) => {
  const { recipientUser }: any = useFetchRecipientUser(chat, user);
  const { onlineUsers }: any = useContext(ChatContext);

  const isOnline = onlineUsers?.some(
    (user: any) => user?.userId === recipientUser?._id
  );

  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card align-items-center p-2 justify-content-between"
    >
      <div className="d-flex">
        <div className="me-2">
          <img
            src={recipientUser?.profilePic}
            alt={recipientUser?.username}
            className="user-avatar"
          />
        </div>
        <div className="text-content">
          <div className="name">{recipientUser?.name}</div>
          <div className="text">Text messages</div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-end">
        <div className="date">28/11/2021</div>
        <div className="this-user-notifications">2</div>
        <span className={isOnline ? "user-online" : ""}></span>
      </div>
    </Stack>
  );
};

export default UserChat;
