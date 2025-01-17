import { Stack } from "react-bootstrap";
import { Card } from "react-bootstrap";
import { Chat, Notification } from "../../interfaces/Chat";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { getUserChatUnreadNotificationsCount } from "../../utils/unreadNotifications";

interface ChatItemProps {
  chat: Chat,
  notifications: Notification[],
  onClickDelete: (chat: Chat) => void,
  onClickEdit: (chat: Chat) => void,
  onClickItem: (chat: Chat) => void,
}

const ChatItem = ({ chat, notifications, onClickDelete, onClickEdit, onClickItem }: ChatItemProps) => {

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
        <Stack direction="horizontal" gap={2}>
          {getUserChatUnreadNotificationsCount(notifications, chat._id) ? <div className="notifications text-white">
            <span>{getUserChatUnreadNotificationsCount(notifications, chat._id)}</span>
          </div> : ""}
          <MdDelete onClick={() => onClickDelete(chat)} />
          <FaEdit onClick={() => onClickEdit(chat)} />
        </Stack>
      </Stack>
    </Card>
  );
}

export default ChatItem;