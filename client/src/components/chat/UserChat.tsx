import { Stack } from "react-bootstrap";
import useFetchRecipientUser from "../../hooks/useFetchRecipient";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import useFetchLastestMessage from "../../hooks/useFetchLastestMessage";
import moment from "moment";

const UserChat = ({ chat, user }: any) => {
  const { recipientUser }: any = useFetchRecipientUser(chat, user);
  const { onlineUsers, notifications, markThisUserNotifications }: any =
    useContext(ChatContext);
  const { lastestMessage } = useFetchLastestMessage(chat);

  const unreadNotifications = unreadNotificationsFunc(notifications);
  const thisUserNotifications = unreadNotifications?.filter(
    (n: any) => n.senderId === recipientUser?._id
  );
  const isOnline = onlineUsers?.some(
    (user: any) => user?.userId === recipientUser?._id
  );

  const truncateText = (text: string) => {
    let shortText = text.substring(0, 20);
    if (text.length > 20) {
      shortText = shortText + "...";
    }

    return shortText;
  };

  return (
    <Stack
      direction="horizontal"
      gap={3}
      onClick={() => {
        if (thisUserNotifications?.length > 0) {
          markThisUserNotifications(thisUserNotifications, notifications);
        }
      }}
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
          <div className="text">
            {lastestMessage?.text && (
              <span>{truncateText(lastestMessage?.text)}</span>
            )}
          </div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-end">
        <div className="date">
          {moment(lastestMessage?.createAt).calendar()}
        </div>
        <div
          className={
            thisUserNotifications?.length > 0 ? "this-user-notifications" : ""
          }
        >
          {thisUserNotifications?.length > 0
            ? thisUserNotifications?.length
            : ""}
        </div>
        <span className={isOnline ? "user-online" : ""}></span>
      </div>
    </Stack>
  );
};

export default UserChat;
