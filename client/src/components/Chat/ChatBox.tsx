import { useContext, useState } from "react";

import { ChatContext } from "../../context/ChatContext";
import ErrorPreview from "../ErrorPreview";
import Loader from "../Loader";
import { Button, Card, Stack } from "react-bootstrap";
import { Message } from "../../interfaces/Chat";
import { AuthContext } from "../../context/AuthContext";
import InputEmoji from "react-input-emoji";
import { GrSend } from "react-icons/gr";

const ChatBox = () => {
  const { user } = useContext(AuthContext);
  const {
    currentChat, messages, messagesError, isMessagesLoading, sendMessage
  } = useContext(ChatContext);

  const [textMessage, setTextMessage] = useState("");
  const [isError, setIsError] = useState(false);

  return (
    <Stack>
      <Card style={{ height: '80vh' }}>
        <Card.Header className="text-center">{isMessagesLoading ? "Loading..." : currentChat.name}</Card.Header>
        <Card.Body style={{ maxHeight: '80%', overflow: 'auto', marginBottom: '1rem' }}>
          {isMessagesLoading ? <Loader /> : (
            <Stack gap={3} style={{ height: '100%' }}>
              {!messages.length ? <Card.Text className="text-center d-flex justify-content-center align-items-center" style={{ height: '100%' }} >No messages here (</Card.Text> :

                messages.reduce((acc: JSX.Element[], message: Message, index: number) => {
                  const isCurrentUserMessage = message.senderId === user?._id;
                  const isSameSender = index > 0 && messages[index - 1].senderId === message.senderId;
                  const curUserMessageWrapClasses = (isCurrentUserMessage ? "cur-user-messages" : "other-messages");

                  if (!isSameSender) {
                    acc.push(
                      <div className={curUserMessageWrapClasses} key={message._id}>
                        <div className="sender-preview">{message.senderName}</div>
                        <div>
                          <div className="message">
                            {message.text}
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    const lastElement = acc[acc.length - 1];
                    const newMessage = (
                      <div className="message">
                        {message.text}
                      </div>
                    );

                    acc[acc.length - 1] = (
                      <div className={curUserMessageWrapClasses} key={lastElement.key}>
                        <div>{lastElement.props.children[0]}</div>
                        <Stack gap={1} className="flex-grow-0">
                          {lastElement.props.children[1].props.children}
                          {newMessage}
                        </Stack>
                      </div>
                    );
                  }

                  return acc;
                }, [])
              }
            </Stack>
          )}
          <ErrorPreview
            error={messagesError}
          />
        </Card.Body>
        <Card.Footer className="d-flex align-items-center">
          <InputEmoji
            value={textMessage}
            onChange={setTextMessage}
            cleanOnEnter
            fontFamily="'Jersey 15', serif"
            borderColor={isError ? "red" : "pink"}
            shouldReturn={true}
            shouldConvertEmojiToImage={false}
            onEnter={() => {
              if (textMessage.trim()) {
                sendMessage({
                  text: textMessage,
                  chatId: currentChat._id,
                  senderId: user?._id || ""
                });
                setTextMessage("");
                setIsError(false);
              } else {
                setIsError(true);
              }
            }}
          />
          <Button
            className="send-btn"
            onClick={() => {
              if (textMessage.trim()) {
                sendMessage({
                  text: textMessage,
                  chatId: currentChat._id,
                  senderId: user?._id || ""
                });
                setTextMessage("");
                setIsError(false);
              } else {
                setIsError(true);
              }
            }}>
            <GrSend />
          </Button>
        </Card.Footer>
      </Card>

    </Stack>
  );
}

export default ChatBox;