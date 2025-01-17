import { Notification } from "../interfaces/Chat";

export function getUserChatUnreadNotificationsCount(notifications: Notification[], chatId: string) {
  return notifications.filter((notification: Notification) => {
    if (notification.chatId === chatId && !notification.isRead) {
      return notification;
    }
  })?.length || 0;
}


export function getAllUserUnreadNotifications(notifications: Notification[]) {
  return notifications.filter((notification: Notification) => {
    if (!notification.isRead) {
      return notification;
    }
  })
}