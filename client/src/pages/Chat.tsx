import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Stack } from "react-bootstrap";
import ChatList from "../components/Chat/ChatList";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";

const ChatPage = () => {
  const {
    userChats,
    userChatsError,
    isUserChatsLoading,
    setEditingChat
  } = useContext(ChatContext);
  const { user } = useContext(AuthContext);

  return (
    <Stack direction="horizontal" gap={4}>
      <Stack className="flex-grow-0">
        
        {
          isUserChatsLoading
            ? <Loader />
            : <ChatList
              chats={userChats}
              user={user}
            />
        }
      </Stack>
      <Stack className="flex-grow-0">Chat Box</Stack>
    </Stack>
  );
}

export default ChatPage;