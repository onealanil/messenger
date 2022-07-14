import React, { useEffect, useState } from "react";
import "./active.css";
import axios from "axios";

const ActiveOne = ({ active }) => {
  //user info
  const [username, setUsername] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  useEffect(() => {
    axios({
      method: "get",
      url: `http://localhost:5000/user/${active.userId}`,
    })
      .then((result) => {
        setUsername(result.data.findUserDetails.username);
        setProfilePhoto(result.data.findUserDetails.profilePic);
      })
      .catch((error) => console.error(error.message));
  }, []);
  return (
    <>
      <div className="online-profile-card">
        <div className="green-background-bg">
          <div className="green-background"></div>
        </div>
        {profilePhoto == "" ? (
          <img
            src="http://localhost:3000/images/user.png"
            className="online-profile-img"
          />
        ) : (
          <img
            src={`http://localhost:5000/${profilePhoto.replace(
              "public\\",
              ""
            )}`}
            className="online-profile-img"
          />
        )}
        <span className="online-profile-name-text">{username}</span>
      </div>
    </>
  );
};

export default ActiveOne;
