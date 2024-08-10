import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Footer from "./Footer.tsx";
import Header from "./Header.tsx";
import ChatComponent from "./RenderChatComponent.tsx";
import { Message, User } from "./messagetypes.ts";
import axios from "axios";
import { useUser } from "../../context/UserContext.tsx";

interface ChatAreaProps {
  userDetails: User; // Adjust type if needed
}

const ChatArea: React.FC<ChatAreaProps> = ({ userDetails }) => {
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [headerTitle, setHeaderTitle] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { activeGroup, setActiveGroup, setGroups, activeUser, setActiveUser } =
    useUser();

  useEffect(() => {
    // Fetch messages based on selectedUser or activeGroup
    const fetchMessages = async () => {
      try {
        let response;
        if (selectedUser?.GroupID) {
          response = await axios.get(
            `http://localhost:3000/api/groupmessages?groupid=${selectedUser.GroupID}`
          );
        } else if (activeUser) {
          response = await axios.get(
            `http://localhost:3000/api/messages/${userDetails.UserID}`
          );
        } else {
          // Handle case where neither group nor single chat is selected
          return;
        }
        console.log("Fiel", response.data);
        setMessageList(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedUser, activeUser, activeGroup]);

  const handleGroupCreate = (newGroup: User) => {
    console.log("Groupdata", newGroup);
    setSelectedUser({
      ...newGroup,
      GroupID: newGroup.GroupID,
      GroupName: newGroup.GroupName,
    });
    setHeaderTitle(newGroup.GroupName); // Update header title with group name
    setMessageList([]); // Clear messages for new group
  };

  // Handle user or group selection changes
  useEffect(() => {
    if (userDetails) {
      setSelectedUser(userDetails);
      setHeaderTitle(userDetails.GroupName || userDetails.Username || "Chat");
      setMessageList([]); // Clear messages when changing user/group
    }
  }, [userDetails]);

  // Ensure header updates with the selected user
  useEffect(() => {
    if (selectedUser) {
      setHeaderTitle(selectedUser.Username || "User");
    }
  }, [selectedUser]);

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", height: "80vh" }}>
        <Header
          headerTitle={headerTitle}
          selectedUser={selectedUser || userDetails}
          onGroupCreate={handleGroupCreate}
        />
        <ChatComponent
          userDetails={selectedUser || userDetails}
          messageList={messageList}
        />
        <Footer
          userDetails={selectedUser || userDetails}
          setMessageList={setMessageList}
        />
      </Box>
    </>
  );
};

export default ChatArea;

// import React, { useState, useEffect } from "react";
// import { Box, Typography } from "@mui/material";
// import Footer from "./Footer.tsx";
// import Header from "./Header.tsx";
// import ChatComponent from "./RenderChatComponent.tsx";
// import { Message, User } from "./messagetypes.ts";
// import axios from "axios";
// import { useUser } from "../../context/UserContext.tsx";

// interface ChatAreaProps {
//   userDetails: any;
// }

// const ChatArea: React.FC<ChatAreaProps> = ({ userDetails }) => {
//   const [messageList, setMessageList] = useState<Message[]>([]);
//   const [headerTitle, setHeaderTitle] = useState<string>("");
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const { activeGroup, setActiveGroup, setGroups, activeUser, setActiveUser } =
//     useUser();

//   useEffect(() => {
//     console.log("ActiveGroup:", userDetails.GroupID);
//     const fetchMessages = async () => {
//       try {
//         let response;
//         if (userDetails.GroupID) {
//           response = await axios.get(
//             `http://localhost:3000/api/groupmessages?groupid=${userDetails.GroupID}`
//           );
//         } else if (activeUser) {
//           response = await axios.get(
//             `http://localhost:3000/api/messages/${userDetails.UserID}`
//           );
//         } else {
//           // Handle case where neither group nor single chat is selected
//           return;
//         }
//         setMessageList(response.data);
//       } catch (error) {
//         console.error("Error fetching messages:", error);
//       }
//     };

//     fetchMessages();
//   }, [activeGroup, activeUser]);

//   const handleGroupCreate = (newGroup: any) => {
//     console.log("Groupdata", newGroup);
//     setSelectedUser({
//       // Assuming you want to update or set selectedUser with new group data
//       ...newGroup,
//       GroupID: newGroup.GroupID,
//       GroupName: newGroup.GroupName,
//       // Add other necessary properties or update selectedUser based on your requirements
//     });
//     setHeaderTitle(newGroup); // Update header title with group email
//     setMessageList([]); // Clear messages for new group
//   };
//   console.log("Active User", activeUser);
//   console.log("Active Group", activeGroup);
//   return (
//     <>
//       <Box sx={{ display: "flex", flexDirection: "column", height: "80vh" }}>
//         {userDetails?.UserID && (
//           <>
//             <Header
//               headerTitle={headerTitle}
//               selectedUser={userDetails}
//               onGroupCreate={handleGroupCreate}
//             />

//             <ChatComponent
//               userDetails={userDetails}
//               messageList={messageList}
//             />
//           </>
//         )}
//         {userDetails?.GroupID || activeGroup ? (
//           <>
//             <Header
//               headerTitle={headerTitle}
//               selectedUser={selectedUser || userDetails}
//               onGroupCreate={handleGroupCreate}
//             />
//             {/* <Box
//               sx={{
//                 flexGrow: 1,

//                 overflow: "hidden",
//               }}
//             > */}
//             <ChatComponent
//               userDetails={selectedUser || userDetails}
//               messageList={messageList}
//             />
//             {/* </Box> */}
//           </>
//         ) : (
//           <Box
//             sx={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               height: "100%",
//             }}
//           >
//             <Typography variant="h5"></Typography>
//           </Box>
//         )}
//         <Footer userDetails={userDetails} setMessageList={setMessageList} />
//       </Box>
//     </>
//   );
// };

// export default ChatArea;
