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

interface SingleChatContentProps {
  userDetails: any;
  messageList: Message[];
}

const SingleChatContent: React.FC<SingleChatContentProps> = ({
  userDetails,
  messageList, // Default to an empty array if messageList is undefined
}) => {
  console.log("Singlechatcom", messageList);

  return (
    <Container
      maxWidth="sm"
      style={{ height: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <List>
          {messageList.map((messageContent, index) => {
            const isSender = userDetails.Username === messageContent.author;

            return (
              <ListItem
                key={index}
                alignItems="flex-start"
                style={{
                  backgroundColor: isSender ? "#e1ffc7" : "#f1f0f0",
                  margin: "10px 0",
                  borderRadius: "8px",
                  padding: "10px",
                }}
              >
                <ListItemText
                  primary={
                    <>
                      {messageContent.Content && (
                        <Typography variant="body1" gutterBottom>
                          {messageContent.Content}
                        </Typography>
                      )}
                      {messageContent.file && messageContent.file?.filetype.startsWith("image/") && (
                      
                        <Card>
                          <CardMedia
                            component="img"
                            image={`data:${messageContent.file.filetype};base64,${messageContent.file.fileBlob}`}
                            alt={messageContent.file.filename}
                          />
                        </Card>
                      )}
                      {messageContent.file?.filetype === "application/pdf" && (
                        <Card>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              PDF: {messageContent.file.filename}
                            </Typography>
                            <a
                              href={`data:${messageContent.file.filetype};base64,${messageContent.file.fileBlob}`}
                              download={messageContent.file.filename}
                            >
                              Download PDF
                            </a>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  }
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {isSender ? "You" : messageContent.author}
                      </Typography>
                      {" — " + new Date(messageContent.SentAt).toLocaleString()}
                    </>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Container>
  );
};

export default SingleChatContent;
