import { Stack } from "react-bootstrap";
import useFetchRecipientUser from "../../hooks/useFetchRecipient";

const UserChat = ({ chat, user }: any) => {
  const { recipientUser, error }: any = useFetchRecipientUser(chat, user);

  console.log(recipientUser);

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
        <span className="user-online"></span>
      </div>
    </Stack>
  );
};

export default UserChat;
