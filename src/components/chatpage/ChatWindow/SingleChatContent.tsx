// import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
// import {
//   Box,
//   Typography,
//   List,
//   ListItem,
//   ListItemText,
//   Container,
// } from "@mui/material";
// import { Message } from "./messagetypes";

// interface SingleChatContentProps {
//   userDetails: any;
//   messageList: Message[];
// }

// const SingleChatContent: React.FC<SingleChatContentProps> = ({
//   userDetails,
//   messageList,
// }) => {
//   console.log("Singlechatcom", messageList);
//   return (
//     <Container
//       maxWidth="sm"
//       style={{ height: "100vh", display: "flex", flexDirection: "column" }}
//     >
//       <Box sx={{ flex: 1, overflow: "auto" }}>
//         {/* <ScrollToBottom className="message-container"> */}

//         <List>
//           {messageList.map((messageContent, index) => {
//             console.log("Current message content:", messageContent);
//             return (
//               <ListItem
//                 key={index}
//                 alignItems="flex-start"
//                 style={{
//                   backgroundColor:
//                     userDetails.Username === messageContent.author
//                       ? "#e1ffc7"
//                       : "#f1f0f0",
//                   margin: "10px 0",
//                 }}
//               >
//                 <ListItemText
//                   primary={messageContent.Content}
//                   secondary={
//                     <>
//                       <Typography
//                         component="span"
//                         variant="body2"
//                         color="text.primary"
//                       >
//                         {userDetails.Username === messageContent.author
//                           ? "You"
//                           : "OtherSS"}
//                       </Typography>
//                       {" — " + messageContent.SentAt}
//                     </>
//                   }
//                 />
//               </ListItem>
//             );
//           })}
//         </List>
//         {/* </ScrollToBottom> */}
//       </Box>
//     </Container>
//   );
// };
// export default SingleChatContent;
import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Container,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { Message } from "./messagetypes";
import Modal from "@mui/material/Modal";
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
  messageList, // Default to an empty array if messageList is undefined
}) => {
  console.log("Singlechatcom", messageList);
  const [open, setOpen] = React.useState(false);
  const [imagename, setImagename] = React.useState("");
  const handleOpen = (filename) => {
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
  const isImageUrl = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  return (
    <Container
      maxWidth="sm"
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <List>
          {messageList.map((messageContent, index) => {
            const isSender = userDetails.UserID === messageContent.SenderID;
            const isImage = isImageUrl(messageContent.Content);

            const renderFilePreview = () => {
              if (!messageContent.file) return null;

              const { filetype, url } = messageContent.file;
              console.log("messageontten", messageContent.file);
              const { filename } = messageContent.file;
              console.log(filename);
              let preview;

              if (filetype?.startsWith("image/")) {
                console.log("image");
                preview = (
                  <Link onClick={(e) => handleOpen(filename)} to={""}>
                    {filename}
                  </Link>
                );
                // preview = (
                //   <img
                //     src={url}
                //     alt="file preview"
                //     style={{ maxWidth: "200px", maxHeight: "200px" }}
                //   />
                // );
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
                  padding: "0px", // Remove default padding to align properly
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
                    margin: "5px", // Add margin for spacing between messages
                  }}
                >
                  {" "}
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
