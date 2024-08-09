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
import io from 'socket.io-client';
import AgoraRTC, { IAgoraRTCClient } from 'agora-rtc-sdk-ng';
import AgoraClient from "../../VoiceCall/AgoraClient.tsx";
import { AgoraRTCProvider } from 'agora-rtc-react';
import CallIcon from '@mui/icons-material/Call';
import CallPopup from "../../VoiceCall/CallPopup.tsx";

const socket = io('http://localhost:5000');

interface HeaderProps {
  selectedUser: User;
  onGroupCreate: (group: any) => void;
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
  const { groups, setGroups, activeGroup, setActiveGroup, setActiveUser, user } =
    useUser();
  // const [headerTitle, setHeaderTitle] = useState<string>();


  const [channelName, setChannelName] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [incomingCall, setIncomingCall] = useState<string | null>(null);

  useEffect(() => {
    socket.emit('register', user?.userdata?.UserID);

    socket.on('incomingCall', (data: { channelName: string, token: string, callerId: string }) => {
      setChannelName(data.channelName);
      setToken(data.token);
      setIncomingCall(data.callerId);
      console.log("Incoming call data", data);
    });

    socket.on('callAccepted', ({ channelName, callerId }) => {
      console.log(`Call accepted by ${callerId}`);
      setChannelName(channelName);
      setToken(token);
    });

    socket.on('callRejected', ({ callerId }) => {
      console.log(`Call rejected by ${callerId}`);
      setIncomingCall(null);
      setChannelName('');
      setToken('');
    });

    return () => {
      socket.off('incomingCall');
      socket.off('callAccepted');
      socket.off('callRejected');
    };
  }, [token, user]);

  const startCall = () => {
    if (!selectedUser) return; // Handle case where selectedUser might be null

    const generatedChannelName = 'testChannel';
    const callerId = user?.userdata?.UserID;
    const receiverId = selectedUser?.UserID;
    
    console.log('Starting call with:', {
      channelName: generatedChannelName,
      callerId,
      receiverIds: [receiverId],
    });

    socket.emit('callUsers', { channelName: generatedChannelName, callerId, receiverIds: [receiverId] });
  };

  const acceptCall = () => {
    if (incomingCall) {
      console.log('Call accepted');
      socket.emit('callAccepted', { channelName, callerId: incomingCall });
      // Agora client connection will be handled in AgoraClient component
      setIncomingCall(null);
    }
  };

  const rejectCall = () => {
    if (incomingCall) {
      console.log('Call rejected');
      socket.emit('callRejected', { channelName, callerId: incomingCall });
      setIncomingCall(null);
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

  const fetchSuggestions = async (searchQuery: string) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/usernamesuggestions",
        {
          params: { query: searchQuery },
        }
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleEmailChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setQuery(value);
    if (value) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleCreateGroup = async () => {
    const namesArray = query
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
    const groupname = [(selectedUser as User).Username, ...namesArray].join(", ");
    try {
      const response = await axios.post(
        "http://localhost:3000/api/creategroup",
        {
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
      console.log("Response", response.data);
      setGroupDetails(response.data);
      const newGroup = response.data;

      setGroups((prevGroups) => [newGroup, ...prevGroups]);
      setActiveGroup(response.data.GroupID);
      setActiveUser(null);
      onGroupCreate(newGroup);
      setQuery("");
      handlePopoverClose();
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const handleAddUser = async () => {
    const namesArray = query
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/addUsers",
        {
          GroupID: (selectedUser as User).GroupID,
          Usernames: namesArray || null,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response", response.data.insertedMembers[0].Username);
      console.log("Response", response.data.group);
      const updatedGroup = response.data.group;
      setGroupDetails(updatedGroup);
      setActiveGroup(updatedGroup.GroupID);
      setActiveUser(null);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const handleSelectUser = (username) => {
    console.log("User selected:", username);
    setSelectedUserIDs(username);
    setSuggestions([]);
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
                  alt={selectedUser.UserID ? selectedUser.Username || "User" : selectedUser.GroupName || "Group"}
                  src={selectedUser.ProfilePicture || undefined}
                  sx={{ mr: 2 }}
                />
                <Typography variant="h6" color="white">
                  {selectedUser.UserID ? selectedUser.Username || "User" : selectedUser.GroupName || "Group"}
                </Typography>
              </Box>

              <IconButton onClick={startCall} sx={{ marginLeft: "0px", color: "#1976d2" }}>
                <CallIcon />
              </IconButton>

              <IconButton
                sx={{ marginLeft: "auto", color: "#1976d2" }}
                onClick={handleVideoClick}>
                <VideocamIcon sx={{ fontSize: 30 }} />
              </IconButton>

              <IconButton
                sx={{ color: "black" }}
                onClick={handlePopoverOpen}
              >
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
                <Box sx={{ maxHeight: "200px", overflowY: "auto" }}>
                  {suggestions.map((user) => (
                    <Box
                      key={user.UserID}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 1,
                        borderBottom: "1px solid #ddd",
                        cursor: "pointer",
                      }}
                      onClick={() => handleSelectUser(user.Username)}
                    >
                      <Avatar
                        alt={user.Username || "User"}
                        src={user.ProfilePicture || undefined}
                        sx={{ mr: 2 }}
                      />
                      <Typography variant="body2">{user.Username}</Typography>
                    </Box>
                  ))}
                </Box>
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
          <Box sx={{ bgcolor: "#064D51", p: 3 }}>
            <Typography variant="h6" color="white">
              {headerTitle}
            </Typography>
          </Box>
        )}

        {/* Conditionally render CallPopup based on incomingCall state */}
        {incomingCall && (
          <CallPopup
            incomingCall={incomingCall}
            caller={selectedUser}
            onAccept={acceptCall}
            onReject={rejectCall}
          />
        )}

        {token && <AgoraClient channelName={channelName} token={token} />}
      </Box>
    </>
  );
};

export default Header;
