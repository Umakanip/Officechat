import React, { useEffect } from "react";
import MainHeader from "./Header/MainHeader.tsx";
import axios from "axios";
import Sidemenu from "./sidemenu/sidemenu.tsx";
import { Container, Box } from "@mui/material";
// import { useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext.tsx";

const Chatpage: React.FC = () => {
  // const location = useLocation();
  // const { username } = location.state as { username: string }; // Type assertion to access the state

  const { user } = useUser();
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      /// alert("HI");
      // Send a request to the server to remove the user from the loggedInUsers array
      axios.post("http://localhost:3000/api/auth/logout", {
        userId: user?.userdata?.UserID,
      });
      event.preventDefault();
      event.returnValue = "";
    };

    // Attach the event listener
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user?.userdata?.UserID]);

  return (
    <>
      <Box sx={{ height: "100vh" }}>
        <MainHeader />
        <Sidemenu />
      </Box>
    </>
  );
};
export default Chatpage;
