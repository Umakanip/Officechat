import axios from "axios";
import React, { MouseEvent, useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  IconButton,
  Popover,
  Typography,
  Avatar,
  Button,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import CloseIcon from "@mui/icons-material/Close";
import { Message, Group, User } from "./messagetypes.ts";
import GroupIcon from "@mui/icons-material/Group";
import VideocamIcon from "@mui/icons-material/Videocam";
import { useUser } from "../../context/UserContext.tsx";
import io from "socket.io-client";
import Suggestions from "../Header/Suggestions.tsx";
import AgoraClient from "../../VoiceCall/AgoraClient.tsx";
import { AgoraRTCProvider } from "agora-rtc-react";
import CallIcon from "@mui/icons-material/Call";
import CallPopup from "../../VoiceCall/CallPopup.tsx";
import ActionModal from "./ActionModal.tsx";
import AgoraRTC, {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
// import { IconButton } from '@mui/material';
import CallEndIcon from "@mui/icons-material/CallEnd";

const socket = io("http://localhost:5000");
const rtcClient: any = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

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
  const [groupMembers, setGroupMembers] = useState<User[]>([]);
  const [hoveredUserId, setHoveredUserId] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    description: "",
    actionText: "",
    onConfirm: () => {},
  });

  const {
    groups,
    setGroups,
    activeGroup,
    setActiveGroup,
    setActiveUser,
    setselectActiveUser,
    user,
  } = useUser();
  const [channelName, setChannelName] = useState<string>("");
  const [token, setToken] = useState<string>("");
  // const [searchSuggestions, setSearchSuggestions] = useState<User[]>([]);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [incomingCall, setIncomingCall] = useState<string | null>(null);
  const [callAccepted, setCallAccepted] = useState<boolean>(false);
  const localAudioTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const [isCallPopupVisible, setIsCallPopupVisible] = useState(false);
  const [searchParams] = useSearchParams();
  const type = searchParams.get("id");
  const [callerId, setCallerId] = useState<string | null>(type);
  const [caller, setCaller] = useState<User | null>(null);
  const [callDuration, setCallDuration] = useState<number>(0); // Call duration in seconds
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [callData, setCallData] = useState<{
    CallerID: number;
    ReceiverID: number | undefined;
    StartTime: Date;
    EndTime: Date | null;
    CallType: string;
    ScreenShared: boolean;
  } | null>(null);

  var callerdetail;

  useEffect(() => {
    console.log("user?.userdata?.UserID", headerTitle);
  });
  useEffect(() => {
    // console.log("user?.userdata?.UserID", user?.userdata?.UserID);
    // console.log("user?.userdata?.UserID", headerTitle);
    socket.emit("register", user?.userdata?.UserID);

    socket.on(
      "incomingCall",
      async (data: {
        channelName: string;
        token: string;
        callerId: string;
      }) => {
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
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.stop();
        localAudioTrackRef.current = null;
      }
    });

    return () => {
      socket.off("incomingCall");
      socket.off("callAccepted");
      socket.off("callRejected");
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [token, user]);

  const startCallTimer = () => {
    setCallDuration(0); // Reset the timer
    callTimerRef.current = setInterval(() => {
      setCallDuration((prevDuration) => prevDuration + 1);
    }, 1000);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const startCall = async () => {
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

    try {
      const callData = {
        CallerID: user?.userdata?.UserID as number,
        ReceiverID: selectedUser?.UserID,
        StartTime: new Date(),
        EndTime: null,
        CallType: "audio",
        ScreenShared: false,
      };

      setCallData(callData);

      const response = await axios.post(
        `http://localhost:3000/api/postCall?`,
        callData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Call data stored successfully:", response.data);
    } catch (error) {
      console.error("Error storing call data:", error);
    }
  };

  const handleCallAccepted = async () => {
    startCallTimer();
    try {
      setCallAccepted(true);
      setIsCallPopupVisible(false);
      socket.emit("callAccepted", { channelName, callerId: incomingCall });

      // Start the local audio track
      const localAudioTrack: IMicrophoneAudioTrack =
        await rtcClient.createMicrophoneAudioTrack();
      localAudioTrackRef.current = localAudioTrack;
      await rtcClient.publish([localAudioTrack]);

      // Start the call duration timer
      // setCallDuration(0); // Reset the timer
      // callTimerRef.current = setInterval(() => {
      //   setCallDuration((prevDuration) => prevDuration + 1);
      // }, 1000);
    } catch (error) {
      console.error("Error accepting the call:", error);
    }
  };

  const rejectCall = () => {
    if (incomingCall) {
      console.log("Call rejected");
      socket.emit("callRejected", { channelName, callerId: incomingCall });
      setIncomingCall(null);
      setChannelName("");
      setToken("");
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.stop();
        localAudioTrackRef.current = null;
      }
    }
  };

  const handlePopoverOpen = async (event: MouseEvent<HTMLElement>) => {
    console.log("currenttarget", selectedUser?.GroupID);
    setAnchorEl(event.currentTarget);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/groupmembers/${selectedUser?.GroupID}`
      );
      setGroupMembers(response.data);
    } catch (error) {
      console.error("Error fetching group members:", error);
    }
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
    console.log("Selected User IDs:", selectedUserIDs);
    console.log("Logged-in User ID:", (selectedUser as User).UserID);

    const loggedInUserId = user?.userdata?.UserID || null;

    // Ensure the logged-in user is added to the group
    const userIDs = [...selectedUserIDs, loggedInUserId];

    const namesArray = query
      .split(",")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
    const groupname = [(selectedUser as User).Username, ...namesArray].join(
      ", "
    );

    try {
      const response = await axios.post(
        `http://localhost:3000/api/creategroup`,
        {
          GroupName: groupname,
          Username: [(selectedUser as User).Username, ...namesArray],
          CreatedBy: loggedInUserId,
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
      setselectActiveUser(null);
      onGroupCreate(newGroup); // Pass the new group information
      setQuery(""); // Clear the input

      handlePopoverClose(); // Close the popover after action
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
        ` http://localhost:3000/api/addUsers?`,
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

  const endCall = () => {
    console.log("Ending call");
    if (localAudioTrackRef.current) {
      localAudioTrackRef.current.stop();
      localAudioTrackRef.current = null;
    }
    rtcClient.leave(); // Leave the Agora channel
    setCallAccepted(false);
    setCallDuration(0);
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  console.log("username", user?.userdata?.Username);
  console.log("userid", user?.userdata?.UserID);
  console.log("selectedUser", selectedUser);
  console.log(caller);
  function generate(element: React.ReactElement) {
    return [0, 1, 2].map((value) =>
      React.cloneElement(element, {
        key: value,
      })
    );
  }

  const handleDelete = async (userId: number, groupId: number) => {
    try {
      // Make API call to delete user from the group
      await axios.delete(
        `http://localhost:3000/api/groups/${groupId}/members/${userId}`
      );

      // Update local state to remove the deleted user
      setGroupMembers((prevMembers) =>
        prevMembers.filter((member) => member.UserID !== userId)
      );
      setOpenModal(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      // Handle the error, e.g., show a notification
    }
  };

  const handleOpenModal = (
    actionType: "delete" | "leave",
    userId: number,
    groupId: number
  ) => {
    const isDeleteAction = actionType === "delete";
    setModalContent({
      title: isDeleteAction ? "Remove User" : "Leave Group",
      description: isDeleteAction
        ? "Are you sure you want to remove this user from the group?"
        : "Are you sure you want to leave this group?",
      actionText: isDeleteAction ? "Remove" : "Leave",
      onConfirm: () => handleDelete(userId, groupId),
    });
    setOpenModal(true);
  };
  const [secondary, setSecondary] = React.useState(false);

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
                      ? selectedUser.Username
                      : selectedUser.GroupName
                  }
                  src={selectedUser.ProfilePicture || undefined}
                  sx={{ mr: 2 }}
                />
                <Typography variant="h6" color="white">
                  {headerTitle}
                </Typography>
              </Box>

              <AgoraRTCProvider client={rtcClient}>
                <div>
                  <IconButton onClick={startCall}>
                    <CallIcon />
                  </IconButton>

                  {incomingCall && (
                    <CallPopup
                      incomingCall={incomingCall}
                      caller={callerdetail}
                      onAccept={handleCallAccepted}
                      onReject={rejectCall}
                    />
                  )}

                  {callAccepted && channelName && token && (
                    <div>
                      <AgoraClient channelName={channelName} token={token} />
                      <div>
                        <div>Call Duration: {formatTime(callDuration)}</div>
                        <IconButton
                          // onClick={endCall} // Your function to end the call
                          style={{
                            backgroundColor: "red",
                            color: "white",
                          }}
                        >
                          <CallEndIcon />
                        </IconButton>
                      </div>
                    </div>
                  )}
                </div>
              </AgoraRTCProvider>

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
              {selectedUser.UserID ? (
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
              ) : (
                <Box>
                  <Typography>People({groupMembers.length})</Typography>

                  <List style={{ width: "250px" }}>
                    {groupMembers.map((member) => (
                      <ListItem
                        key={member.UserID}
                        sx={{
                          "&:hover": {
                            backgroundColor: "#f0f0f0", // Change to your desired hover color
                            cursor: "pointer",
                          },
                        }}
                        onMouseEnter={() => setHoveredUserId(member.UserID)}
                        onMouseLeave={() => setHoveredUserId(null)}
                      >
                        <ListItemAvatar>
                          <Avatar>
                            <FolderIcon />
                          </Avatar>
                        </ListItemAvatar>
                        {/* <ListItemIcon>
                          <FolderIcon />
                        </ListItemIcon> */}
                        <ListItemText
                          primary={member.Username} // Ensure this matches the correct property name in your data
                          secondary={
                            member.UserID === user?.userdata?.UserID
                              ? "You"
                              : null
                          }
                        />{" "}
                        {hoveredUserId === member.UserID &&
                          member.UserID !== user?.userdata?.UserID && (
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() =>
                                handleOpenModal(
                                  "delete",
                                  member.UserID,
                                  member.GroupID
                                )
                              }
                              // onClick={() =>
                              //   handleDelete(member.UserID, member.GroupID)
                              // } // Add your delete logic here
                              size="small"
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          )}
                      </ListItem>
                    ))}
                    <hr></hr>
                    <ListItem
                      sx={{
                        "&:hover": {
                          backgroundColor: "#f0f0f0", // Change to your desired hover color
                          cursor: "pointer",
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <GroupAddIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Add People" // Ensure this matches the correct property name in your data
                        secondary={secondary ? "Secondary text" : null}
                      />
                    </ListItem>

                    <ListItem
                      sx={{
                        "&:hover": {
                          backgroundColor: "#f0f0f0", // Change to your desired hover color
                          cursor: "pointer",
                        },
                      }}
                      onClick={() =>
                        handleOpenModal(
                          "leave",
                          user?.userdata?.UserID,
                          selectedUser.GroupID
                        )
                      }

                      // onClick={() =>
                      //   handleDelete(
                      //     user?.userdata?.UserID,
                      //     selectedUser.GroupID
                      //   )
                      // }
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <PersonAddAltIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Leave" // Ensure this matches the correct property name in your data
                        secondary={secondary ? "Secondary text" : null}
                      />
                    </ListItem>
                  </List>

                  {/* Reusable Modal */}
                  <ActionModal
                    open={openModal}
                    handleClose={() => setOpenModal(false)}
                    title={modalContent.title}
                    description={modalContent.description}
                    actionText={modalContent.actionText}
                    onConfirm={modalContent.onConfirm}
                  />

                  {/* </Demo> */}
                </Box>
              )}
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
