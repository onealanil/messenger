import { Button, InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./friendPage.css";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ChatIcon from "@mui/icons-material/Chat";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const FriendPage = ({ socket }) => {
  const navigate = useNavigate();

  //nav bar photo
  const [profilePhoto, setProfilePhoto] = useState("");
  const [username, setUsername] = useState("");

  //friends
  const [friendsName, setFriendsName] = useState([]);

  //add to friend requested
  const [requested, setRequested] = useState(false);

  const [toggle, setToggle] = useState(null);

  //my friend
  const [myFriend, setMyFriend] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("auth");
    if (token == null) {
      navigate("/");
    }
  }, []);

  //user id
  const [userId, setUserId] = useState("");

  // getting userId
  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:5000/notification",
      headers: {
        authorization: `${localStorage.getItem("auth")}`,
      },
    })
      .then((result) => {
        setUserId(result.data.message);
      })
      .catch((error) => console.error(error.message));
  }, []);

  //data
  useEffect(() => {
    if (userId !== "") {
      axios({
        method: "get",
        url: `http://localhost:5000/user/${userId}`,
      })
        .then((result) => {
          setUsername(result.data.findUserDetails.username);
          setProfilePhoto(result.data.findUserDetails.profilePic);
          let friendArr = [];
          for (let i = 0; i < result.data.findUserDetails.friends.length; i++) {
            // setMyFriend((r)=>[...r , result.data.findUserDetails.friends[i]])
            friendArr.push(result.data.findUserDetails.friends[i]);
          }
          setMyFriend(friendArr);
        })
        .catch((error) => console.error(error.message));
    }
  }, [userId]);

  //data except me
  useEffect(() => {
    if (userId !== "") {
      axios({
        method: "get",
        url: `http://localhost:5000/allUsers/${userId}`,
      })
        .then((result) => {
          console.log(result)
          let y = [];
          for(let i = 0 ; i< result.data.data.length; i++){
            if(!myFriend.includes(result.data.data[i]._id)){
              y.push(result.data.data[i])
            }
          }
          setFriendsName(y);
        })
        .catch((error) => console.error(error.message));
    }
  }, [userId, myFriend]);

  return (
    <>
      {/* nav bar start  */}
      <div className="nav-container">
        <div className="nav-content">
          <div className="nav-logo">
            <img src="/images/logo.png" className="logo" />
          </div>
          <div className="nav-other">
            <div className="nav-other-css">
              {/* search bar  */}
              <div className="nav-search-bar">
                <div className="search-bar-container">
                  <TextField
                    autoFocus
                    margin="dense"
                    placeholder="Search friends..."
                    id="name"
                    type="text"
                    fullWidth
                    size="small"
                    autoComplete="off"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonSearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mt: 1.5,
                      mb: 2.5,
                      width: "35rem",
                      borderColor: "#0062cc",
                    }}
                  />
                </div>
              </div>
              <div className="nav-explore-frn">
                <Button
                  variant="contained"
                  endIcon={<ChatIcon />}
                  sx={{
                    backgroundColor: "#2673ed",
                    "&:hover": {
                      backgroundColor: "#094cb5",
                      borderColor: "#0062cc",
                      boxShadow: "none",
                    },
                  }}
                  onClick={() => {
                    navigate("/home");
                  }}
                >
                  <span className="btn-text">Go to chat</span>
                </Button>
              </div>
              <div className="user-profiles">
                <Link to={`/profile/admin/${username}`}>
                  {profilePhoto == "" ? (
                    <img
                      src="http://localhost:3000/images/user.png"
                      className="profile-photos"
                    />
                  ) : (
                    <img
                      src={`http://localhost:5000/${profilePhoto.replace(
                        "public\\",
                        ""
                      )}`}
                      className="profile-photos"
                    />
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* nav bar end  */}

      {/* body part start  */}

      <div className="friends-container">
        <div className="friends-container-bg">
          {/* friends start  */}
          {friendsName.map((val, index) => (
            <>
              <div className="friends-width">
                <div className="friends-width-bg">
                  <div className="profile">
                    {val.profilePic == "" ? (
                      <img
                        src="http://localhost:3000/images/user.png"
                        className="friends-profile-photo"
                      />
                    ) : (
                      <img
                        src={`http://localhost:5000/${val.profilePic.replace(
                          "public\\",
                          ""
                        )}`}
                        className="friends-profile-photo"
                      />
                    )}
                  </div>
                  <div className="other-info">
                    <div className="friends-name">
                      <span
                        className="friends-name-text"
                        style={{ fontWeight: "bold", fontSize: "25px" }}
                      >
                        {val.username}
                      </span>
                    </div>
                  </div>
                  <div className="add-friend-container">
                    <>
                      <Button
                        variant="contained"
                        endIcon={<PersonAddIcon />}
                        sx={{
                          backgroundColor: "#2673ed",
                          "&:hover": {
                            backgroundColor: "#094cb5",
                            borderColor: "#0062cc",
                            boxShadow: "none",
                          },
                        }}
                        onClick={() => {
                          axios({
                            method: "POST",
                            url: "http://localhost:5000/notification/",
                            data: {
                              senderId: userId,
                              receiverId: val._id,
                              notificationMsg: userId + " sent you a request",
                            },
                          })
                            .then(() => {
                              setToggle(index);
                            })
                            .catch((error) => console.error(error.message));

                          //for socket io
                          const messageData = {
                            senderId: userId,
                            receiverId: val._id,
                            notificationMsg: "sent you a friend request",
                          };
                          socket?.emit("message", messageData);
                        }}
                      >
                        <span className="btn-text">
                          {index === toggle
                            ? "Requested"
                            : "Add to Conversation"}
                        </span>
                      </Button>
                    </>
                  </div>
                </div>
              </div>
            </>
          ))}
          {/* friends end  */}
        </div>
      </div>
      {/* body part end  */}
    </>
  );
};

export default FriendPage;
