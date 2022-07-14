import React,{useEffect} from "react";
import Profile from "./pages/profilePage/Profile";
import { useNavigate } from "react-router-dom";


const AuthProfile = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("auth");
    const userId = localStorage.getItem("user");
    if (token == null || userId== null) {
      navigate("/");
    }
  }, []);
  return (
      <>
      <Profile/>
      </>
  );
};

export default AuthProfile;
