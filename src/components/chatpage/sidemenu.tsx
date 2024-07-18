// import React, { useState } from 'react';
// import { Drawer, List, ListItem, ListItemText, Box, AppBar, Toolbar, Typography, CssBaseline, Divider } from '@mui/material';

// const HomeContent = () => <div>Home Content</div>;
// const AboutContent = () => <div>About Content</div>;
// const ContactContent = () => <div>Contact Content</div>;
// const menuItems = [
//   { text: 'Home', component: <HomeContent /> },
//   { text: 'About', component: <AboutContent /> },
//   { text: 'Contact', component: <ContactContent /> },
// ];

// const drawerWidth = 240;



// const App: React.FC = () => {
//   const [selectedContent, setSelectedContent] = useState<React.ReactNode>(<HomeContent />);

//   const handleMenuItemClick = (component: React.ReactNode) => {
//     setSelectedContent(component);
//   };

//   return (
//     <Box sx={{ display: 'flex' }}>
//       <CssBaseline />
//       <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
//         <Toolbar>
//           <Typography variant="h6" noWrap>
//             My Application
//           </Typography>
//         </Toolbar>
//       </AppBar>
//       <Drawer
//         variant="permanent"
//         sx={{
//           width: drawerWidth,
//           flexShrink: 0,
//           [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
//         }}
//       >
//         <Toolbar />
//         <Box sx={{ overflow: 'auto' }}>
//           <List>
//             {menuItems.map((item, index) => (
//               <ListItem button key={index} onClick={() => handleMenuItemClick(item.component)}>
//                 <ListItemText primary={item.text} />
//               </ListItem>
//             ))}
//           </List>
//           <Divider />
//         </Box>
//       </Drawer>
//       <Box
//         component="main"
//         sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, marginLeft: `${drawerWidth}px` }}
//       >
//         <Toolbar />
//         {selectedContent}
//       </Box>
//     </Box>
//   );
// };

// export default App;

import React, { useState } from 'react';
import { FaBell, FaUsers, FaComments } from "react-icons/fa";
import { Drawer, List, ListItem, ListItemText, Box, AppBar, Toolbar, Typography, CssBaseline, Divider, Icon, Avatar } from '@mui/material';
import Chatmessage from './chatmessage.tsx';
import ContactList from './ContactList.tsx';

interface Item {
  id: number;
  name: string;
  details: string | React.ReactElement;
  image?: string;
}

const ActivityContent = ({ selectedItem, onSelect }: { selectedItem: Item | null, onSelect: (item: Item) => void }) => {
  const allMsg = [" "]; // Your messages data
  const user = { name: 'John Doe' }; // Your user data
  const handleDelete = (id: number) => { /* Your delete logic */ };
  const customers: Item[] = [
    { id: 1, name: 'Customer 1', details: <Chatmessage allMsg={allMsg} user={user} handleDelete={handleDelete}/> },
    { id: 2, name: 'Customer 2', details: 'Details about Customer 2' },
    { id: 3, name: 'Customer 3', details: 'Details about Customer 3' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h5">Active Users</Typography>
        <List>
          {customers.map((customer) => (
            <ListItem button key={customer.id} onClick={() => onSelect(customer)}>
              <ListItemText primary={customer.name} />
            </ListItem>
          ))}
        </List>
      </Box>
      {selectedItem && (
        <Box sx={{ flex: 2, ml: 3 }}>
          <Typography variant="h6">{selectedItem.name}</Typography>
          <Typography>{selectedItem.details}</Typography>
        </Box>
      )}
    </Box>
  );
};

const ChatContent = ({ selectedUser }: { selectedUser: Item | null }) => (
  <Box sx={{ flexGrow: 1 }}>
    {selectedUser ? (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#064D51', p: 3, mt: -8 }}>
          <Avatar alt={selectedUser.name} src={selectedUser.image} sx={{ mr: 2 }} />
          <Typography variant="h6" color="white">{selectedUser.name}</Typography>
        </Box>
        <Box sx={{ p: 2, mt: 20 }}>
          {/* Your chat component or messages can go here */}
          <Typography variant="body1">Send a message to start chat with {selectedUser.name}</Typography>
        </Box>
      </Box>
    ) : (
      <Typography variant="h5" sx={{ p: 2, mt: 20 }}>Select a user to start chatting</Typography>
    )}
  </Box>
);

const TeamsContent = ({ selectedItem, onSelect }: { selectedItem: Item | null, onSelect: (item: Item) => void }) => {
  const contacts: Item[] = [
    { id: 1, name: 'Contact 1', details: 'Details about Contact 1' },
    { id: 2, name: 'Contact 2', details: 'Details about Contact 2' },
    { id: 3, name: 'Contact 3', details: 'Details about Contact 3' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h5">Teams</Typography>
        <List>
          {contacts.map((contact) => (
            <ListItem button key={contact.id} onClick={() => onSelect(contact)}>
              <ListItemText primary={contact.name} />
            </ListItem>
          ))}
        </List>
      </Box>
      {selectedItem && (
        <Box sx={{ flex: 2, ml: 3 }}>
          <Typography variant="h6">{selectedItem.name}</Typography>
          <Typography>{selectedItem.details}</Typography>
        </Box>
      )}
    </Box>
  );
};

const menuItems = [
  { text: 'Activity', component: 'activity', icon: <FaBell /> },
  { text: 'Chat', component: 'chat', icon: <FaComments /> },
  { text: 'Teams', component: 'teams', icon: <FaUsers /> },
];

const drawerWidth = 80;

const App: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<string>('activity');
  const [selectedUser, setSelectedUser] = useState<Item | null>(null);

  const handleSelectItem = (item: Item) => {
    setSelectedItem(item);
  };

  const handleSelectUser = (user: Item) => {
    setSelectedUser(user);
  };

  const handleMenuItemClick = (component: string) => {
    setSelectedItem(null);
    setSelectedComponent(component);
  };

  const renderContent = () => {
    switch (selectedComponent) {
      case 'activity':
        return <ActivityContent selectedItem={selectedItem} onSelect={handleSelectItem} />;
      case 'chat':
        return <ChatContent selectedUser={selectedUser} />;
      case 'teams':
        return <TeamsContent selectedItem={selectedItem} onSelect={handleSelectItem} />;
      default:
        return <ActivityContent selectedItem={selectedItem} onSelect={handleSelectItem} />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: "100%", ml: { sm: `${drawerWidth}px` }, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            My Application
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', bgcolor: '#c0c0c0' }}>
          <List>
            {menuItems.map((item, index) => (
              <ListItem
                button
                key={index}
                onClick={() => handleMenuItemClick(item.component)}
                sx={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
              >
                <Icon sx={{ fontSize: '24px', mb: 1 }}>{item.icon}</Icon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '12px' }} />
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
      <Box sx={{ display: 'flex', flexGrow: 1}}>
        {selectedComponent === 'chat' && <ContactList onSelectUser={handleSelectUser} />} {/* Pass onSelectUser to ContactList */}
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 0, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
          <Toolbar />
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
};

export default App;