import React, { useState, useEffect } from "react";
import axios from "axios";
import "./message.css";

const Conversation = ({ conversation, id}) => {
  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState("");

  useEffect(() => {
    //filter the conversation which contains my id to get friends id
    const friendId = conversation.conversation.find((m) => m !== id);

    //fetching the friends all information
    axios({
      method: "get",
      url: `http://localhost:5000/friend/${friendId}`,
    })
      .then((result) => {
        setUser(result.data[0].username);
        setProfilePhoto(result.data[0].profilePic);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <div className="message-conversation-body">
        {/* message conversation start--  */}
        <div
          className="message-conversation"
          onClick={(e) => {
            e.preventDefault();
            // setShowConversation(true);
          }}
        >
          <div className="message-conversation-body-left-right">
            <div className="message-conversation-body-left">
              {profilePhoto == "" ? (
                <img
                  src="http://localhost:3000/images/user.png"
                  className="message-conversation-photo"
                />
              ) : (
                <img
                  src={`http://localhost:5000/${profilePhoto.replace(
                    "public\\",
                    ""
                  )}`}
                  className="message-conversation-photo"
                />
              )}
            </div>
            {/* right  */}
            <div className="message-conversation-body-right">
              <div className="message-conversation-content">
                <div className="message-conversation-owner">
                  <span className="message-conversation-owner-text">
                    {user}
                  </span>
                  <span className="online-offline">friend</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* message conversation end --  */}
      </div>
    </>
  );
};

export default Conversation;
