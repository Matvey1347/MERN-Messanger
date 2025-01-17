import { useContext, useEffect, useRef, useState } from "react";

import { ChatContext } from "../../context/ChatContext";
import ErrorPreview from "../ErrorPreview";
import Loader from "../Loader";
import { Button, Card, Stack } from "react-bootstrap";
import { Message, OnlineUser } from "../../interfaces/Chat";
import { AuthContext } from "../../context/AuthContext";
import InputEmoji from "react-input-emoji";
import { GrSend } from "react-icons/gr";

const ChatBox = () => {
  const { user } = useContext(AuthContext);
  const {
    currentChat, messages, messagesError, isMessagesLoading, onlineUsers, sendMessage
  } = useContext(ChatContext);

  const [textMessage, setTextMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  if (!currentChat) {
    return (
      <Stack>
        <Card style={{ height: '80vh', minHeight: '500px' }} className="d-flex justify-content-center align-items-center mb-4">
          <Card.Text>
            Unfortunately you don't have chat rooms (
          </Card.Text>
        </Card>
      </Stack>
    )
  }


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
                        <div className="sender-preview">
                          {message.senderName}

                          {onlineUsers.map((user: OnlineUser, i: number) => {
                            if (user.userId === message.senderId) {
                              return <span className="online" key={i}></span>
                            }
                          })}
                        </div>
                        <div>
                          <div className="message mb-1">
                            {message.text}
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    const lastElement = acc[acc.length - 1];
                    const newMessage = (
                      <div className="message mb-1">
                        {message.text}
                      </div>
                    );

                    acc[acc.length - 1] = (
                      <div className={curUserMessageWrapClasses} key={lastElement.key}>
                        <div>{lastElement.props.children[0]}</div>
                        <div className="flex-grow-0 ">
                          {lastElement.props.children[1].props.children}
                          {newMessage}
                        </div>
                      </div>
                    );
                  }

                  return acc;
                }, [])
              }
              <div ref={messagesEndRef} />
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