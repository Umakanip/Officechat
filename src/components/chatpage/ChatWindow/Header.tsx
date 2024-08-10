import axios from "axios";
import React, { MouseEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  IconButton,
  Popover,
  Typography,
  Avatar,
  Button,
  TextField,
} from "@mui/material";
import { Message, Group, User } from "./messagetypes.ts";
import GroupIcon from "@mui/icons-material/Group";
import VideocamIcon from "@mui/icons-material/Videocam";
import { useUser } from "../../context/UserContext.tsx";
import io from "socket.io-client";
import Suggestions from "../Header/Suggestions.tsx";
import AgoraClient from "../../VoiceCall/AgoraClient.tsx";
import CallIcon from "@mui/icons-material/Call";
import CallPopup from "../../VoiceCall/CallPopup.tsx";

const socket = io("http://localhost:5000");

interface HeaderProps {
  selectedUser: User;
  onGroupCreate;
  headerTitle: string | undefined;
}

const Header: React.FC<HeaderProps> = ({
  headerTitle,
  selectedUser,
  onGroupCreate,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [selectedUserIDs, setSelectedUserIDs] = useState<number[]>([]);
  const [groupDetails, setGroupDetails] = useState();
  const {
    groups,
    setGroups,
    activeGroup,
    setActiveGroup,
    setActiveUser,
    user,
  } = useUser();
  const [channelName, setChannelName] = useState<string>("");
  const [token, setToken] = useState<string>("");
  // const [searchSuggestions, setSearchSuggestions] = useState<User[]>([]);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [incomingCall, setIncomingCall] = useState<string | null>(null);
  const [isCallPopupVisible, setIsCallPopupVisible] = useState(false);
  var receiverIds: any = selectedUser?.UserID;
  useEffect(() => {
    socket.emit("register", user?.userdata?.UserID);

    socket.on(
      "incomingCall",
      (data: { channelName: string; token: string; callerId: string }) => {
        setChannelName(data.channelName);
        setToken(data.token);
        setIncomingCall(data.callerId);
        console.log("Incoming call data", data);
      }
    );

    socket.on("callAccepted", ({ channelName, callerId }) => {
      console.log(`Call accepted by ${callerId}`);
      setChannelName(channelName);
      setToken(token);
    });

    socket.on("callRejected", ({ callerId }) => {
      console.log(`Call rejected by ${callerId}`);
      setIncomingCall(null);
      setChannelName("");
      setToken("");
    });

    return () => {
      socket.off("incomingCall");
      socket.off("callAccepted");
      socket.off("callRejected");
    };
  }, [token, user]);

  const startCall = () => {
    if (!selectedUser) return; // Handle case where selectedUser might be null

    const generatedChannelName = "testChannel";
    const callerId = user?.userdata?.UserID;
    const receiverId = selectedUser?.UserID;

    console.log("Starting call with:", {
      channelName: generatedChannelName,
      callerId,
      receiverIds: [receiverId],
    });

    socket.emit("callUsers", {
      channelName: generatedChannelName,
      callerId,
      receiverIds: [receiverId],
    });
  };

  const acceptCall = () => {
    if (incomingCall) {
      console.log("Call accepted");
      socket.emit("callAccepted", { channelName, callerId: incomingCall });
      // Agora client connection will be handled in AgoraClient component
      setIncomingCall(null);
    }
    setIsCallPopupVisible(false);
  };

  const rejectCall = () => {
    if (incomingCall) {
      console.log("Call rejected");
      socket.emit("callRejected", { channelName, callerId: incomingCall });
      setIncomingCall(null);
      // Optionally, add logic to notify the caller that the call was rejected
    }
  };

  const handlePopoverOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const navigate = useNavigate();

  const handleVideoClick = () => {
    navigate("/video-call");
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const fetchSuggestions = async (searchQuery) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/usernamesugggestions",
        {
          params: { query: searchQuery },
        }
      );
      console.log("resssssssssssss", response.data);
      setSuggestions(response.data);
      setSuggestionsVisible(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleEmailChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setQuery(value); // Update the query state
    if (value) {
      fetchSuggestions(value); // Fetch suggestions if there's input
    } else {
      setSuggestions([]);
      setSuggestionsVisible(false);
    }
  };

  const handleCreateGroup = async () => {
    // Handle the "Create" button logic here
    console.log("Email:Email:", selectedUserIDs);
    console.log("Email:", (selectedUser as User).UserID || null);
    const namesArray = query
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
    const groupname = [(selectedUser as User).Username, ...namesArray].join(
      ", "
    );
    try {
      const response = await axios.post(
        `http://localhost:3000/api/creategroup?`,
        {
          // Email: groupEmail,
          GroupName: groupname,
          Username: [(selectedUser as User).Username, ...namesArray],
          CreatedBy: (selectedUser as User).UserID || null,
          CreatedAt: new Date(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("REsponse", response.data);
      setGroupDetails(response.data);
      const newGroup = response.data;

      setGroups((prevGroups) => [newGroup, ...prevGroups]);
      setActiveGroup(response.data.GroupID);
      setActiveUser(null);
      // Update the selectedUser with the new group information if needed
      onGroupCreate(newGroup); // Pass the new group information
      setQuery(""); // Clear the input

      handlePopoverClose(); // Close the popover after action
      // setHeaderTitle(response.data.group.GroupName);
    } catch (error: any) {
      console.error("Error sending data:", error);
    }
  };

  const { UserID, Username, GroupName, ProfilePicture, GroupID } = selectedUser;
  const namesArray = query
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
  const handleAddUser = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/addUsers?`,
        {
          // Email: groupEmail,
          GroupID: GroupID,
          Usernames: namesArray || null,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("REsponse", response.data.insertedMembers[0].Username);
      console.log("REsponse", response.data.group);
      const updatedGroup = response.data.group;
      setGroupDetails(updatedGroup); // Update with new group details
      setActiveGroup(updatedGroup.GroupID); // Ensure active group is updated
      setActiveUser(null);
      // setGroupDetails(response.data.group);
      // setHeaderTitle(response.data.group.GroupName);
    } catch (error: any) {
      console.error("Error sending data:", error);
    }
  };
  const handleSelectUser = (username) => {
    console.log("User selected:", username);
    setQuery(username);
    setSelectedUserIDs(username);
    setSuggestions([]);
    setSuggestionsVisible(false);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        {selectedUser ? (
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: "#dbd5d1",
                p: 3,
                height: 65,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  alt={
                    selectedUser.UserID
                      ? selectedUser.Username || "User"
                      : selectedUser.GroupName || "Group"
                  }
                  src={selectedUser.ProfilePicture || undefined}
                  sx={{ mr: 2 }}
                />
                <Typography variant="h6" color="white">
                  {selectedUser.UserID
                    ? selectedUser.Username || "User"
                    : selectedUser.GroupName || "Group"}
                </Typography>
              </Box>
              {/* <GroupIcon
              style={{ cursor: "pointer" }}
              sx={{ color: "black" }}
              onClick={handleDialogOpen} // Open dialog on click
            /> */}

              <IconButton
                onClick={startCall}
                sx={{ marginLeft: "0px", color: "#1976d2" }}
              >
                <CallIcon />
              </IconButton>

              <IconButton
                sx={{ marginLeft: "auto", color: "#1976d2" }}
                onClick={handleVideoClick}
              >
                <VideocamIcon sx={{ fontSize: 30 }} />
              </IconButton>

              <IconButton sx={{ color: "black" }} onClick={handlePopoverOpen}>
                <GroupIcon />
              </IconButton>
            </Box>

            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              sx={{ p: 2 }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Email ID"
                  type="email"
                  value={query}
                  onChange={handleEmailChange}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
                {suggestionsVisible && (
                  <Suggestions
                    suggestions={suggestions}
                    onSelect={handleSelectUser}
                  />
                )}

                <Button variant="contained" onClick={handleCreateGroup}>
                  Create Group
                </Button>
                <Button variant="contained" onClick={handleAddUser}>
                  Add User
                </Button>
              </Box>
            </Popover>
          </Box>
        ) : (
          <Typography variant="h5" sx={{ p: 2, mt: 20 }}></Typography>
        )}
      </Box>
    </>
  );
};

export default Header;
