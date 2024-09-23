import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const Users = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:5001/api/admin/users", {
          method: "GET",
          headers: {
            "x-auth-token": token,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("Unexpected response format:", data);
          setMessage("Failed to load users.");
          setOpen(true);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setMessage("Failed to load users.");
        setOpen(true);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:5001/api/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            "x-auth-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setUsers(users.filter((user) => user._id !== userId));
        setMessage("User deleted successfully!");
        setOpen(true);
      } else {
        setMessage("Failed to delete user.");
        setOpen(true);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setMessage("Failed to delete user.");
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container>
      <Grid container spacing={3}>
        {users.map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user._id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" component="div">
                  {user.username}
                </Typography>
                <Typography color="text.secondary">
                  Email: {user.email}
                </Typography>
                <Typography color="text.secondary">
                  Phone: {user.phoneNumber}
                </Typography>
                <Typography color="text.secondary">
                  Role: {user.role}
                </Typography>
                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(user._id)}
                    sx={{ ml: 10, mt: 3 }}
                  >
                    Delete User
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Users;
