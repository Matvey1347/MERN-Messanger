import { ButtonToolbar, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaRegMessage } from "react-icons/fa6";
import { getAllUserUnreadNotifications } from "../utils/unreadNotifications";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

const Notification = () => {
  const { notifications, markAllNotificationsAsRead } = useContext(ChatContext);

  const unreadNotifications = getAllUserUnreadNotifications(notifications);

  return (
    <ButtonToolbar onClick={markAllNotificationsAsRead}>
      <OverlayTrigger placement="bottom" overlay={<Tooltip id="tooltip" className="main-font-family">
        {unreadNotifications.length ? "Mark all as readed" : "No notifications yet ("}
      </Tooltip>} >
        <div className="unread-message" role="button">
          <FaRegMessage fill="#fff" />
          {unreadNotifications.length ? <span className="unread-message-count">{unreadNotifications.length}</span> : ""}
        </div>
      </OverlayTrigger>
    </ButtonToolbar>
  );
}

export default Notification;