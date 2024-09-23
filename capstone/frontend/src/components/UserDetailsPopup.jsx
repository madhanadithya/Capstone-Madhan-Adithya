import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Divider,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const UserDetailsPopup = ({ open, onClose }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:5001/api/consumer/me",
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchUserDetails();
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>User Details</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Typography variant="body1" align="center">
            Loading user details...
          </Typography>
        ) : user ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              Username: {user.username}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1">
              Phone Number: {user.phoneNumber}
            </Typography>
            <Typography variant="body1">Email: {user.email}</Typography>
          </Box>
        ) : (
          <Typography variant="body1" align="center">
            User details not available.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<EditIcon />}
          onClick={() => alert("Edit functionality goes here")}
        >
          Edit
        </Button>
        <Button onClick={onClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDetailsPopup;
