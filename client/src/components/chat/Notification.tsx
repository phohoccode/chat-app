import { useContext, useState } from "react";
import { ChatContext, ChatContextType } from "../../context/ChatContext";
import { AuthContext, AuthContextType } from "../../context/AuthContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import moment from "moment";

const Notification = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { user }: AuthContextType = useContext(AuthContext) as AuthContextType;
  const {
    notifications,
    userChats,
    allUsers,
    markAllNotificationsAsRead,
    markNotificationAsRead,
  }: ChatContextType = useContext(ChatContext) as ChatContextType;

  const unreadNotifications = unreadNotificationsFunc(notifications);
  const modifiedNotifications = unreadNotifications.map((n: any) => {
    const sender = allUsers.find((u: any) => u._id === n.senderId);

    return {
      ...n,
      senderName: sender?.name,
    };
  });

  console.log("unreadNotifications", unreadNotifications);
  console.log("modifiedNotifications", modifiedNotifications);

  return (
    <div className="notifications">
      <div className="notifications-icon" onClick={() => setIsOpen(!isOpen)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-bell"
          viewBox="0 0 16 16"
        >
          <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6" />
        </svg>
        {unreadNotifications?.length === 0 ? null : (
          <span className="notification-count">
            <span>{unreadNotifications?.length}</span>
          </span>
        )}
      </div>
      {isOpen ? (
        <div className="notifications-box">
          <div className="notifications-header">
            <h3>Thông báo</h3>
            <div
              className="mark-as-read"
              onClick={() => markAllNotificationsAsRead(notifications)}
            >
              Đánh dấu đã đọc
            </div>
          </div>
          {modifiedNotifications?.length === 0 ? (
            <span>Không có thông báo...</span>
          ) : null}
          {modifiedNotifications?.map((n: any, index: number) => (
            <div
              key={index}
              onClick={() => {
                markNotificationAsRead(n, userChats, user, notifications);
                setIsOpen(false);
              }}
              className={n.isRead ? "notification" : "notification not-read"}
            >
              <span>{`${n.senderName} đã gửi bạn tin nhắn mới`}</span>
              <span className="notification-time">
                {moment(n.date).calendar()}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Notification;
