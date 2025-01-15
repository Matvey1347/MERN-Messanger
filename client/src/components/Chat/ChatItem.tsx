import { Stack } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { Chat } from "../../interfaces/Chat";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

interface ChatItemProps {
  chat: Chat,
  onClickDelete: (chat: Chat) => void,
  onClickEdit: (chat: Chat) => void,
  onClickItem: (chat: Chat) => void,
}

const ChatItem = ({ chat, onClickDelete, onClickEdit, onClickItem }: ChatItemProps) => {
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
        className="d-flex justify-content-between mb-2"
      >
        {chat.name}
        <Stack direction="horizontal" gap={3}>
          <MdDelete onClick={() => onClickDelete(chat)} />
          <FaEdit onClick={() => onClickEdit(chat)} />
        </Stack>
      </Stack>
      <Stack
        direction="horizontal"
        className="d-flex justify-content-between"
      >
        <div className="date">12/11/2024 10:00</div>
        <div className="notifications text-white">
          <span>2</span>
        </div>
      </Stack>

    </Card>
  );
}

export default ChatItem;