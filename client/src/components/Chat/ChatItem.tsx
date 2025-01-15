import { Stack } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { User } from "../../interfaces/Auth";
import { Chat } from "../../interfaces/Chat";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

interface ChatItemProps {
  chat: Chat,
  user: User | null,
  onClickDelete: (chat: Chat) => void,
  onClickEdit: (chat: Chat) => void,
}

const ChatItem = ({ chat, user, onClickDelete, onClickEdit }: ChatItemProps) => {
  return (
    <Card
      className="py-2 px-2 text-start"
      style={{ minWidth: '30vw' }}
      role="button"
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