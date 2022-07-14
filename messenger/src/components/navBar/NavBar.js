import { Button, InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./navBar.css";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import Notification from "../notification/Notification";

const NavBar = ({ socket }) => {
  const navigate = useNavigate();

  //user id
  const [userId, setUserId] = useState("");

  // getting userId
  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:5000/home",
      headers: {
        authorization: `${localStorage.getItem("auth")}`,
      },
    })
      .then((result) => {
        setUserId(result.data.message);
      })
      .catch((error) => console.error(error.message));
  }, []);

  //user profile photo and user name
  const [profilePhoto, setProfilePhoto] = useState("");
  const [username, setUsername] = useState("");

  //notification on and off
  const [notification, setNotification] = useState(false);
  const [notificationEvent, setNotificationEvent] = useState([]);



  const [arrivalMessage, setArrivalMessage] = useState(null);

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
          // socket io send client id and get online users
          socket.emit("clientUsername", {
            username: result.data.findUserDetails.username,
            userId: userId,
          });
        })
        .catch((error) => console.error(error.message));
    }
  }, [userId, socket]);

  //log out
  const logOutHandler = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  //notification handler
  const notificationHandler = (e) => {
    e.preventDefault();
    setNotification(true);
  };

  //get notification
  useEffect(() => {
    if (userId !== "") {
      axios({
        method: "get",
        url: `http://localhost:5000/getNotification/${userId}`,
      })
        .then((result) => {
          var newArray = result.data.n.filter(function (el) {
            return el.receiverId === userId;
          });
          setNotificationEvent(newArray);
        })
        .catch((error) => console.error(error.message));
    }
  }, [userId]);

  //go to profile page
  const profilePageHandler = () => {
    navigate(`/profile/admin/${username}`);
  };

  //socket io get message from back to the specific client
  useEffect(() => {
    socket?.on("messageFromBack", (data) => {
      setArrivalMessage({
        senderId: data.senderId,
        notificationMsg: data.notificationMsg,
      });
    });
  }, [socket]);

  // socket io get message from back to the specific client
  useEffect(() => {
    arrivalMessage &&
      setNotificationEvent((notificationEvent) => [
        ...notificationEvent,
        arrivalMessage,
      ]);
  }, [arrivalMessage]);

  //notification mark all as read
  const markAsReadHandler = () => {
    alert(
      "Once you click 'mark all as read' your notification will be deleted from databases"
    );
    axios({
      method: "get",
      url: `http://localhost:5000/deleteNotification/${userId}`,
    })
      .then((result) => {
      })
      .catch((error) => console.error(error.message));
    setNotificationEvent([]);
  };

  return (
    <>
      <div className="nav-container">
        <div className="nav-content">
          <div className="nav-logo">
            <img src="/images/logo.png" className="logo" />
          </div>
          <div className="nav-others">
            <div className="nav-other-css">
              {/* button  */}
              <div className="nav-explore-frnd">
                <Button
                  variant="contained"
                  endIcon={<PeopleOutlineIcon />}
                  sx={{
                    backgroundColor: "#2673ed",
                    "&:hover": {
                      backgroundColor: "#094cb5",
                      borderColor: "#0062cc",
                      boxShadow: "none",
                    },
                  }}
                  onClick={() => {
                    navigate("/friends");
                  }}
                >
                  <span className="btn-text">Explore New Friends</span>
                </Button>
              </div>

              {/* search bar  */}
              <div className="nav-search-bars">
                <div className="search-bar-containers">
                  <TextField
                    autoFocus
                    margin="dense"
                    placeholder="Search your conversation"
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
                      width: "25rem",
                      borderColor: "#0062cc",
                    }}
                  />
                </div>
              </div>
              <div className="nav-explore-frnd">
                <Button
                  variant="contained"
                  endIcon={<ExitToAppIcon />}
                  sx={{
                    backgroundColor: "#2673ed",
                    "&:hover": {
                      backgroundColor: "#094cb5",
                      borderColor: "#0062cc",
                      boxShadow: "none",
                    },
                  }}
                  onClick={logOutHandler}
                >
                  <span className="btn-text">Log Out</span>
                </Button>
              </div>

              {/* notification start  */}
              <div className="notification">
                <div
                  className={
                    notificationEvent.length < 1
                      ? "notification-number-or"
                      : "notification-number"
                  }
                >
                  <span className="notification-number-text">
                    {notificationEvent.length > 0
                      ? notificationEvent.length
                      : ""}
                  </span>
                </div>

                <NotificationsActiveIcon
                  style={{ fontSize: 40, cursor: "pointer" }}
                  onClick={notificationHandler}
                />
              </div>

              {/* dialog content start  */}
              <Dialog
                open={notification}
                // onClose={handleClose}
              >
                <div className="notification-container">
                  <div className="notification-nav">
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#2673ed",
                        "&:hover": {
                          backgroundColor: "#094cb5",
                          borderColor: "#0062cc",
                          boxShadow: "none",
                        },
                      }}
                      onClick={markAsReadHandler}
                    >
                      <span className="btn-text">Mark all as read</span>
                    </Button>
                    <CloseIcon
                      sx={{ color: "red", cursor: "pointer" }}
                      onClick={() => {
                        setNotification(false);
                      }}
                    />
                  </div>
                  <div className="notification-background">
                    <div className="notification-bg">
                      {/* noti start  */}
                      {notificationEvent.map((val) => (
                        <>
                          <Notification notification={val} socket={socket} />
                        </>
                      ))}
                      {/* noti end  */}
                    </div>
                  </div>
                </div>
              </Dialog>
              {/* dialog content end  */}

              {/* notification end  */}
              <div className="user-profile">
                {profilePhoto == "" ? (
                  <img
                    src="http://localhost:3000/images/user.png"
                    className="profile-photo"
                    onClick={profilePageHandler}
                  />
                ) : (
                  <img
                    src={`http://localhost:5000/${profilePhoto.replace(
                      "public\\",
                      ""
                    )}`}
                    className="profile-photo"
                    onClick={profilePageHandler}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
