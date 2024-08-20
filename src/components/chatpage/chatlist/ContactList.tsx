import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Avatar,
  Box,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import { useUser } from "../../context/UserContext.tsx";
import io from "socket.io-client";
import { Message, User } from "../ChatWindow/messagetypes.ts";

interface Contact {
  id: number;
  name: string;
  image: string;
}

interface ContactListProps {
  onSelectUser: (user: Contact) => void;
}

const socket = io("http://localhost:5000");

const ContactList: React.FC<ContactListProps> = ({ onSelectUser }) => {
  // console.log(onSelectUser);
  // const [Group, setGroup] = useState();
  const { user, groups, setGroups } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [loggedInUsers, setLoggedInUsers] = useState<any[]>([]);
  // const [activeGroup, setActiveGroup] = useState<number | null>(null);
  const {
    activeGroup,
    setActiveGroup,
    activeUser,
    setActiveUser,
    setSelectedUserId,
    setselectActiveUser,
    selectActiveUser,
    Contact,
    setContact,
  } = useUser();
  const [userStatus, setUsersStatus] = useState<Map<number, boolean>>(
    new Map()
  );

  useEffect(() => {
    console.log("groupsgroups", selectActiveUser);

    axios
      .get(`http://localhost:3000/api/users/${user?.userdata?.UserID}`)
      .then((response) => {
        const users = response.data;
        console.log("contact", users);

        setContact(response.data);
        if (response.data.length > 0) {
          // Automatically select the first user
          const firstUser = response.data[0];
          setActiveUser(firstUser.UserID);
          setSelectedUserId(firstUser.UserID); // Set first user as active
          onSelectUser(firstUser); // Pass the first user to parent component
        }
      })
      .catch((error) => {
        setError(error.message);
      });

    // for groups

    axios
      .get("http://localhost:3000/api/grouplist")
      .then((response) => {
        setGroups(response.data);
      })
      .catch((error) => {
        setError(error.message);
      });

    return () => {
      socket.off("userStatusUpdate");
    };
  }, [setGroups, setContact]);

  useEffect(() => {
    if (user) {
      const interval = setInterval(async () => {
        const response = await axios.get(
          "http://localhost:3000/api/getActiveUser"
        );
        console.log("responseresponse", response);
        setLoggedInUsers(response.data);
      }, 5000); // Send every 5 seconds

      return () => clearInterval(interval); // Clean up on unmount
    }
  }, [user]);
  useEffect(() => {
    // console.log(loggedInUsers);
    const updatedArray = Contact.map((item) => ({
      ...item,
      isActive: loggedInUsers.includes(item.UserID) ? true : false,
    }));
    setContact(updatedArray);
  }, [loggedInUsers]);

  const handleContactClick = (userid: number) => {
    console.log(userid);
    setSelectedUserId(userid);
    setActiveUser(userid); // Set active contact
    setActiveGroup(null);
  };
  const handlegroupActive = (groupid: any) => {
    setActiveGroup(groupid);
    setActiveUser(null);
    onSelectUser(groupid);
  };
  return (
    <Box
      sx={{
        width: "400px",
        bgcolor: "#dbd5d1",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #bdbdbd",
      }}
    >
      {" "}
      {/* Ensure full height */}
      <Typography
        variant="h6"
        sx={{
          p: 2,
          bgcolor: "teal",
          color: "white",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen','Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
        }}
      >
        Chat
      </Typography>
      <List
        sx={{
          flexGrow: 1,
          overflow: "auto",
          height: "250px",
          // '&::-webkit-scrollbar': {
          //   width: '1px',
          // },
        }}
      >
        {" "}
        {/* Allow list to scroll */}
        {Contact?.map((item) => {
          // const Status = userStatus.find(
          //   (Status: any) => Status.UserID === item.UserID
          // );

          return (
            <ListItem
              button
              key={item.UserID}
              onClick={() => {
                onSelectUser(item);
                handleContactClick(item.UserID);
              }}
              sx={{
                bgcolor: activeUser === item.UserID ? "#999da259" : "inherit", // Change background for active group
              }}
            >
              <ListItemAvatar>
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    alt={item.Username}
                    src={item.ProfilePicture}
                    sx={{
                      width: 45,
                      height: 45,
                      borderRadius: "50%",
                      // border: item.Status ? "2px solid #4caf50" : "none",
                      position: "relative",
                    }}
                  />
                  {item.isActive && (
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 7,
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        bgcolor: "#4caf50",
                        border: "2px solid white",
                      }}
                    />
                  )}
                </Box>
              </ListItemAvatar>
              <ListItemText
                primary={item.Username}
                secondary={
                  <Typography variant="body2" color="textSecondary">
                    Click here to chat
                  </Typography>
                }
              />
            </ListItem>
          );
        })}
      </List>
      <Typography
        variant="h6"
        sx={{
          p: 2,
          bgcolor: "teal",
          color: "white",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen','Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
        }}
      >
        Groups
      </Typography>
      {groups ? (
        <List sx={{ flexGrow: 1, height: "327px", overflow: "auto" }}>
          {" "}
          {/* Allow list to scroll */}
          {groups.map((item: any) => (
            <ListItem
              button
              key={item.GroupID}
              onClick={() => {
                onSelectUser(item);
                handlegroupActive(item.GroupID);
              }}
              sx={{
                backgroundColor:
                  activeGroup === item.GroupID
                    ? "#999da259" // Change background color for active group (with slight transparency)
                    : "inherit", // No change for non-active group // Change background for active group
              }}
            >
              <ListItemAvatar>
                <Avatar alt={item.GroupName} />
              </ListItemAvatar>
              <ListItemText
                primary={item.GroupName}
                secondary={
                  <Typography variant="body2" color="textSecondary">
                    Some Text to write
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      ) : (
        ""
      )}
    </Box>
  );
};

export default ContactList;
