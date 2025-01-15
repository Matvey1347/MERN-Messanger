import { Button, Stack, } from "react-bootstrap";
import { Chat, EditingChat } from "../../interfaces/Chat";
import { User } from "../../interfaces/Auth";
import ChatItem from "./ChatItem";
import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import DeleteChatModal from "./modals/DeleteChatModal";
import ChatFormModal from "./modals/ChatFormModal";

const ChatList = ({ chats, user }: { chats: Chat[], user: User | null }) => {
  const { editingChat, setEditingChat, deleteChat, setUserChatsError, createChat, updateChat } = useContext(ChatContext);
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
                user={user}
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
          console.log(formValues);
          const userId = user?._id;
          if (userId) {
            const chat = editingChat as EditingChat;
            if (!chat?._id) {
              createChat({
                name: formValues.name,
                members: [...formValues.members, userId]
              });
              setShowChatFormModal(false);
            } else {
              updateChat({
                name: formValues.name,
                members: [...formValues.members, userId]
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