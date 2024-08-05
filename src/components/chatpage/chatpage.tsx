import * as React from "react";
import MainHeader from "./Header/MainHeader.tsx";

import Sidemenu from "./sidemenu/sidemenu.tsx";
import { Container, Box } from "@mui/material";
// import { useLocation } from "react-router-dom";
const Chatpage: React.FC = () => {
  // const location = useLocation();
  // const { username } = location.state as { username: string }; // Type assertion to access the state

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
