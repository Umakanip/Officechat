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
  return (
    <Dialog open={!!incomingCall} onClose={onReject}>
      <DialogTitle>Incoming Call</DialogTitle>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <Avatar src={caller?.ProfilePicture} alt={caller?.Username} />
        <Typography variant="h6">{caller?.Username || "Unknown"}</Typography>
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
