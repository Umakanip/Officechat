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
    console.log("activeUser", selectActiveUser);
    if (selectActiveUser) {
      setSelectedUser(selectActiveUser);
      setHeaderTitle(selectActiveUser.Username || "User");
    } else if (activeUser) {
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/users/${activeUser}`
          );
          setSelectedUser(response.data);
          setHeaderTitle(response.data.Username || "User");
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };
      fetchUserDetails();
    }
  }, [selectActiveUser, activeUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true); // Start loading before fetching messages
      try {
        let response;
        if (selectedUser?.GroupID) {
          response = await axios.get(
            `http://localhost:3000/api/groupmessages?groupid=${selectedUser.GroupID}`
          );
        } else if (activeUser) {
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
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessageList([]);
      } finally {
        setLoading(false); // Stop loading after fetching messages
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
    setHeaderTitle(newGroup.GroupName);
    setMessageList([]);
  };

  useEffect(() => {
    if (userDetails) {
      setSelectedUser(userDetails);
      setHeaderTitle(userDetails.GroupName || userDetails.Username || "Chat");
      setMessageList([]);
    }
  }, [userDetails]);

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
