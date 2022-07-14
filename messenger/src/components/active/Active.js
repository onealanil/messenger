import React, { useEffect, useState } from "react";
import ActiveOne from "./ActiveOne";
import "./active.css";
import axios from "axios";

const Active = ({ socket }) => {
  //online user
  const [onlineUsers, setOnlineUsers] = useState([]);

  //userId
  const [userId, setUserId] = useState("");

  useEffect(() => {
    socket?.on("clientInfo", (data) => {
      setOnlineUsers(data);
    });
  }, [socket]);

  // getting userId
  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:5000/active",
      headers: {
        authorization: `${localStorage.getItem("auth")}`,
      },
    })
      .then((result) => {
        setUserId(result.data.message);
      })
      .catch((error) => console.error(error.message));
  }, []);

  return (
    <>
      <div className="container">
        <div className="container-bg">
          <div className="online-user-heading">
            <span className="online-user-heading-text">Active Users, through out the server</span>
          </div>
          <div className="online-profile">
            {onlineUsers?.map((val) => (
              <>
                {val.userId !== userId ? (
                  <>
                    <ActiveOne active={val} />
                  </>
                ) : (
                  " "
                )}
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Active;
