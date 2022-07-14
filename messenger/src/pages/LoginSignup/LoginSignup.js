import React, { useEffect, useState } from "react";
import "./LogSign.css";
import Typewriter from "typewriter-effect";
import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
} from "@mui/material";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import LoginIcon from "@mui/icons-material/Login";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";
import WcIcon from "@mui/icons-material/Wc";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../feature/userReducer";
import { signupUser } from "../../feature/userReducer";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const LoginSignup = ({ setUserDetails }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [signupDialog, setSignupDialog] = useState(false);
  const [loginDialog, setLoginDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  //for login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  //for signup
  const [username, setUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  //gender
  const [genderOption, setGenderOption] = useState("Male");
  const gender = [
    {
      value: "Male",
      label: "Male",
    },
    {
      value: "Female",
      label: "Female",
    },
  ];

  //selector
  const loginSignupDetails = useSelector((state) => state.user);

  //functions
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  //handle login
  const handleLogin = (e) => {
    e.preventDefault();
    const loginDetails = {
      email: loginEmail,
      password: loginPassword,
    };
    dispatch(loginUser(loginDetails));
    setLoginEmail("");
    setLoginPassword("");
  };

  //after login
  useEffect(() => {
    if (loginSignupDetails.loginStatus === "success") {
      localStorage.setItem(
        "auth",
        loginSignupDetails.loginUserDetails[0].token
      );
      localStorage.setItem(
        "user",
        loginSignupDetails.loginUserDetails[0].data._id
      );
      navigate('/home');
    }
  }, [loginSignupDetails]);

  //handle signup
  const handleSignup = (e) => {
    e.preventDefault();
    const signupDetails = {
      username,
      email: signupEmail,
      password: signupPassword,
      gender: genderOption,
    };
    dispatch(signupUser(signupDetails));
    setSignupEmail("");
    setSignupPassword("");
    setUsername("");
  };

  //render
  return (
    <>
      <div className="container">
        <div className="logo-text">
          <div className="logo">
            <img src="/images/logo.png" alt="logo" className="logo-img" />
          </div>
          <div className="login-signup-text">
            <Typewriter
              options={{
                autoStart: true,
                loop: true,
                typeSpeed: 3,
              }}
              onInit={(typewriter) => {
                typewriter
                  .typeString("Welcome !..")
                  .pauseFor(1000)
                  .deleteAll()
                  .typeString("If you are a new user, you may register.")
                  .pauseFor(1000)
                  .deleteAll()
                  .typeString("Login is available to registered users.")
                  .pauseFor(1000)
                  .deleteAll()
                  .start();
              }}
            />
          </div>
        </div>
        <div className="buttons">
          <div className="btn-1">
            <Button
              variant="contained"
              startIcon={<LoginIcon />}
              sx={{ backgroundColor: "#396986" }}
              onClick={() => {
                setLoginDialog(true);
              }}
            >
              <span className="btn-text">SIGN IN</span>
            </Button>
          </div>
          <div className="btn-2">
            <Button
              variant="contained"
              endIcon={<AssignmentIndIcon />}
              sx={{
                backgroundColor: "#6A906E",
                "&:hover": {
                  backgroundColor: "#50b55c",
                  borderColor: "#0062cc",
                  boxShadow: "none",
                },
              }}
              onClick={() => {
                setSignupDialog(true);
              }}
            >
              <span className="btn-text">SIGN UP</span>
            </Button>
          </div>
        </div>
        {/* for log in */}
        <Dialog open={loginDialog}>
          <DialogTitle>
            <div className="dialog-title-logo">
              <div className="dialog-logo">
                <img src="/images/logo.png" className="dialog-logo" />
              </div>
              <div className="dialog-title">
                <span className="dialog-title-text-login">
                  Log-in to your account
                </span>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <hr></hr>
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
              size="small"
              autoComplete="off"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircleIcon sx={{ fill: "#2185d0" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mt: 1.5, mb: 2.5 }}
              onChange={(e) => {
                setLoginEmail(e.target.value);
              }}
              value={loginEmail}
            />
            <TextField
              margin="dense"
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              autoComplete="off"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ fill: "#2185d0" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={(e) => {
                setLoginPassword(e.target.value);
              }}
              value={loginPassword}
            />
            <Button
              variant="contained"
              disableElevation
              fullWidth
              sx={{ mt: 1.5 }}
              onClick={handleLogin}
            >
              <span className="login-button">Login</span>
            </Button>
          </DialogContent>
          <Container>
            {loginSignupDetails.loginStatus === "pending" ? (
              <CircularProgress size={30} />
            ) : null}
            {loginSignupDetails.loginStatus === "success" ? (
              <Alert severity="success">You are successfully logged in</Alert>
            ) : null}
            {loginSignupDetails.loginStatus === "failed" ? (
              <Alert severity="error">
                {loginSignupDetails.loginError.message
                  ? loginSignupDetails.loginError.message
                  : "server problem 404 error!!"}
              </Alert>
            ) : null}
          </Container>
          <DialogActions>
            <Button
              onClick={(e) => {
                e.preventDefault();
                setLoginDialog(false);
                window.location.reload();
              }}
            >
              <span className="cancel-button">Cancel</span>
            </Button>
          </DialogActions>
        </Dialog>
        {/* *********** */}

        {/* for signup */}
        <Dialog open={signupDialog}>
          <DialogTitle>
            <div className="dialog-title-logo">
              <div className="dialog-logo">
                <img src="/images/logo.png" className="dialog-logo" />
              </div>
              <div className="dialog-title">
                <span className="dialog-title-text-signup">
                  create your account
                </span>
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <hr></hr>
            </DialogContentText>
            <TextField
              required
              autoFocus
              margin="dense"
              id="username"
              label="Username"
              type="text"
              fullWidth
              size="small"
              autoComplete="off"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircleIcon sx={{ fill: "#6a906e" }} />
                  </InputAdornment>
                ),
              }}
              color="success"
              sx={{ mt: 1.5, mb: 2.5 }}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              value={username}
            />
            <TextField
              required
              margin="dense"
              id="email"
              label="Email Address"
              type="email"
              fullWidth
              size="small"
              autoComplete="off"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ fill: "#6a906e" }} />
                  </InputAdornment>
                ),
              }}
              color="success"
              sx={{ mt: 1.5, mb: 2.5 }}
              onChange={(e) => {
                setSignupEmail(e.target.value);
              }}
              value={signupEmail}
            />
            <TextField
              required
              margin="dense"
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              autoComplete="off"
              size="small"
              color="success"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ fill: "#6a906e" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={(e) => {
                setSignupPassword(e.target.value);
              }}
              value={signupPassword}
            />
            <TextField
              margin="dense"
              id="gender"
              label="gender"
              select
              value={genderOption}
              onChange={(e) => {
                setGenderOption(e.target.value);
              }}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <WcIcon sx={{ fill: "#6a906e" }} />
                  </InputAdornment>
                ),
              }}
              color="success"
              sx={{ mt: 1.5, mb: 2.5 }}
            >
              {gender.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="contained"
              disableElevation
              fullWidth
              sx={{
                mt: 1.5,
                backgroundColor: "#6a906e",
                "&:hover": {
                  backgroundColor: "#6fa875",
                  borderColor: "#6fa875",
                  boxShadow: "none",
                },
              }}
              onClick={handleSignup}
            >
              <span className="login-signup-button">Signup</span>
            </Button>
          </DialogContent>
          <Container>
            {loginSignupDetails.signupStatus === "pending" ? (
              <CircularProgress size={30} />
            ) : null}
            {loginSignupDetails.signupStatus === "success" ? (
              <Alert severity="success">You are successfully signed up</Alert>
            ) : null}
            {loginSignupDetails.signupStatus === "failed" ? (
              <Alert severity="error">
                {loginSignupDetails.signupError.message
                  ? loginSignupDetails.signupError.message
                  : "server problem 404 error!!"}
              </Alert>
            ) : null}
          </Container>
          <DialogActions>
            <Button
              onClick={(e) => {
                e.preventDefault();
                setSignupDialog(false);
                window.location.reload();
              }}
            >
              <span className="cancel-button">Cancel</span>
            </Button>
          </DialogActions>
        </Dialog>

        {/* ************* */}
      </div>
    </>
  );
};

export default LoginSignup;
