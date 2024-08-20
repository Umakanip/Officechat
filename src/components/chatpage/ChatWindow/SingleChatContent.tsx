import React, { useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Container,
  Modal,
} from "@mui/material";
import { Message } from "./messagetypes";
import { Link } from "react-router-dom";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface SingleChatContentProps {
  userDetails: any;
  messageList: Message[];
}

const SingleChatContent: React.FC<SingleChatContentProps> = ({
  userDetails,
  messageList = [], // Default to an empty array if messageList is undefined
}) => {
  const [open, setOpen] = React.useState(false);
  const [imagename, setImagename] = React.useState("");
  // const [loading, setLoading] = React.useState<boolean>(true);

  const handleOpen = (filename: string) => {
    setImagename(filename);
    setOpen(true);
  };

  const handleClose = () => {
    setImagename("");
    setOpen(false);
  };

  // Helper function to format time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Function to determine if a string is an image URL
  const isImageUrl = (url: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);

  return (
    <Container
      maxWidth="sm"
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Box sx={{ flex: 1, overflow: "auto" }}>
        {/* {messageList.length > 0 ? ( */}
        {/* {loading && messageList.length === 0 ? (
          <Typography
            variant="body1"
            sx={{ p: 2, textAlign: "center", mb: "150px" }}
          >
            Loading...
          </Typography>
        ) : ( */}
        <List>
          {messageList.map((messageContent, index) => {
            const isSender = userDetails.UserID === messageContent.SenderID;
            const isImage = isImageUrl(messageContent.Content);

            const renderFilePreview = () => {
              if (!messageContent.file) return null;

              const { filetype, url, filename } = messageContent.file;
              let preview;

              if (filetype?.startsWith("image/")) {
                preview = (
                  <Link onClick={() => handleOpen(filename)} to="#">
                    {filename}
                  </Link>
                );
              } else if (filetype?.startsWith("video/")) {
                preview = (
                  <video controls src={url} style={{ maxWidth: "200px" }} />
                );
              } else if (filetype?.startsWith("audio/")) {
                preview = <audio controls src={url} />;
              } else {
                preview = (
                  <ListItemText
                    primary={messageContent.Content}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        ></Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: "0.75rem", marginLeft: 5 }}
                        >
                          {formatTime(messageContent.SentAt)}
                        </Typography>
                      </>
                    }
                  />
                );
              }

              return <div style={{ marginTop: "10px" }}>{preview}</div>;
            };

            return (
              <ListItem
                key={index}
                style={{
                  display: "flex",
                  justifyContent: isSender ? "flex-end" : "flex-start",
                  padding: "0px",
                }}
              >
                <Box
                  sx={{
                    maxWidth: "60%",
                    padding: "0.75rem",
                    borderRadius: "10px",
                    backgroundColor: isSender ? "#f1f0f0" : "#e1ffc7",
                    boxShadow: 2,
                    textAlign: isSender ? "left" : "left",
                    margin: "5px",
                  }}
                >
                  {messageContent.file ? (
                    <ListItemText>{renderFilePreview()}</ListItemText>
                  ) : (
                    <ListItemText
                      primary={
                        isImage ? (
                          <Link
                            onClick={() => handleOpen(messageContent.Content)}
                            to="#"
                          >
                            <Typography variant="body2" color="text.primary">
                              {messageContent.Content}
                            </Typography>
                          </Link>
                        ) : (
                          messageContent.Content
                        )
                      }
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          ></Typography>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: "0.75rem", marginLeft: 5 }}
                          >
                            {formatTime(messageContent.SentAt)}
                          </Typography>
                        </>
                      }
                    />
                  )}
                </Box>
              </ListItem>
            );
          })}
        </List>
        {/* )} */}
        {/* // ) : (
        //   <Box>
        //     <h1>There is no conversation in this Chat</h1>
        //   </Box>
        // )} */}
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <img
            src={"http://localhost:3000/" + imagename}
            style={{ maxWidth: "50%", maxHeight: "50%" }}
          />
        </Box>
      </Modal>
    </Container>
  );
};

export default SingleChatContent;
