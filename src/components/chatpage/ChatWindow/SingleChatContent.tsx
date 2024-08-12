import React from "react";
import { Box, Typography, List, ListItem, ListItemText, Container } from "@mui/material";
import { Message } from "./messagetypes";

interface SingleChatContentProps {
  userDetails: any;
  messageList: Message[];
}

const SingleChatContent: React.FC<SingleChatContentProps> = ({
  userDetails,
  messageList,
}) => {

  // Helper function to format time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Container
      maxWidth="sm"
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <List>
          {messageList.map((messageContent, index) => {
            // Determine if the message is from the current user
            const isSender = userDetails.UserID === messageContent.SenderID;

            return (
              <ListItem
                key={index}
                style={{
                  display: "flex",
                  justifyContent: isSender ? "flex-end" : "flex-start",
                  padding: "0px", // Remove default padding to align properly
                }}
              >
                <Box
                  sx={{
                    maxWidth: "60%",
                    padding: "0.75rem",
                    borderRadius: "10px",
                    backgroundColor: isSender ? "#e1ffc7" : "#f1f0f0",
                    boxShadow: 2,
                    textAlign: isSender ? "right" : "left",
                    margin: "5px", // Add margin for spacing between messages
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
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: '0.75rem', marginLeft: 5 }}
                        >
                          {formatTime(messageContent.SentAt)}
                        </Typography>
                      </>
                    }
                  />
                </Box>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Container>
  );
};

export default SingleChatContent;
