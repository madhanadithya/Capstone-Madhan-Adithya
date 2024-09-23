import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import { AccountCircle as AccountCircleIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import BookingsPopup from "./BookingsPopup";
import UserDetailsPopup from "./UserDetailsPopup";
import axios from "axios";

const NavBar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (token) {
        try {
          const response = await axios.get(
            "http://localhost:5001/api/consumer/me",
            {
              headers: { "x-auth-token": token },
            }
          );
          setUser(response.data);
        } catch (error) {
          console.error("Failed to fetch user details", error);
        }
      }
    };

    fetchUserDetails();
  }, [token]);

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const handleMyBookingsClick = () => {
    setPopupOpen(true);
    handleCloseMenu();
  };

  const open = Boolean(anchorEl);
  const userRole = user ? user.role : null;

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "white" }}>
        <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          <IconButton onClick={handleLogoClick}>
            <img
              src="https://th.bing.com/th/id/R.5b9e6b62b40e570977fdd4df2a53ead8?rik=5lZg8YbL4waXLw&riu=http%3a%2f%2flogos.textgiraffe.com%2flogos%2flogo-name%2fAditya-designstyle-friday-m.png&ehk=FzablDhVOxLWeRTQxpEuzAN7JowRH9h9%2f6uOYzDoOEg%3d&risl=&pid=ImgRaw&r=0"
              alt="Logo"
              style={{ height: "40px", cursor: "pointer" }}
            />
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              onClick={handleProfileClick}
              size="large"
              sx={{ display: { xs: "none", md: "flex" } }} // Hide on mobile
            >
              <AccountCircleIcon sx={{ fontSize: 30, color: "#1976d2" }} />
            </IconButton>
            <IconButton
              color="inherit"
              onClick={handleProfileClick}
              size="large"
              sx={{ display: { xs: "flex", md: "none" } }} // Show on mobile
            >
              <AccountCircleIcon sx={{ fontSize: 24, color: "#1976d2" }} />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
              {token ? (
                <>
                  <MenuItem onClick={() => setUserDetailsOpen(true)}>
                    Profile
                  </MenuItem>
                  {userRole === "consumer" && (
                    <MenuItem onClick={handleMyBookingsClick}>
                      My Bookings
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </>
              ) : (
                <MenuItem onClick={() => navigate("/login")}>Login</MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <BookingsPopup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        token={token}
      />
      <UserDetailsPopup
        open={userDetailsOpen}
        onClose={() => setUserDetailsOpen(false)}
        user={user}
      />
    </>
  );
};

export default NavBar;
