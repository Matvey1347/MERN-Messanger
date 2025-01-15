import { createContext, ReactNode, useEffect, useState } from "react";
import { baseUrl, deleteRequest, getRequest, postRequest, putRequest } from "../utils/services";
import { User } from "../interfaces/Auth";
import { Chat, ChatContextParams, EditingChat } from "../interfaces/Chat";

const defEditingChatValue = { name: "", members: [] };

export const ChatContext = createContext<ChatContextParams>({
  userChats: [],
  userChatsError: "",
  users: [],
  isUserChatsLoading: false,
  isShowModalChatLoader: false,
  editingChat: defEditingChatValue,

  setUserChatsError: () => { },
  setEditingChat: () => { },
  getUserChats: () => { },
  deleteChat: () => { },
  createChat: () => { },
  updateChat: () => { },
});

export const ChatContextProvider = ({ children, user }: { children: ReactNode, user: User | null }) => {
  const [userChats, setUserChats] = useState<Chat[]>([]);
  const [userChatsError, setUserChatsError] = useState<string>("");
  const [isUserChatsLoading, setIsUserChatsLoading] = useState<boolean>(false);

  const [users, setUsers] = useState<User[]>([]);

  const [editingChat, setEditingChat] = useState<EditingChat | {}>(defEditingChatValue);
  const [isShowModalChatLoader, setIsShowModalChatLoader] = useState(false);

  useEffect(() => {
    getUserChats();
    getUsers();
  }, [user]);

  const getUserChats = async () => {
    setIsUserChatsLoading(true);

    const userId = user?._id;
    if (userId) {
      const res = await getRequest(`${baseUrl}/chats/${userId}`);
      setIsUserChatsLoading(false);
      if (res.error) return setUserChatsError(res.message);
      setUserChats(res.data);
    }
  }

  const getUsers = async () => {
    const userId = user?._id;
    if (userId) {
      const res = await getRequest(`${baseUrl}/users/`);
      if (res.error) return setUserChatsError(res.message);
      setUsers(res.data);
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
  }

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

  return <ChatContext.Provider value={{
    userChats,
    userChatsError,
    isUserChatsLoading,
    isShowModalChatLoader,
    editingChat,
    users,

    setUserChatsError,
    setEditingChat,
    getUserChats,
    deleteChat,
    createChat,
    updateChat
  }}>
    {children}
  </ChatContext.Provider>
}