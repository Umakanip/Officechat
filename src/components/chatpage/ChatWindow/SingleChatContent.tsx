import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Container,
} from "@mui/material";
import { Message } from "./messagetypes";

interface SingleChatContentProps {
  userDetails: any;
  messageList: Message[];
}

const SingleChatContent: React.FC<SingleChatContentProps> = ({
  userDetails,
  messageList,
}) => {
  console.log("Singlechatcom", messageList);
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
    </Container>
  );
};
export default SingleChatContent;
