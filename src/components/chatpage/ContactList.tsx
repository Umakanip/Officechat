import React from 'react';
import { List, ListItem, ListItemAvatar, ListItemText, Typography, Avatar, Box } from '@mui/material';

interface Contact {
  id: number;
  name: string;
  image: string;
}

interface ContactListProps {
  onSelectUser: (user: Contact) => void;
}

const contacts: Contact[] = [
  { id: 1, name: 'Alice', image: '/Assets/A.jpg' },
  { id: 2, name: 'Bob', image: '/Assets/B.jpg' },
  { id: 3, name: 'Charlie', image: '/Assets/C.jpg' },
  { id: 4, name: 'David', image: '/Assets/D.jpg' },
  { id: 5, name: 'Eve', image: '/Assets/E.jpg' },
  { id: 6, name: 'Frank', image: '/Assets/F.jpg' },
  { id: 7, name: 'Grace', image: '/Assets/G.jpg' },
  { id: 8, name: 'Harry', image: '/Assets/H.jpg' },
  { id: 9, name: 'Idk', image: '/Assets/I.jpg' },
];

const ContactList: React.FC<ContactListProps> = ({ onSelectUser }) => {
  return (
    <Box sx={{ width: '400px', bgcolor: '#ebebeb', height: '100vh', display: 'flex', flexDirection: 'column' }}> {/* Ensure full height */}
      <Typography variant="h6" sx={{ p: 2, bgcolor: 'teal', color: 'white', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen','Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif" }}>
        Chat List
      </Typography>
      <List sx={{ flexGrow: 1, overflow: 'auto' }}> {/* Allow list to scroll */}
        {contacts.map((contact) => (
          <ListItem button key={contact.id} onClick={() => onSelectUser(contact)}>
            <ListItemAvatar>
              <Avatar alt={contact.name} src={contact.image} />
            </ListItemAvatar>
            <ListItemText primary={contact.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ContactList;
