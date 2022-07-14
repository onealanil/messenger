import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import "./message.css";
import Conversation from "./Conversation";
import { format } from "timeago.js";

const Message = ({ socket }) => {
  const [showConversation, setShowConversation] = useState(false);

  //userId or my id
  const [userId, setUserId] = useState("");

  //conversation list
  const [conversationList, setConversationList] = useState([]);

  //get messages
  const [messageCombo, setMessageCombo] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  //current chat or get conversation of me and my user after clicking the conversation
  const [currentChat, setCurrentChat] = useState(null);

  //get conversation id
  const [conversationId, setConversationId] = useState(null);

  //socket id
  const [socketFriendId, setSocketFriendId] = useState(null);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  // getting userId
  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:5000/conversationList",
      headers: {
        authorization: `${localStorage.getItem("auth")}`,
      },
    })
      .then((result) => {
        setUserId(result.data.message);
      })
      .catch((error) => console.error(error.message));
  }, []);

  //fetch all conversation which contains my id
  useEffect(() => {
    if (userId !== "") {
      axios({
        method: "get",
        url: `http://localhost:5000/conversation/${userId}`,
      })
        .then((result) => {
          setConversationList(result.data.result);
        })
        .catch((error) => console.error(error));
    }
  }, [userId]);

  //socket io get message from back to the specific client
  useEffect(() => {
    socket?.on("textMessageFromBack", ({ sender, message }) => {
      console.log(sender, message);
      setArrivalMessage({
        sender: sender,
        msg: message,
      });
    });
  }, [socket]);

  //socket io to get the message and update it after getting from the server
  useEffect(() => {
    arrivalMessage &&
      currentChat?.conversation.includes(arrivalMessage.sender) &&
      setMessageCombo((messageCombo) => [...messageCombo, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  //for sending message
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      conversationId: conversationId,
      senderId: userId,
      msg: newMessage,
    };
    const config = {
      headers: { "content-type": "application/json" },
    };

    axios({
      method: "post",
      url: "http://localhost:5000/messages",
      data,
      headers: config,
    })
      .then((result) => {
        setNewMessage("");
        //to set the messages before and after and automatically update
        setMessageCombo((messageCombo) => [
          ...messageCombo,
          result.data.messages,
        ]);
      })
      .catch((error) => console.error(error.message));

    //for socket io
    const messageData = {
      sender: userId,
      receiver: socketFriendId,
      message: newMessage,
    };
    socket.emit("textMessage", messageData);
  };

  return (
    <>
      <div className="message-box-container">
        <div className="message-box-left-right-container">
          {/* left  */}
          <div className="message-box-left">
            <div className="message-conversation-heading">
              <span className="message-conversation-heading-text">
                Your Conversation List
              </span>
            </div>
            {/* mapping conversation  */}
            {conversationList.map((val) => (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  const friendId = val.conversation.find((m) => m !== userId);
                  setSocketFriendId(friendId);
                  setShowConversation(true);
                  setConversationId(val._id);
                  setCurrentChat(val);

                  //fetching the messages from conversation id or combo id
                  axios({
                    method: "get",
                    url: `http://localhost:5000/messagesCombo/${val._id}`,
                  })
                    .then((result) => {
                      setMessageCombo(result.data.result);
                    })
                    .catch((error) => console.error(error));
                }}
              >
                <Conversation id={userId} conversation={val}/>
              </div>
            ))}
          </div>

          {/* right  */}
          <div className="message-box-right">
            {showConversation ? (
              <>
                {/* message box start  */}
                <div className="message-box-conversation-container">
                  <div className="message-box-conversation-container-bg">
                    {messageCombo.map((val) => (
                      <>
                        {val.senderId === userId ? (
                          <>
                            <div className="message-d-container">
                              <div className="message-d-container-bg">
                                <span className="message-text">{val.msg}</span>
                                <div className="message-d-time">
                                  <span className="message-text-time">
                                    {format(val.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="message-d-container-other">
                              <div className="message-d-container-bg-other">
                                <span className="message-text-other">{val.msg}</span>
                                <div className="message-d-time-other">
                                  <span className="message-text-time-other">
                                    {format(val.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    ))}
                  </div>
                </div>
                {/* send box  */}
                <div className="message-text-box">
                  <input
                    type="text"
                    placeholder="Type your message.."
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                    }}
                    value={newMessage}
                  />
                  <Button
                    variant="contained"
                    endIcon={<SendIcon />}
                    sx={{
                      backgroundColor: "#2673ed",
                      "&:hover": {
                        backgroundColor: "#094cb5",
                        borderColor: "#0062cc",
                        boxShadow: "none",
                      },
                    }}
                    onClick={handleSubmit}
                  >
                    <span className="btn-text">Send</span>
                  </Button>
                </div>
                {/* message box end  */}
              </>
            ) : (
              <>
                <h2 style={{ margin: "2rem 0rem 0rem 10rem" }}>
                  Select One Conversation
                </h2>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Message;
