import { Button, Stack, } from "react-bootstrap";
import { Chat, EditingChat } from "../../interfaces/Chat";
import { User } from "../../interfaces/Auth";
import ChatItem from "./ChatItem";
import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import DeleteChatModal from "./modals/DeleteChatModal";
import ChatFormModal from "./modals/ChatFormModal";

const ChatList = ({ chats, user }: { chats: Chat[], user: User | null }) => {
  const { editingChat, notifications, setEditingChat, setCurrentChat, deleteChat, setUserChatsError, createChat, updateChat } = useContext(ChatContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChatFormModal, setShowChatFormModal] = useState(false);

  return (
    <>
      <Stack gap={1}>
        <Button
          variant="light"
          className="mb-1"
          onClick={() => {
            setEditingChat({});
            setShowChatFormModal(true);
          }}
        >
          Create Chat
        </Button>
        {
          chats.map((chat: Chat, i: number) => {
            return (
              <ChatItem
                key={chat._id + i}
                chat={chat}
                notifications={notifications}
                onClickItem={(chat: Chat) => { 
                  setCurrentChat(chat);
                }}
                onClickDelete={(chat: Chat) => {
                  setEditingChat(chat);
                  setUserChatsError("");
                  setShowDeleteModal(true)
                }}
                onClickEdit={(chat: Chat) => {
                  setEditingChat(chat);
                  setShowChatFormModal(true)
                }}
              />
            );
          })
        }

      </Stack>
      <DeleteChatModal
        show={showDeleteModal}
        setShow={setShowDeleteModal}
        onSubmit={async () => {
          deleteChat();
          setShowDeleteModal(false);
        }}
      />
      <ChatFormModal
        show={showChatFormModal}
        setShow={setShowChatFormModal}
        onSubmit={async (formValues: EditingChat) => {
          const userId = user?._id;
          if (userId) {
            const chat = editingChat as EditingChat;
            const newMembers = formValues.members.includes(userId) ? formValues.members : [...formValues.members, userId];

            if (!chat?._id) {
              createChat({
                name: formValues.name,
                members: newMembers
              });
              setShowChatFormModal(false);
            } else {
              updateChat({
                name: formValues.name,
                members: newMembers
              });
              setShowChatFormModal(false);
            }
          }
        }}
      />
    </>
  );
}

export default ChatList;