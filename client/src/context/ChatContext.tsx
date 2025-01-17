import { createContext, ReactNode, useCallback, useEffect, useState } from "react";
import { baseUrl, deleteRequest, getRequest, postRequest, putRequest } from "../utils/services";
import { User } from "../interfaces/Auth";
import { Chat, ChatContextParams, EditingChat, Message, NewMessage, Notification, OnlineUser } from "../interfaces/Chat";
import { io } from "socket.io-client";

const defEditingChatValue = { name: "", members: [] };
const defChatValue = { _id: "", members: [], name: "" };

export const ChatContext = createContext<ChatContextParams>({
  userChats: [],
  userChatsError: "",
  users: [],
  isUserChatsLoading: false,
  isShowModalChatLoader: false,
  editingChat: defEditingChatValue,
  currentChat: defChatValue,

  messages: [],
  messagesError: "",
  isMessagesLoading: false,

  onlineUsers: [],
  notifications: [],
  sendMessage: () => { },

  markAllNotificationsAsRead: () => { },
  setCurrentChat: () => { },
  setUserChatsError: () => { },
  setEditingChat: () => { },
  deleteChat: () => { },
  createChat: () => { },
  updateChat: () => { },
});

export const ChatContextProvider = ({ children, user }: { children: ReactNode, user: User | null }) => {
  const [userChats, setUserChats] = useState<Chat[]>([]);
  const [userChatsError, setUserChatsError] = useState<string>("");
  const [isUserChatsLoading, setIsUserChatsLoading] = useState<boolean>(false);

  const [users, setUsers] = useState<User[]>([]);

  const [currentChat, setCurrentChat] = useState<Chat>(defChatValue);

  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesError, setMessagesError] = useState<string>("");
  const [isMessagesLoading, setMessagesLoading] = useState<boolean>(false);

  const [newMessage, setNewMessage] = useState<Message>();

  const [editingChat, setEditingChat] = useState<EditingChat | {}>(defEditingChatValue);
  const [isShowModalChatLoader, setIsShowModalChatLoader] = useState(false);

  const [socket, setSocket] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    getUserChats();
    getUsers();

    const newSocket = io(import.meta.env.VITE_SERVER_URL);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    }
  }, [user]);

  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (onlineUsers: OnlineUser[]) => {
      setOnlineUsers(onlineUsers)
    });

    return () => {
      socket.off("getOnlineUsers");
    }
  }, [socket]);

  useEffect(() => {
    if (socket === null) return;
    socket.emit("sendMessage", {
      message: newMessage,
      chat: currentChat,
    });

  }, [newMessage]);

  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (message: Message) => {
      if ((message.chatId == currentChat._id) && (message.senderId !== user?._id)) setMessages(prev => [...prev, message]);
    });

    socket.on("getHotification", (notification: Notification) => {
      if ((notification.chatId !== currentChat._id) && (notification.senderId !== user?._id)) setNotifications(prev => [...prev, notification]);
    });

    return () => {
      socket.off("getMessage");
      socket.off("getHotification");
    };
  }, [socket, currentChat]);

  const markCurrentChatNotificationsAsRead = () => {
    setNotifications(prev => {
      const updateNotifications = prev.map(notification => {
        notification.isRead = notification.chatId === currentChat._id;
        return notification;
      });
      return updateNotifications;
    });
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => {
      return prev.map(notification => {
        notification.isRead = true;
        return notification;
      });
    });
  };

  useEffect(() => {
    getMesages();
    markCurrentChatNotificationsAsRead();
  }, [currentChat]);

  const getMesages = async () => {
    if (!currentChat) return;
    const curChatId = currentChat._id;
    if (curChatId) {
      setMessagesLoading(true);

      const res = await getRequest(`${baseUrl}/messages/${curChatId}`);
      setMessagesLoading(false);
      if (res.error) return setMessagesError(res.message);
      setMessages(res.data);
    }
  }

  const getUserChats = async () => {
    setIsUserChatsLoading(true);

    const userId = user?._id;
    if (userId) {
      const res = await getRequest(`${baseUrl}/chats/${userId}`);
      setIsUserChatsLoading(false);
      if (res.error) return setUserChatsError(res.message);
      setUserChats(res.data);
      setCurrentChat(res.data[0]);
    }
  }

  const getUsers = async () => {
    const userId = user?._id;
    if (userId) {
      const res = await getRequest(`${baseUrl}/users/`);
      if (res.error) return setUserChatsError(res.message);
      setUsers(res.data.filter((u: User) => u._id !== userId));
    }
  }

  const deleteChat = async () => {
    setIsShowModalChatLoader(true);
    const chat = editingChat as EditingChat;
    const chatId = chat?._id;

    if (chatId) {
      const res = await deleteRequest(`${baseUrl}/chats/${chatId}`);
      setIsShowModalChatLoader(false);
      if (res.error) return setUserChatsError(res.message);
      await getUserChats();
    } else {
      setIsShowModalChatLoader(false);
      return setUserChatsError("Cannot found chat Id ((");
    }
  };

  const createChat = async (newChat: EditingChat) => {
    setIsShowModalChatLoader(true);

    const res = await postRequest(`${baseUrl}/chats`, JSON.stringify(newChat));
    setIsShowModalChatLoader(false);
    if (res.error) return setUserChatsError(res.message);
    await getUserChats();
  };

  const updateChat = async (updatedValue: EditingChat) => {
    setIsShowModalChatLoader(true);

    const chat = editingChat as EditingChat;
    if (chat._id) {
      const res = await putRequest(`${baseUrl}/chats/${chat._id}`, JSON.stringify(updatedValue));
      setIsShowModalChatLoader(false);
      if (res.error) return setUserChatsError(res.message);
      await getUserChats();
    } else {
      setIsShowModalChatLoader(false);
      return setUserChatsError("Cannot found chat Id ((");
    }
  }

  const sendMessage = async (newMessage: NewMessage) => {
    const res = await postRequest(`${baseUrl}/messages`, JSON.stringify(newMessage));
    if (res.error) return setMessagesError(res.message);
    setNewMessage(res.data);
    setMessages(prev => [...prev, res.data]);
  }

  const handleSetCurrentChat = useCallback((chat: Chat) => {
    setCurrentChat(chat);
  }, []);
  const handleSetUserChatsError = useCallback((error: string) => {
    setUserChatsError(error);
  }, []);
  const handleSetEditingChat = useCallback((chat: EditingChat | {}) => {
    setEditingChat(chat);
  }, []);

  return <ChatContext.Provider value={{
    userChats,
    userChatsError,
    isUserChatsLoading,
    isShowModalChatLoader,
    editingChat,
    users,
    currentChat,

    messages,
    messagesError,
    isMessagesLoading,

    notifications,
    onlineUsers,
    sendMessage,
    markAllNotificationsAsRead,

    setCurrentChat: handleSetCurrentChat,
    setUserChatsError: handleSetUserChatsError,
    setEditingChat: handleSetEditingChat,
    deleteChat,
    createChat,
    updateChat
  }}>
    {children}
  </ChatContext.Provider>
}