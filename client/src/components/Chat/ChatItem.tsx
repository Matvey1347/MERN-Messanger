import { Stack } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { Chat } from "../../interfaces/Chat";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

interface ChatItemProps {
  chat: Chat,
  unreadMessages: { [chatId: string]: number },
  onClickDelete: (chat: Chat) => void,
  onClickEdit: (chat: Chat) => void,
  onClickItem: (chat: Chat) => void,
}

const ChatItem = ({ chat, unreadMessages, onClickDelete, onClickEdit, onClickItem }: ChatItemProps) => {
  return (
    <Card
      className="py-2 px-2 text-start"
      role="button"
      onClick={() => {
        onClickItem(chat);
      }}
    >
      <Stack
        direction="horizontal"
        className="d-flex justify-content-between"
      >
        {chat.name}
        <Stack direction="horizontal" gap={3}>
          <div className="notifications text-white">
            <span>{unreadMessages[chat._id] || 0}</span>
          </div>
          <MdDelete onClick={() => onClickDelete(chat)} />
          <FaEdit onClick={() => onClickEdit(chat)} />
        </Stack>
      </Stack>
    </Card>
  );
}

export default ChatItem;