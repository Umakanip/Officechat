import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { Box, TextField, Button, Container } from "@mui/material";
import axios from "axios";
import { useUser } from "../../context/UserContext.tsx";
import io, { Socket } from "socket.io-client";
import { Message } from "./messagetypes";

interface FooterProps {
  userDetails: any;
  setMessageList: React.Dispatch<React.SetStateAction<Message[]>>;
}
//const SOCKET_URL = "http://localhost:3000"; // Update this URL to your server address
const socket: Socket = io("http://localhost:5000");

const Footer: React.FC<FooterProps> = ({ userDetails, setMessageList }) => {
  const [currentMessage, setcurrentMessage] = useState("");
  // const [messageList, setMessageList] = useState<Message[]>([]);
  const { user } = useUser();

  const sendMessage = async () => {
    console.log("currentMessage", currentMessage);
    console.log("user", user);
    console.log("userdetails", userDetails);
    // console.log("chatType", chatType);
    const currentTime = new Date();
    const messageData = {
      author: user?.userdata?.UserName,
      // room: userDetails.UserID, // Ensure the room is included
      receiverID: userDetails.UserID ? userDetails.UserID : undefined,
      groupID: userDetails.GroupID ? userDetails.GroupID : undefined,
      // ChatID: 4, // Assuming `data.room` is ChatID
      SenderID: user?.userdata?.UserID, // Assuming `data.senderID` is the sender's ID
      Content: currentMessage, // Message content
      SentAt: currentTime, // Timestamp
      IsDeleted: false, // Default value
      IsPinned: false, // Default value
      isGroupChat: userDetails.GroupID ? true : false, // Change this based on the chat type
    };
    console.log("Sending message:", messageData);
    socket.emit("send_message", messageData);
    setcurrentMessage("");
  };

  useEffect(() => {
    console.log("contextapi", userDetails);
    const fetchMessages = async () => {
      try {
        let response;
        if (userDetails.GroupID) {
          response = await axios.get(
            `http://localhost:3000/api/groupmessages?groupid=${userDetails.GroupID}`
          );
        } else {
          response = await axios.get(
            `http://localhost:3000/api/messages/${userDetails.UserID}`
          );
        }
        // const messages = await response;
        console.log("response", response.data);
        setMessageList(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
    // socket.emit("join_room", user?.userdata?.UserID);

    // socket.emit("join_room", userDetails.UserID);
    const handleMessageReceive = (data) => {
      console.log("Message received on client:", data);
      setMessageList((list) => [...list, data]);
    };

    socket.on("receive_message", handleMessageReceive);

    return () => {
      socket.off("receive_message", handleMessageReceive);
    };
  }, [userDetails.UserID, setMessageList]);

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setcurrentMessage(event.target.value);
          }}
          onKeyPress={(event: KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <Button
          onClick={sendMessage}
          variant="contained"
          color="primary"
          style={{ marginLeft: "10px" }}
        >
          &#9658;
        </Button>
      </Box>
    </Container>
  );
};

export default Footer;
