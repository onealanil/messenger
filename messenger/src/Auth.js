import React, { useEffect, useState } from "react";
import HomePage from "./pages/homePage/HomePage";
import { useNavigate } from "react-router-dom";

function Auth({socket}) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth");
    const userId = localStorage.getItem("user");
    if (token == null || userId == null) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <HomePage socket={socket}/>
    </>
  );
}

export default Auth;
