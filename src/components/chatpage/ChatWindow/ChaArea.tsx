import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Footer from "./Footer.tsx";
import Header from "./Header.tsx";
import ChatComponent from "./RenderChatComponent.tsx";
import { Message, User } from "./messagetypes.ts";
import axios from "axios";
import { useUser } from "../../context/UserContext.tsx";
import _ from "lodash"; // Import lodash for debouncing

interface ChatAreaProps {
  userDetails: User; // Adjust type if needed
}

const ChatArea: React.FC<ChatAreaProps> = ({ userDetails }) => {
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Set initial loading state to true
  const [noConversation, setNoConversation] = useState<boolean>(false);

  const { activeGroup, activeUser, headerTitle, setHeaderTitle } = useUser();

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true); // Start loading before fetching messages
      setNoConversation(false); // Reset noConversation state

      try {
        let response;
        if (userDetails?.GroupID) {
          response = await axios.get(
            `http://localhost:3000/api/groupmessages?groupid=${userDetails.GroupID}`
          );
        } else if (activeUser) {
          response = await axios.get(
            `http://localhost:3000/api/messages/${activeUser}`
          );
        } else {
          return;
        }

        if (response.data.error || response.data.length === 0) {
          console.log("No messages found:", response.data.error || "Empty data");
          // Delay the display of 'No conversation' message by 3 seconds
          setTimeout(() => {
            setNoConversation(true);
            setLoading(false); // Stop loading
          }, 3000);
        } else {
          setTimeout(() => {
            setHeaderTitle(response.data.GroupName || response.data.Username);
            setMessageList(response.data);
            setLoading(false); // Stop loading after messages are set
          }, 3000);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessageList([]); // Ensure messageList is empty on error
        setNoConversation(true); // Set noConversation state on error
        setLoading(false); // Stop loading state on error
      }
    };

    fetchMessages();
  }, [userDetails?.GroupID, activeUser, activeGroup]);

  const handleGroupCreate = (newGroup: User) => {
    setSelectedUser({
      ...newGroup,
      GroupID: newGroup.GroupID,
      GroupName: newGroup.GroupName,
    });
    setHeaderTitle(newGroup.GroupName);
    setMessageList([]);
  };

  useEffect(() => {
    if (userDetails) {
      setHeaderTitle(userDetails.GroupName || userDetails.Username);
      setMessageList([]);
    }
  }, [userDetails]);

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", height: "80vh" }}>
        <Header
          Title={headerTitle}
          selectedUser={selectedUser || userDetails}
          onGroupCreate={handleGroupCreate}
        />
        {loading ? (
          <Typography
            variant="body1"
            sx={{ p: 2, textAlign: "center", mb: "150px" }}
          >
            Loading...
          </Typography>
        ) : noConversation ? (
          <Typography
            variant="h4"
            sx={{ p: 2, textAlign: "center", mb: "150px" }}
          >
            {userDetails.GroupID
              ? "There is no conversation in this Group"
              : "There is no conversation in this Chat"}
          </Typography>
        ) : (
          <ChatComponent
            userDetails={selectedUser || userDetails}
            messageList={messageList}
          />
        )}
        <Footer
          userDetails={selectedUser || userDetails}
          setMessageList={setMessageList}
        />
      </Box>
    </>
  );
};

export default ChatArea;
