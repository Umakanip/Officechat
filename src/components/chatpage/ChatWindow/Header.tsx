// import axios from "axios";
// import React, { MouseEvent, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Box,
//   IconButton,
//   Popover,
//   Typography,
//   Avatar,
//   Button,
//   TextField,
// } from "@mui/material";
// import { User } from "./messagetypes";
// import GroupIcon from "@mui/icons-material/Group";
// import VideocamIcon from "@mui/icons-material/Videocam";
// import { useUser } from "../../context/UserContext.tsx";
// import io from "socket.io-client";
// import AgoraRTC, { IAgoraRTCClient } from "agora-rtc-sdk-ng";
// import { AgoraRTCProvider } from "agora-rtc-react";
// import CallIcon from "@mui/icons-material/Call";
// import CallPopup from "../../VoiceCall/CallPopup.tsx";
// import AgoraClient from "../../VoiceCall/AgoraClient.tsx";

// interface HeaderProps {
//   selectedUser: User;
//   onGroupCreate: (group: any) => void;
//   headerTitle?: string;
// }

// const socket = io("http://localhost:5000");
// const rtcClient: IAgoraRTCClient = AgoraRTC.createClient({
//   mode: "rtc",
//   codec: "vp8",
// });

// const Header: React.FC<HeaderProps> = ({
//   headerTitle,
//   selectedUser,
//   onGroupCreate,
// }) => {
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [query, setQuery] = useState<string>("");
//   const [suggestions, setSuggestions] = useState<User[]>([]);
//   const [selectedUserIDs, setSelectedUserIDs] = useState<string[]>([]); // Change type to string[]
//   const [groupDetails, setGroupDetails] = useState<any>();
//   const { groups, setGroups, setActiveGroup, setActiveUser, user } = useUser();
//   const [channelName, setChannelName] = useState<string>("");
//   const [token, setToken] = useState<string>("");
//   const [incomingCall, setIncomingCall] = useState<string | null>(null);

//   useEffect(() => {
//     socket.emit("register", user?.userdata?.UserID);

//     socket.on(
//       "incomingCall",
//       (data: { channelName: string; token: string; callerId: string }) => {
//         setChannelName(data.channelName);
//         setToken(data.token);
//         setIncomingCall(data.callerId);
//       }
//     );

//     socket.on("callAccepted", ({ channelName, callerId }) => {
//       setChannelName(channelName);
//       setToken(token);
//     });

//     socket.on("callRejected", ({ callerId }) => {
//       setIncomingCall(null);
//       setChannelName("");
//       setToken("");
//     });

//     return () => {
//       socket.off("incomingCall");
//       socket.off("callAccepted");
//       socket.off("callRejected");
//     };
//   }, [token]);

//   const startCall = () => {
//     const generatedChannelName = "testChannel";
//     const callerId = user?.userdata?.UserID;
//     const receiverIds = [selectedUser.UserID]; // Ensure receiverIds is an array

//     socket.emit("callUsers", {
//       channelName: generatedChannelName,
//       callerId,
//       receiverIds,
//     });
//   };

//   const acceptCall = () => {
//     if (incomingCall) {
//       socket.emit("callAccepted", { channelName, callerId: incomingCall });
//       setIncomingCall(null);
//     }
//   };

//   const rejectCall = () => {
//     if (incomingCall) {
//       socket.emit("callRejected", { channelName, callerId: incomingCall });
//       setIncomingCall(null);
//     }
//   };

//   const handlePopoverOpen = (event: MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const navigate = useNavigate();

//   const handleVideoClick = () => {
//     navigate("/video-call");
//   };

//   const handlePopoverClose = () => {
//     setAnchorEl(null);
//   };

//   const fetchSuggestions = async (searchQuery: string) => {
//     try {
//       const response = await axios.get(
//         "http://localhost:3000/api/usernamesugggestions",
//         {
//           params: { query: searchQuery },
//         }
//       );
//       setSuggestions(response.data);
//     } catch (error) {
//       console.error("Error fetching suggestions:", error);
//     }
//   };

//   const handleEmailChange = async (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const value = event.target.value;
//     setQuery(value);
//     if (value) {
//       fetchSuggestions(value);
//     } else {
//       setSuggestions([]);
//     }
//   };

//   const handleCreateGroup = async () => {
//     const namesArray = query
//       .split(",")
//       .map((name) => name.trim())
//       .filter((name) => name.length > 0);
//     const groupname = [(selectedUser as User).Username, ...namesArray].join(
//       ", "
//     );

//     try {
//       const response = await axios.post(
//         `http://localhost:3000/api/creategroup`,
//         {
//           GroupName: groupname,
//           Username: [(selectedUser as User).Username, ...namesArray],
//           CreatedBy: (selectedUser as User).UserID || null,
//           CreatedAt: new Date(),
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           }
//         }
//       );

//       const newGroup = response.data;
//       setGroups((prevGroups) => [newGroup, ...prevGroups]);
//       setActiveGroup(response.data.GroupID);
//       setActiveUser(null);
//       onGroupCreate(newGroup);
//       setQuery("");
//       handlePopoverClose();
//     } catch (error: any) {
//       console.error("Error sending data:", error);
//     }
//   };

//   const { UserID, Username, GroupName, ProfilePicture, GroupID } =
//     selectedUser;
//   const namesArray = query
//     .split(",")
//     .map((name) => name.trim())
//     .filter((name) => name.length > 0);

//   const handleAddUser = async () => {
//     try {
//       const response = await axios.post(
//         `http://localhost:3000/api/addUsers`,
//         {
//           GroupID: GroupID,
//           Usernames: namesArray || null,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           }
//         }
//       );

//       const updatedGroup = response.data.group;
//       setGroupDetails(updatedGroup);
//       setActiveGroup(updatedGroup.GroupID);
//       setActiveUser(null);
//     } catch (error: any) {
//       console.error("Error sending data:", error);
//     }
//   };

//   const handleSelectUser = (username: string) => {
//     setSelectedUserIDs((prevIDs) => [...prevIDs, username]); // Add selected user ID to array
//     setSuggestions([]);
//   };

//   const open = Boolean(anchorEl);
//   const id = open ? "simple-popover" : undefined;

//   return (
//     <>
//       <Box sx={{ flexGrow: 1 }}>
//         {selectedUser ? (
//           <Box>
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 bgcolor: "#064D51",
//                 p: 3,
//                 mt: -8,
//               }}
//             >
//               <Box sx={{ display: "flex", alignItems: "center" }}>
//                 <Avatar
//                   alt={UserID ? Username || "User" : GroupName || "Group"}
//                   src={ProfilePicture || undefined}
//                   sx={{ mr: 2 }}
//                 />
//                 <Typography variant="h6" color="white">
//                   {UserID ? Username || "User" : GroupName || "Group"}
//                 </Typography>
//               </Box>
//               <IconButton
//                 onClick={() => {
//                   startCall();
//                 }}
//                 sx={{ marginLeft: "0px", color: "#1976d2" }}
//               >
//                 <CallIcon />
//               </IconButton>
//               <AgoraRTCProvider client={rtcClient}>
//   {incomingCall && selectedUser?.UserID ? (
//     <CallPopup
//       incomingCall={incomingCall}
//       caller={selectedUser}
//       onAccept={acceptCall}
//       onReject={rejectCall}
//     />
//   ) : (
//     <div></div>
//   )}
//   {token && (
//     <AgoraClient
//       channelName={channelName}
//       token={token}
//       isCallAccepted={isCallAccepted} // Pass the required prop here
//     />
//   )}
// </AgoraRTCProvider>


//               <IconButton
//                 sx={{ marginLeft: "auto", color: "#1976d2" }}
//                 onClick={handleVideoClick}
//               >
//                 <VideocamIcon sx={{ fontSize: 30 }} />
//               </IconButton>
//               <IconButton sx={{ color: "black" }} onClick={handlePopoverOpen}>
//                 <GroupIcon />
//               </IconButton>
//             </Box>

//             <Popover
//               id={id}
//               open={open}
//               anchorEl={anchorEl}
//               onClose={handlePopoverClose}
//               anchorOrigin={{
//                 vertical: "bottom",
//                 horizontal: "right",
//               }}
//               transformOrigin={{
//                 vertical: "top",
//                 horizontal: "right",
//               }}
//               sx={{ p: 2 }}
//             >
//               <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//                 <TextField
//                   label="Email ID"
//                   type="email"
//                   value={query}
//                   onChange={handleEmailChange}
//                   variant="outlined"
//                 />
//                 {suggestions.length > 0 && (
//                   <Box>
//                     {suggestions.map((user: User) => (
//                       <Typography
//                         key={user.UserID}
//                         onClick={() => handleSelectUser(user.Username)}
//                         sx={{ cursor: "pointer" }}
//                       >
//                         {user.Username}
//                       </Typography>
//                     ))}
//                   </Box>
//                 )}
//                 <Button
//                   variant="contained"
//                   sx={{ mt: 2 }}
//                   onClick={handleCreateGroup}
//                 >
//                   Create Group
//                 </Button>
//               </Box>
//             </Popover>
//           </Box>
//         ) : (
//           <Box sx={{ p: 3, mt: -8 }}>
//             <Typography variant="h6" sx={{ color: "black" }}>
//               {headerTitle || "Default Title"}
//             </Typography>
//           </Box>
//         )}
//       </Box>
//     </>
//   );
// };

// export default Header;


import axios from "axios";
import React, { MouseEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import AgoraRTC, { IAgoraRTCClient,IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import AgoraClient from "../../VoiceCall/AgoraClient.tsx";
import { AgoraRTCProvider } from 'agora-rtc-react';
import CallIcon from '@mui/icons-material/Call';
import CallPopup from "../../VoiceCall/CallPopup.tsx";

interface HeaderProps {
  selectedUser: User;
  onGroupCreate;
  headerTitle: string | undefined;
}
const socket = io('http://localhost:5000');
const rtcClient: any = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

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


  const [searchParams] = useSearchParams();
  const type = searchParams.get("id");
  const [channelName, setChannelName] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [callerId, setCallerId] = useState<string | null>(type);
  const [incomingCall, setIncomingCall] = useState<string | null>(null);
  const [callAccepted, setCallAccepted] = useState<boolean>(false);
  const localAudioTrackRef = useRef<IMicrophoneAudioTrack | null>(null);

  useEffect(() => {
    if (type) {
      // const userId = type; // Replace with actual user ID
      socket.emit('register', user?.userdata?.UserID);

      socket.on('incomingCall', (data: { channelName: string; token: string; callerId: string }) => {
        console.log('---incomingCall--client---', data);
        setChannelName(data.channelName);
        setToken(data.token);
        setIncomingCall(data.callerId);
      });

      socket.on('connect', () => {
        console.log('Connected to server');
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      return () => {
        socket.off('incomingCall');
        socket.off('connect');
        socket.off('disconnect');
      };
    }
  }, [type]);
  //   console.log("user", user)
  //   // const userId: string = type || '';
  //   socket.emit('register', user?.userdata?.UserID);

  //   socket.on('incomingCall', (data: { channelName: string, token: string, callerId: string }) => {
  //     setChannelName(data.channelName);
  //     setToken(data.token);
  //     setIncomingCall(data.callerId);
  //     console.log("test", data)
  //   });

  //   socket.on('callAccepted', ({ channelName, callerId }) => {
  //     console.log(`Call accepted by ${callerId}`);
  //     setChannelName(channelName);
  //     setToken(token);
  //   });

  //   socket.on('callRejected', ({ callerId }) => {
  //     console.log(`Call rejected by ${callerId}`);
  //     setIncomingCall(null);
  //     setChannelName('');
  //     setToken('');
  //   });


  //   socket.on('connect', () => {
  //     console.log('Connected to server');
  //   });

  //   socket.on('disconnect', () => {
  //     console.log('Disconnected from server');
  //   });

  //   // Cleanup on component unmount
  //   return () => {
  //     socket.off('incomingCall');
  //     socket.off('connect');
  //     socket.off('disconnect');
  //     socket.off('callAccepted');
  //     socket.off('callRejected');
  //   };
  // }, []);


  // const startCall = () => {
  //   console.log("start call initialise")
  //   // if (!selectedUser) return; // Handle case where selectedUser might be nul

  //   const generatedChannelName = 'testChannel';
  //   const callerId = user?.userdata?.UserID;
  //   const receiverIds: any = selectedUser?.UserID;
  //   alert(callerId)
  //   console.log("user", user)
  //   console.log("start call end", receiverIds)

  //   console.log('Starting call with:', {
  //     channelName: generatedChannelName,
  //     callerId: user?.userdata?.UserID,
  //     receiverIds,
  //   });

  //   socket.emit('callUsers', { channelName: generatedChannelName, callerId, receiverIds: [receiverIds] });
  // };

  // const acceptCall = () => {
  //   if (incomingCall) {
  //     console.log('Call accepted');
  //     socket.emit('callAccepted', { channelName, callerId: incomingCall });
  //     // Initiate Agora client connection here
  //     setIncomingCall(null);
  //   }
  // };

  // const rejectCall = () => {
  //   if (incomingCall) {
  //     console.log('Call rejected');
  //     socket.emit('callRejected', { channelName, callerId: incomingCall });
  //     setIncomingCall(null);
  //     // Optionally, add logic to notify the caller that the call was rejected
  //   }
  // };

   const startCall = () => {
    const generatedChannelName = 'testChannel';
    const callerId = user?.userdata?.UserID;
    const receiverIds = selectedUser?.UserID;
  // / const receiverIds: any = selectedUser?.UserID;
     // Replace with actual receiver IDs

    socket.emit('callUsers', { channelName: generatedChannelName, callerId, receiverIds });
  };

  const handleCallAccepted = async () => {
    try {
      setCallAccepted(true);
      socket.emit('callAccepted', { channelName, callerId });

      // Start the local audio track
      const localAudioTrack: IMicrophoneAudioTrack = await rtcClient.createMicrophoneAudioTrack();
      localAudioTrackRef.current = localAudioTrack;
      await rtcClient.publish([localAudioTrack]);
    } catch (error) {
      console.error('Error accepting the call:', error);
    }
  };

  const rejectCall = async () => {
    try {
      socket.emit('callRejected', { channelName, callerId });
      setIncomingCall(null);
      setCallAccepted(false);

      // Stop and close the local audio track if it exists
      if (localAudioTrackRef.current) {
        console.log('Stopping and closing the local audio track');
        await localAudioTrackRef.current.stop();
        localAudioTrackRef.current.close();
        localAudioTrackRef.current = null; // Reset the ref
      }

      // Leave the RTC channel if joined
      if (rtcClient) {
        console.log('Leaving the RTC channel');
        await rtcClient.leave();
      }

      console.log('Call rejected successfully');
    } catch (error) {
      console.error('Error during call rejection:', error);
    }
  };

  console.log("incoming call", incomingCall)


  useEffect(() => {
    console.log("headerTitle", selectedUser);
  });
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
        "http://localhost:3000/api/usernamesugggestions?",
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
    setQuery(value); // Update the query state
    if (value) {
      fetchSuggestions(value); // Fetch suggestions if there's input
    } else {
      setSuggestions([]); // Clear suggestions if input is empty
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
    // let userIDs = [1, 4, 5];
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
    console.log("user id check", username);
    setSelectedUserIDs(username); // Add selected UserID to the array
    // setQuery(""); // Clear the input field
    setSuggestions([]); // Clear the suggestions
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  console.log("(selectedUser as User).UserID", selectedUser);
  console.log(selectedUser ? groupDetails : "");
  // const { groupname } = groupDetails;
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
                bgcolor: "#064D51",
                p: 3,
                mt: -8,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  alt={UserID ? Username || "User" : GroupName || "Group"}
                  src={ProfilePicture || undefined}
                  sx={{ mr: 2 }}
                />
                <Typography variant="h6" color="white">
                  {UserID ? Username || "User" : GroupName || "Group"}
                </Typography>
              </Box>
              {/* <GroupIcon
              style={{ cursor: "pointer" }}
              sx={{ color: "black" }}
              onClick={handleDialogOpen} // Open dialog on click
            /> */}
   <AgoraRTCProvider client={rtcClient}>
      <div>
        {/* <h1>Agora One-to-Many Call</h1> */}
        <IconButton onClick={() => { startCall() }} >
                <CallIcon />
              </IconButton>
        {/* <button onClick={startCall}>Start Call</button> */}
        {incomingCall && (
          <div>
            <p>Incoming call from {incomingCall}</p>
            <button onClick={handleCallAccepted}>Accept Call</button>
            <button onClick={rejectCall}>Reject</button>
          </div>
        )}
        {callAccepted && channelName && token && (
          <AgoraClient channelName={channelName} token={token}  />
        )}
      </div>
    </AgoraRTCProvider>
              {/* <IconButton onClick={() => { startCall() }} sx={{ marginLeft: "0px", color: "#1976d2" }}>
                <CallIcon />
              </IconButton>
              <AgoraRTCProvider client={rtcClient}> */}

                {/* {incomingCall  && selectedUser?.UserID == receiverId? ( */}
                {/* {incomingCall && selectedUser?.UserID ? (
                  <CallPopup
                    incomingCall={incomingCall}
                    caller={selectedUser}
                    onAccept={acceptCall}
                    onReject={rejectCall}
                  />
                
                ) :(
                  <div></div>
                )
                } */}
                {/* {token && <AgoraClient channelName={channelName} token={token} />}
              </AgoraRTCProvider> */}

              <IconButton
                sx={{ marginLeft: "auto", color: "#1976d2" }} // Ensure the icon is visible on dark background
                onClick={handleVideoClick}>
                <VideocamIcon sx={{ fontSize: 30 }} /> {/* Adjust the font size as needed */}
              </IconButton>
              <IconButton
                sx={{ color: "black" }} // Ensure the icon is visible on dark background
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
                />
                {suggestions.length > 0 && (
                  <ul>
                    {suggestions.map((suggestion: any) => (
                      <li
                        onClick={() => handleSelectUser(suggestion)} // Handle user selection
                      >
                        {suggestion} {/* Display UserName */}
                      </li>
                    ))}
                  </ul>
                )}
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
                >
                  <Button onClick={handlePopoverClose} variant="outlined">
                    Cancel
                  </Button>
                  {GroupID ? (
                    <Button
                      onClick={handleAddUser}
                      variant="contained"
                      color="primary"
                    >
                      Add User
                    </Button>
                  ) : (
                    <Button
                      onClick={handleCreateGroup}
                      variant="contained"
                      color="primary"
                    >
                      Create
                    </Button>
                  )}
                </Box>
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
