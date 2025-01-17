import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Stack } from "react-bootstrap";
import ChatList from "../components/Chat/ChatList";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import ChatBox from "../components/Chat/ChatBox";
import ErrorPreview from "../components/ErrorPreview";

const ChatPage = () => {
  const {
    userChats,
    userChatsError,
    isUserChatsLoading,
  } = useContext(ChatContext);
  const { user } = useContext(AuthContext);

  return (
    <>
      <Stack direction="horizontal" gap={4} className="chat-page-wrap">
        <Stack
          className="flex-grow-0"
          style={{ minWidth: '20vw' }}
        >
          {
            isUserChatsLoading
              ? <Loader />
              : <ChatList
                chats={userChats}
                user={user}
              />
          }
        </Stack>
        <ChatBox/>
      </Stack>
      <ErrorPreview
        error={userChatsError}
      />
    </>
  );
}

export default ChatPage;