
import React from 'react';
import { Dialog, DialogTitle, DialogActions, Button, Avatar } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';

interface CallPopupProps {
  incomingCall: string;
  caller: any; 
  onAccept: () => void;
  onReject: () => void;
}

const CallPopup: React.FC<CallPopupProps> = ({ incomingCall, caller, onAccept, onReject }) => {
    
  return (
    <Dialog open={!!incomingCall} onClose={onReject}>
      <DialogTitle>Incoming Call</DialogTitle>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Avatar src={caller?.ProfilePicture} alt={caller?.Username} />
        <p>{caller?.Username}</p>
        <p>is calling you</p>
      </div>
      <DialogActions>
        <Button onClick={onReject} color="error">
          <CallIcon/> Reject
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
// import { Box, Typography, Button, Avatar } from "@mui/material";
// import CallIcon from "@mui/icons-material/Call";
// import CloseIcon from "@mui/icons-material/Close";
// import { User } from "../chatpage/ChatWindow/messagetypes";

// interface CallPopupProps {
//   incomingCall: string | null;
//   caller: User;
//   onAccept: () => void;
//   onReject: () => void;
// }

// const CallPopup: React.FC<CallPopupProps> = ({
//   incomingCall,
//   caller,
//   onAccept,
//   onReject,
// }) => {
//   return (
//     <Box
//       sx={{
//         position: "fixed",
//         bottom: 16,
//         right: 16,
//         p: 2,
//         bgcolor: "white",
//         borderRadius: 2,
//         boxShadow: 3,
//         zIndex: 1300,
//         display: "flex",
//         alignItems: "center",
//         gap: 2,
//       }}
//     >
//       <Avatar src={caller.ProfilePicture} alt={caller.Username} />
//       <Typography variant="subtitle1">{caller.Username} is calling...</Typography>
//       <Button
//         startIcon={<CallIcon />}
//         onClick={onAccept}
//         sx={{ bgcolor: "green", color: "white" }}
//       >
//         Accept
//       </Button>
//       <Button
//         startIcon={<CloseIcon />}
//         onClick={onReject}
//         sx={{ bgcolor: "red", color: "white" }}
//       >
//         Reject
//       </Button>
//     </Box>
//   );
// };

// export default CallPopup;

