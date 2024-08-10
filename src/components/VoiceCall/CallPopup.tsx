
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
