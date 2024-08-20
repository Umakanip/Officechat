import React, { useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Suggestions from "./Suggestions.tsx";
import MoreIcon from "@mui/icons-material/MoreVert";
import "./MainHeader.css";
import { Message, Group, User } from "../ChatWindow/messagetypes.ts";
import { useUser } from "../../context/UserContext.tsx";
import axios from "axios";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const {
    selectedUserId,
    user,
    setActiveGroup,
    activeUser,
    setActiveUser,
    setSelectedUserId,
    selectActiveUser,
    setselectActiveUser,
    Contact,
    setContact,
    setHeaderTitle,
  } = useUser();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<User[]>([]);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const fetchSearchSuggestions = async (searchQuery: string) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/usernamesugggestions",
        {
          params: { query: searchQuery },
        }
      );
      setSearchSuggestions(response.data);
      setSuggestionsVisible(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSelectUser = (user: User) => {
    console.log("User selected:", user.Username);

    setSearchTerm(user.Username);
    setActiveGroup(null); // Clear active group
    setHeaderTitle(user.Username);
    setActiveUser(user.UserID); // Set the selected user as active
    setselectActiveUser(user);
    setSelectedUserId(user.UserID);
    setSearchSuggestions([]);
    setSuggestionsVisible(false);

    const newUser = user;

    if (!Contact.some((user) => user.UserID === newUser.UserID)) {
      setContact((prevUserList) => [...prevUserList, newUser]);
    }

    // This code checks if the selected user is already the active user
    if (activeUser !== user.UserID) {
      console.log("New active user set:", user);
      setActiveUser(user.UserID);
    } else {
      console.log("User already active.");
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);

    if (searchValue) {
      fetchSearchSuggestions(searchValue);
    } else {
      setSearchSuggestions([]);
      setSuggestionsVisible(false);
    }
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    console.log("Logout", user?.userdata?.UserID);

    axios
      .post("http://localhost:3000/api/auth/logout", {
        userId: user?.userdata?.UserID, // Pass the user ID in the request body
      }) // Replace with your actual logout API endpoint
      .then(() => {
        window.location.href = "/login"; // Redirect to login page
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });

    handleMenuClose();
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const handleSendMessage = async (message: string) => {
    try {
      const response = await axios.post("http://localhost:3000/api/messages", {
        userId: activeUser,
        message,
      });

      if (response.status === 200) {
        console.log("Message sent successfully.");

        // If the active user ID has changed, log it
        if (selectActiveUser && activeUser !== selectActiveUser.UserID) {
          console.log("Active user updated:", selectActiveUser);
          setActiveUser(selectActiveUser.UserID);
        }
      } else {
        console.error(
          "Failed to send message, response status:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    console.log("selectActiveUser", selectActiveUser);
  }, [selectActiveUser]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ marginTop: "1px", color: "white" }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            &nbsp;Clubits Chat
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              onChange={handleSearchChange}
              value={searchTerm}
            />
            {suggestionsVisible && (
              <Suggestions
                suggestions={searchSuggestions}
                onSelect={handleSelectUser}
              />
            )}
          </Search>

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Typography style={{ marginTop: "10px" }}>
              {user?.userdata?.Username}
            </Typography>

            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}

export default Header;
