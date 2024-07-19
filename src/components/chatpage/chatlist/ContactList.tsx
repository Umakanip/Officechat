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

interface Contact {
  id: number;
  name: string;
  image: string;
}

interface ContactListProps {
  onSelectUser: (user: Contact) => void;
}

const ContactList: React.FC<ContactListProps> = ({ onSelectUser }) => {
  console.log(onSelectUser);
  const [Contact, setContact] = useState<any[]>([]);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/users")
      .then((response) => {
        setContact(response.data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);
  return (
    <Box
      sx={{
        width: "400px",
        bgcolor: "#ebebeb",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
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
        Chat List
      </Typography>
      <List sx={{ flexGrow: 1, overflow: "auto" }}>
        {" "}
        {/* Allow list to scroll */}
        {Contact.map((item) => (
          <ListItem button key={item.UserID} onClick={() => onSelectUser(item)}>
            <ListItemAvatar>
              <Avatar alt={item.Username} src={item.ProfilePicture} />
            </ListItemAvatar>
            <ListItemText primary={item.Username} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ContactList;
