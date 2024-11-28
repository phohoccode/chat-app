import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/chat/UserChat";
import { AuthContext } from "../context/AuthContext";

const Chat = () => {
  const { user }: any = useContext(AuthContext);
  const { userChats, isUserChatsLoading, userChatsError } =
    useContext(ChatContext);

  return (
    <Container className="mt-4">
      {userChats?.length < 1 ? null : (
        <Stack direction="horizontal" gap={4} className="align-items-start">
          <Stack className="flex-grow-0 messages-box">
            {isUserChatsLoading && <p>Loading chats...</p>}
            {userChats?.map((chat: any, index: number) => (
              <div key={index}>
                <UserChat chat={chat} user={user} />
              </div>
            ))}
          </Stack>
        </Stack>
      )}
    </Container>
  );
};

export default Chat;
