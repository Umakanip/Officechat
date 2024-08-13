// import React from "react";
// import {
//   Dialog,
//   DialogActions,
//   DialogTitle,
//   Button,
//   Typography,
//   Avatar,
// } from "@mui/material";
// import CallIcon from "@mui/icons-material/Call";
// import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";
// import { User } from "../chatpage/ChatWindow/messagetypes";

// interface CallPopupProps {
//   incomingCall: string | null;
//   caller: User | null;
//   onAccept: () => void;
//   onReject: () => void;
// }

// const CallPopup: React.FC<CallPopupProps> = ({
//   incomingCall,
//   caller,
//   onAccept,
//   onReject,
// }) => {
//   console.log("caller",caller)
//   const callerDisplay = typeof caller === 'string' 
//     ? caller  
//     : 'Unknown';
//   return (
//     <Dialog open={!!incomingCall} onClose={onReject}>
//       <DialogTitle>Incoming Call</DialogTitle>
//       <div style={{ textAlign: "center", padding: "20px" }}>
//         <Avatar src={caller?.ProfilePicture} alt={caller?.Username} />
//         <Typography variant="h6">{callerDisplay}</Typography>
//         <Typography variant="body1">is calling you</Typography>
//       </div>
//       <DialogActions>
//         <Button onClick={onReject} color="error">
//           <PhoneDisabledIcon /> Reject
//         </Button>
//         <Button onClick={onAccept} color="primary">
//           <CallIcon /> Accept
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default CallPopup;

// import React from "react";
// import {
//   Dialog,
//   DialogActions,
//   DialogTitle,
//   Button,
//   Typography,
//   Avatar,
// } from "@mui/material";
// import CallIcon from "@mui/icons-material/Call";
// import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";
// import { User } from "../chatpage/ChatWindow/messagetypes";
// import { useUser } from "../context/UserContext.tsx";


// interface CallPopupProps {
//   incomingCall: string | null;
//   caller: User | null;
//   onAccept: () => void;
//   onReject: () => void;
// }

// const CallPopup: React.FC<CallPopupProps> = ({
//   incomingCall,
//   caller,
//   onAccept,
//   onReject,
// }) => {
//   const { user } = useUser();
//   console.log("Caller:", caller);

//   // const callerDisplay = user?.userdata?.Username || "Unknown";
//   const callerDisplay = caller?.Username || "Unknown";

//   console.log("caller1", user?.userdata?.Username)

//   return (
//     <Dialog open={!!incomingCall} onClose={onReject}>
//       <DialogTitle>Incoming Call</DialogTitle>
//       <div style={{ textAlign: "center", padding: "20px" }}>
//         <Avatar src={caller?.ProfilePicture} alt={callerDisplay} />
//         <Typography variant="h6">{callerDisplay}</Typography>
//         <Typography variant="body1">is calling you</Typography>
//       </div>
//       <DialogActions>
//         <Button onClick={onReject} color="error">
//           <PhoneDisabledIcon /> Reject
//         </Button>
//         <Button onClick={onAccept} color="primary">
//           <CallIcon /> Accept
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default CallPopup;
import React from "react";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
  Typography,
  Avatar,
} from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";
import { User } from "../chatpage/ChatWindow/messagetypes";
import { useUser } from "../context/UserContext.tsx";

interface CallPopupProps {
  incomingCall: string | null;
  caller: User | null;
  onAccept: () => void;
  onReject: () => void;
}

const CallPopup: React.FC<CallPopupProps> = ({
  incomingCall,
  caller,
  onAccept,
  onReject,
}) => {
  console.log("caller",caller)
  const callerDisplay = caller?.Username || "Unknown";

  return (
    <Dialog open={!!incomingCall} onClose={onReject}>
      <DialogTitle>Incoming Call</DialogTitle>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Avatar src={caller?.ProfilePicture} alt={callerDisplay} />
        <Typography variant="h6">{callerDisplay}</Typography>
        <Typography variant="body1">is calling you</Typography>
      </div>
      <DialogActions>
        <Button onClick={onReject} color="error">
          <PhoneDisabledIcon /> Reject
        </Button>
        <Button onClick={onAccept} color="primary">
          <CallIcon /> Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CallPopup;


// import React from "react";
// import {
//   Dialog,
//   DialogActions,
//   DialogTitle,
//   Button,
//   Typography,
//   Avatar,
// } from "@mui/material";
// import CallIcon from "@mui/icons-material/Call";
// import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";
// import { User } from "../chatpage/ChatWindow/messagetypes";

// interface CallPopupProps {
//   incomingCall: string | null;
//   caller: User | null | string;  // caller can be a User object or a string
//   onAccept: () => void;
//   onReject: () => void;
//   user?: { userdata?: { Username: string } }; // Include user data as a prop
// }

// const CallPopup: React.FC<CallPopupProps> = ({
//   incomingCall,
//   caller,
//   onAccept,
//   onReject,
//   user, // Access logged-in user data
// }) => {
//   console.log("caller", caller);

//   // Determine the display name for the caller
//   const callerDisplay = typeof caller === 'string'
//     ? user?.userdata?.Username
//     : caller?.Username || 'Unknown';

//   return (
//     <Dialog open={!!incomingCall} onClose={onReject}>
//       <DialogTitle>Incoming Call</DialogTitle>
//       <div style={{ textAlign: "center", padding: "20px" }}>
//         <Avatar src={typeof caller !== 'string' ? caller?.ProfilePicture : undefined} alt={callerDisplay} />
//         <Typography variant="h6">{callerDisplay}</Typography>
//         <Typography variant="body1">is calling you</Typography>
//       </div>
//       <DialogActions>
//         <Button onClick={onReject} color="error">
//           <PhoneDisabledIcon /> Reject
//         </Button>
//         <Button onClick={onAccept} color="primary">
//           <CallIcon /> Accept
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default CallPopup;