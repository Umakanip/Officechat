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
  const [headerTitle, setHeaderTitle] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Add loading state

  const {
    activeGroup,
    setActiveGroup,
    setGroups,
    activeUser,
    setActiveUser,
    selectActiveUser,
    setselectActiveUser,
  } = useUser();

  useEffect(() => {
    // console.log("activeUser", userDetails);

    const fetchMessages = async () => {
      setLoading(true); // Start loading before fetching messages
      try {
        let response;
        console.log("selectedUser?.GroupID", userDetails?.GroupID);
        if (userDetails?.GroupID) {
          response = await axios.get(
            `http://localhost:3000/api/groupmessages?groupid=${userDetails.GroupID}`
          );
        } else if (activeUser) {
          console.log("else if");
          response = await axios.get(
            `http://localhost:3000/api/messages/${activeUser}`
          );
        } else {
          return;
        }

        if (response.data.error) {
          console.log("No messages found:", response.data.error);
          setMessageList([]);
        } else {
          setMessageList(response.data);
          setHeaderTitle(response.data.GroupName || response.data.Username);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessageList([]);
      } finally {
        setLoading(false); // Stop loading after fetching messages
      }
    };
    // }, 300);

    fetchMessages();
    // Clean up the debounce on component unmount
    // return () => {
    //   fetchMessages.cancel();
    // };
  }, [userDetails?.GroupID, activeUser, activeGroup]);

  const handleGroupCreate = (newGroup: User) => {
    console.log("Groupdata", newGroup);
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
      // setSelectedUser(userDetails);
      setHeaderTitle(userDetails.GroupName || userDetails.Username);
      setMessageList([]);
    }
  }, [userDetails]);

  // useEffect(() => {
  //   if (selectedUser) {
  //     setHeaderTitle(selectedUser.Username);
  //   }
  // }, [selectedUser]);
  console.log("SELECTUSER", headerTitle);
  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", height: "80vh" }}>
        <Header
          headerTitle={headerTitle}
          selectedUser={selectedUser || userDetails}
          onGroupCreate={handleGroupCreate}
        />
        {loading ? (
          <Typography variant="body1" sx={{ p: 2, textAlign: "center" }}>
            Loading messages...
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
