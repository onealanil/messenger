import React from "react";
import NavBar from "../../components/navBar/NavBar";
import Active from "../../components/active/Active";
import Message from "../../components/message/Message";

const HomePage = ({ socket }) => {
  return (
    <>
      <NavBar socket={socket} />
      <Active socket={socket} />
      <Message socket={socket} />
    </>
  );
};

export default HomePage;
