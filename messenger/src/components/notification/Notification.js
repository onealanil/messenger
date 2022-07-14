import React, { useEffect, useState } from "react";
import axios from "axios";

const Notification = ({ notification, socket }) => {
  //user info
  const [username, setUsername] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  //userId
  const [userId, setUserId] = useState("");

  // getting userId
  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:5000/friendReq",
      headers: {
        authorization: `${localStorage.getItem("auth")}`,
      },
    })
      .then((result) => {
        setUserId(result.data.message);
      })
      .catch((error) => console.error(error.message));
  }, []);

  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:5000/user/${notification.senderId}`,
    })
      .then((result) => {
        setUsername(result.data.findUserDetails.username);
        setProfilePhoto(result.data.findUserDetails.profilePic);
      })
      .catch((error) => console.error(error.message));
  }, []);

  //friend request accept handler
  const acceptHandler = (e) => {
    if (userId !== "") {
      e.preventDefault();

      // add friend
      axios({
        method: "post",
        url: `http://localhost:5000/addFriend`,
        data: {
          friendId: notification.senderId,
          myId: userId,
        },
      })
        .then((result) => {})
        .catch((error) => console.error(error.message));

      const details = {
        senderId: notification.senderId,
        receiverId: userId,
      };
      axios({
        method: "post",
        url: `http://localhost:5000/conversation`,
        data: details,
      })
        .then(() => {})
        .catch((error) => console.error(error.message));

      //deleting notification
      axios({
        method: "get",
        url: `http://localhost:5000/deleteNotification/${userId}`,
      })
        .then((result) => {})
        .catch((error) => console.error(error.message));
      window.location.reload();
    }
  };

  //decline handler
  const declineHandler = () => {};

  return (
    <>
      <div className="notification-body-content">
        <div className="notification-img">
          {profilePhoto == "" ? (
            <img
              src="http://localhost:3000/images/user.png"
              className="notification-image"
            />
          ) : (
            <img
              src={`http://localhost:5000/${profilePhoto.replace(
                "public\\",
                ""
              )}`}
              className="notification-image"
            />
          )}
        </div>
        <div className="notification-content">
          <div className="notification-name">
            <span className="notification-name-text">
              {username} send you a request
            </span>
          </div>
          <div className="notification-request-btn">
            <button className="notification-btn" onClick={acceptHandler}>
              Accept
            </button>
            <button className="notification-btn" onClick={declineHandler}>
              Decline
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Notification;
