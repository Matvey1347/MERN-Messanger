import { useContext } from "react";

import { ChatContext } from "../../context/ChatContext";
import ErrorPreview from "../ErrorPreview";

const ChatBox = () => {
  const {
    messages, messagesError, isMessagesLoading
  } = useContext(ChatContext);    
  return (
    <>
      <ErrorPreview
        error={messagesError}
      />
    </>
   );
}
 
export default ChatBox;