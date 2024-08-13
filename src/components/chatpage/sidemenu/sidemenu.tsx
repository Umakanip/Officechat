import React, { useState } from "react";
import { FaBell, FaUsers, FaComments } from "react-icons/fa";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Toolbar,
  Typography,
  CssBaseline,
  Divider,
  Icon,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import "./SideMenu.css";
import ChatIcon from "@mui/icons-material/Chat";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ContactList from "../chatlist/ContactList.tsx";
import ChatArea from "../ChatWindow/ChaArea.tsx";
import { useUser } from "../../context/UserContext.tsx";

interface Item {
  details: string;
  id: number | null | undefined;
  ProfilePicture: string | undefined;
  Username: string;
  UserID: number | null;
  GroupID: number | null;
}

const ActivityContent = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 3,
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bolder" }}>
        Stay in Touch using Chat
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 18,
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "0.5px solid #d3d4d9",
            borderRadius: "10px",
            height: "450px",
          }}
        >
          <img
            src="chat.jpg"
            alt="Form 1"
            style={{ height: "300px", padding: "20px" }}
          />
          <p style={{ fontSize: "20px", fontWeight: "bold" }}>Start chatting</p>
          <IconButton
            sx={{ fontSize: "15px", color: "#006FFC", cursor: "no-drop" }}
          >
            <ChatIcon sx={{ fontSize: "20px" }} />
            &nbsp;
            <a
              href="#"
              style={{
                color: "#006FFC",
                cursor: "no-drop",
                textDecoration: "none",
              }}
            >
              New chat
            </a>
          </IconButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "0.5px solid #d3d4d9",
            borderRadius: "10px",
          }}
        >
          <img
            src="invite.jpg"
            alt="Form 2"
            style={{ height: "300px", width: "300px", padding: "20px" }}
          />
          <p style={{ fontSize: "20px", fontWeight: "bold" }}>
            Invite people you know
          </p>
          <IconButton
            sx={{ fontSize: "15px", color: "#006FFC", cursor: "no-drop" }}
          >
            <PersonAddIcon sx={{ fontSize: "20px" }} />
            &nbsp;
            <a
              href="#"
              style={{
                color: "#006FFC",
                cursor: "no-drop",
                textDecoration: "none",
              }}
            >
              Invite to Teams
            </a>
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

interface ChatContentProps {
  selectedUser: Item | null;
}

const ChatContent: React.FC<ChatContentProps> = ({ selectedUser }) => {
  return (
    <div>
      {selectedUser && <ChatArea userDetails={selectedUser}></ChatArea>}
    </div>
  );
};

const TeamsContent = ({
  selectedItem,
  onSelect,
}: {
  selectedItem: Item | null;
  onSelect: (item: Item) => void;
}) => {
  const contacts: Item[] = [
    {
      id: 1,
      Username: "Contact 1",
      details: "Details about Contact 1",
      ProfilePicture: undefined,
      UserID: null,
      GroupID: null,
    },
    {
      id: 2,
      Username: "Contact 2",
      details: "Details about Contact 2",
      ProfilePicture: undefined,
      UserID: null,
      GroupID: null,
    },
    {
      id: 3,
      Username: "Contact 3",
      details: "Details about Contact 3",
      ProfilePicture: undefined,
      UserID: null,
      GroupID: null,
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h5">Teams</Typography>
        <List>
          {contacts.map((contact) => (
            <ListItem button key={contact.id} onClick={() => onSelect(contact)}>
              <ListItemText primary={contact.Username} />
            </ListItem>
          ))}
        </List>
      </Box>
      {selectedItem && (
        <Box sx={{ flex: 2, ml: 3 }}>
          <Typography variant="h6">{selectedItem.Username}</Typography>
          <Typography>{selectedItem.details}</Typography>
        </Box>
      )}
    </Box>
  );
};

const menuItems = [
  { text: "Activity", component: "activity", icon: <FaBell /> },
  { text: "Chat", component: "chat", icon: <FaComments /> },
  { text: "Teams", component: "teams", icon: <FaUsers /> },
];
console.log("menu items :", menuItems);

interface GroupChat {
  id: number;
  name: string;
}

interface SideMenuProps {
  groupChats: GroupChat[];
  onSelectChat: (chat: GroupChat) => void;
}
const drawerWidth = 80;

const SideMenu: React.FC<SideMenuProps> = ({ groupChats, onSelectChat }) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedComponent, setSelectedComponent] =
    useState<string>("activity");
  const [selectedUser, setSelectedUser] = useState<Item | null>(null);
  const { setActiveGroup, setActiveUser } = useUser();

  const handleSelectItem = (item: Item) => {
    setSelectedItem(item);
  };

  const handleSelectUser = (user: any) => {
    if (user.GroupID) {
      // If the item has GroupID, it's a group
      setSelectedUser(user);
      setActiveGroup(user.GroupID); // Set the active group
      setActiveUser(null); // Clear active user
    } else if (user.UserID) {
      // If the item has UserID, it's a user
      setSelectedUser(user);
      setActiveUser(user.UserID); // Set the active user
      setActiveGroup(null); // Clear active group
    }
  };

  const handleMenuItemClick = (component: string) => {
    setSelectedItem(null);
    setSelectedComponent(component);
  };

  // // Handle group creation
  // const handleGroupCreation = (groupEmail: string) => {
  //   const newGroup = groupChats.find((group) => group.name === groupEmail);
  //   if (newGroup) {
  //     setSelectedItem(null); // Clear any selected item
  //     setSelectedComponent("chat"); // Switch to chat component
  //     setSelectedUser({ ...newGroup, GroupID: newGroup.id } as Item); // Update state with new group details
  //   }
  // };

  const renderContent = () => {
    switch (selectedComponent) {
      case "activity":
        return (
          <ActivityContent
            selectedItem={selectedItem}
            onSelect={handleSelectItem}
          />
        );
      case "chat":
        return selectedUser ? (
          <ChatContent selectedUser={selectedUser} />
        ) : (
          <Typography variant="h5" sx={{ p: 2, mt: 20 }}>
            Select a user to start chatting
          </Typography>
        );
      case "teams":
        return (
          <TeamsContent
            selectedItem={selectedItem}
            onSelect={handleSelectItem}
          />
        );
      default:
        return (
          <ActivityContent
            selectedItem={selectedItem}
            onSelect={handleSelectItem}
          />
        );
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            marginTop: "64px",
          },
        }}
      >
        <Toolbar />
        <Box
          sx={{
            overflow: "auto",
            bgcolor: "#485872",
            color: "white",
            borderTop: "0.5px solid #dbd5d1",
          }}
        >
          <List>
            {menuItems.map(
              (item, index) => (
                console.log("item:", item),
                (
                  <ListItem
                    button
                    key={index}
                    onClick={() => handleMenuItemClick(item.component)}
                    sx={{
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      backgroundColor: "transparent", // Highlight active item
                      borderLeft:
                        selectedComponent === item.component
                          ? "2px solid rgb(98, 109, 205)"
                          : "none", // Border for active item
                      color:
                        selectedComponent === item.component
                          ? "#3e849e"
                          : "none", // Border for active item
                    }}
                  >
                    <Icon sx={{ fontSize: "24px", mb: 1 }}>{item.icon}</Icon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{ fontSize: "12px" }}
                    />
                  </ListItem>
                )
              )
            )}
          </List>
          <Divider />
        </Box>
      </Drawer>
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        {selectedComponent === "chat" && (
          <ContactList onSelectUser={handleSelectUser} />
        )}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 0,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
};

export default SideMenu;
