import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Input,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "./profile.css";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
// import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { updateOneUser } from "../../feature/userReducer";
// import UpgradeIcon from '@mui/icons-material/Upgrade';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formData = new FormData();

  //auth
  useEffect(() => {
    const token = localStorage.getItem("auth");
    if (token == null) {
      navigate("/");
    }
  }, []);

  //userDetails
  const [userDetails, setUserDetails] = useState([]);

  //profile pic
  const [profilePhoto, setProfilePhoto] = useState("");

  //update
  const [updated, setUpdated] = useState(false);
  const [updateBio, setUpdateBio] = useState("");
  const [updateUsername, setUpdateUsername] = useState("");
  const [uploadImg, setUploadImg] = useState(null);

  //selector
  const updateUser = useSelector((state) => state.user);

  //user id
  const [userId, setUserId] = useState("");

  // getting userId
  useEffect(() => {
    axios({
      method: "get",
      url: "http://localhost:5000/profile",
      headers: {
        authorization: `${localStorage.getItem("auth")}`,
      },
    })
      .then((result) => {
        setUserId(result.data.message);
      })
      .catch((error) => console.error(error.message));
  }, []);

  //getting user data
  useEffect(() => {
    if (userId !== "") {
      axios({
        method: "get",
        url: `http://localhost:5000/user/${userId}`,
      })
        .then((result) => {
          setUserDetails(result.data.findUserDetails);
          setProfilePhoto(result.data.findUserDetails.profilePic);
          setUpdateBio(result.data.findUserDetails.bio);
          setUpdateUsername(result.data.findUserDetails.username);
        })
        .catch((error) => console.error(error.message));
    }
  }, [userId]);

  //update profile picture
  const updateProfilePic = () => {
    formData.append("postImg", uploadImg);
    formData.append("id", userId);
    const config = {
      headers: { "content-type": "application/json" },
    };
    axios({
      method: "post",
      url: "http://localhost:5000/updateProfilePicture",
      data: formData,
      headers: config,
    })
      .then((result) => {
        setProfilePhoto(result.data.result.profilePic);
        window.location.reload();
      })
      .catch((error) => console.error(error.message));
  };

  return (
    <>
      <div className="profile-container">
        <div className="profile-container-bg">
          <div className="profile-row-1">
            {profilePhoto == "" ? (
              <img
                src="http://localhost:3000/images/user.png"
                className="profile-row-1-pic"
              />
            ) : (
              <img
                src={`http://localhost:5000/${profilePhoto.replace(
                  "public\\",
                  ""
                )}`}
                className="profile-row-1-pic"
              />
            )}
            <div className="profile-edit">
              <input
                type="file"
                name="postImg"
                id="postImg-input"
                onChange={(e) => {
                  setUploadImg(e.target.files[0]);
                }}
              />
              <button className="update-button" onClick={updateProfilePic}>
                update
              </button>
            </div>
          </div>
          <div className="profile-row-2">
            <div className="profile-name">
              <span className="profile-name-text">{userDetails.username}</span>
            </div>
            <div className="profile-gender">
              <span className="profile-gender-text">{userDetails.gender}</span>
            </div>
            <div className="profile-bio">
              <span className="profile-bio-text">{userDetails.bio}</span>
            </div>
            <div className="edit-bio">
              <Button
                variant="contained"
                endIcon={<EditIcon />}
                sx={{
                  backgroundColor: "#2673ed",
                  "&:hover": {
                    backgroundColor: "#094cb5",
                    borderColor: "#0062cc",
                    boxShadow: "none",
                  },
                }}
                onClick={() => {
                  setUpdated(true);
                }}
              >
                <span className="btn-text">Edit Profile</span>
              </Button>
            </div>
          </div>
        </div>
        <Dialog open={updated} fullWidth>
          <DialogTitle>Update Todo</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Enter username to update:"
              fullWidth
              variant="standard"
              autoComplete="off"
              onChange={(e) => {
                setUpdateUsername(e.target.value);
              }}
              value={updateUsername}
            />
            <TextField
              margin="dense"
              id="name"
              label="Enter bio to update:"
              fullWidth
              variant="standard"
              autoComplete="off"
              onChange={(e) => {
                setUpdateBio(e.target.value);
              }}
              value={updateBio}
            />
            {updateUser.updateUserStatus === "pending" ? (
              <CircularProgress size={30} />
            ) : null}
            {updateUser.updateUserStatus === "success" ? (
              <Alert severity="success">Profile updated successfully!</Alert>
            ) : null}
            {updateUser.updateUserStatus === "failed" ? (
              <Alert severity="error">{updateUser.updateUserError}</Alert>
            ) : null}
          </DialogContent>
          <DialogActions>
            <Button
              startIcon={<EditIcon />}
              sx={{ color: "green" }}
              onClick={(e) => {
                if (updateBio === "" || updateUsername === "") {
                  <Alert severity="error">Username or Bio can't be null</Alert>;
                } else {
                  dispatch(
                    updateOneUser({
                      username: updateUsername,
                      bio: updateBio,
                      id: userId,
                    })
                  );
                }
              }}
            >
              Update
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                setUpdated(false);
                window.location.reload();
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default Profile;
