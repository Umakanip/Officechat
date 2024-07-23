import React from "react";
import { Container } from "@mui/material";
import Header from "./Header.tsx";
import Footer from "./Footer.tsx";
// import Chatbody from "./Messagebody.tsx";

const ChatArea = (data: any) => {
  console.log(data);
  return (
    <>
      <Container>
        <Header />
        {/* <Chatbody /> */}
        <Footer userDetails={data.data} />
      </Container>
    </>
  );
};

export default ChatArea;
