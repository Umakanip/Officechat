import React from "react";
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
  return (
    <Container
      maxWidth="sm"
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Box sx={{ flex: 1, overflow: "auto" }}>
        {messageList && messageList.length > 0 ? (
          <List>
            {messageList.map((messageContent, index) => {
              const isSender = userDetails.Username === messageContent.author;
              return (
                <ListItem
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: isSender ? "flex-end" : "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "60%",
                      padding: "0.75rem",
                      borderRadius: "10px",
                      backgroundColor: isSender ? "#e1ffc7" : "#f1f0f0",
                      boxShadow: 2,
                      alignSelf: isSender ? "flex-end" : "flex-start",
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
                            {isSender ? "You" : messageContent.author}
                          </Typography>
                          {" — " + messageContent.SentAt}
                        </>
                      }
                    />
                  </Box>
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Box>
            <h1>There is no conversation in this group</h1>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default GroupChatContent;
