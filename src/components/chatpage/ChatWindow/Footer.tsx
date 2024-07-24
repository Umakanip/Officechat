import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Container,
} from "@mui/material";
import { useUser } from "../../context/UserContext.tsx";
import io, { Socket } from "socket.io-client";

//const SOCKET_URL = "http://localhost:3000"; // Update this URL to your server address
const socket: Socket = io("http://localhost:5000");

// Define the types
interface Message {
  author: String;
  room: String;
  receiverID: Number;
  ChatID: Number; // Assuming `data.room` is ChatID
  SenderID: Number; // Assuming `data.senderID` is the sender's ID
  Content: String; // Message content
  SentAt: String; // Timestamp
  IsDeleted: Boolean; // Default value
  IsPinned: Boolean; // Default value
}

const Footer = ({ userDetails }) => {
  const [currentMessage, setcurrentMessage] = useState("");
  const [messageList, setMessageList] = useState<Message[]>([]);
  const { user } = useUser();

  const sendMessage = async () => {
    console.log("currentMessage", currentMessage);
    const currentTime = new Date();
    const messageData = {
      author: user?.userdata?.UserName,
      room: userDetails.UserID, // Ensure the room is included
      receiverID: userDetails.UserID,
      ChatID: 4, // Assuming `data.room` is ChatID
      SenderID: user?.userdata?.UserID, // Assuming `data.senderID` is the sender's ID
      Content: currentMessage, // Message content
      SentAt: currentTime, // Timestamp
      IsDeleted: false, // Default value
      IsPinned: false, // Default value
    };
    console.log("Sending message:", messageData);
    socket.emit("send_message", messageData);
    setcurrentMessage("");
  };

  useEffect(() => {
    console.log("contextapi", userDetails.UserID);
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/messages?SenderID=${userDetails.UserID}`
        );
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
  }, [userDetails.UserID]);

  return (
    <Container
      maxWidth="sm"
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Box sx={{ flex: 1, overflow: "auto" }}>
        {/* <ScrollToBottom className="message-container"> */}

        <List>
          {messageList.map((messageContent, index) => {
            console.log("Current message content:", messageContent);
            return (
              <ListItem
                key={index}
                alignItems="flex-start"
                style={{
                  backgroundColor:
                    userDetails.Username === messageContent.author
                      ? "#e1ffc7"
                      : "#f1f0f0",
                  margin: "10px 0",
                }}
              >
                <ListItemText
                  primary={messageContent.Content}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {userDetails.Username === messageContent.author
                          ? "You"
                          : "OtherSS"}
                      </Typography>
                      {" — " + messageContent.SentAt}
                    </>
                  }
                />
              </ListItem>
            );
          })}
        </List>
        {/* </ScrollToBottom> */}
      </Box>
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
