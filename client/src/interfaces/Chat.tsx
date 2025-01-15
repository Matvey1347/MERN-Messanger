import { User } from "./Auth"

export interface ChatContextParams {
  userChats: Chat[],
  userChatsError: string,
  isUserChatsLoading: boolean,
  isShowModalChatLoader: boolean,
  editingChat: EditingChat | {},
  users: User[],
  currentChat: Chat,

  messages: Message[],
  messagesError: string,
  isMessagesLoading: boolean,

  sendMessage: (newMessage: NewMessage) => void,

  setCurrentChat: (chat: Chat) => void
  setUserChatsError: (error: string) => void,
  setEditingChat: (chat: EditingChat | {}) => void,
  deleteChat: () => void,
  createChat: (newChat: EditingChat) => void,
  updateChat: (chat: EditingChat) => void,
}

export interface Chat {
  _id: string,
  members: string[],
  name: string
}

export interface EditingChat {
  _id?: string,
  members: string[],
  name: string
}

export interface Message {
  text: string,
  chatId: string,
  senderId: string,
  senderName: string,
  _id: string,
  createdAt: string,
}

export interface NewMessage {
  text: string,
  chatId: string,
  senderId: string,
}