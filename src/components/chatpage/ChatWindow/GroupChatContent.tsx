// GroupChatContent.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Container,
} from "@mui/material";
import { Message } from "./messagetypes";

interface GroupChatContentProps {
  userDetails: any;
  messageList: Message[];
}

const GroupChatContent: React.FC<GroupChatContentProps> = ({
  userDetails,
  messageList,
}) => {
  console.log("messageList", messageList);
  return (
    <Container
      maxWidth="sm"
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Box sx={{ flex: 1, overflow: "auto" }}>
        {messageList && messageList.length > 0 ? (
          <List>
            {messageList.map((messageContent, index) => (
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
                          : "Other"}
                      </Typography>
                      {" — " + messageContent.SentAt}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box>
            <h1>There is no conversation in this groups</h1>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default GroupChatContent;
