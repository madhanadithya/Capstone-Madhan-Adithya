import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Add = () => {
  const [isCategory, setIsCategory] = useState(true);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5001/api/admin/categories", {
      headers: {
        "x-auth-token": token,
      },
    });
    const data = await response.json();
    setCategories(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const url = isCategory
      ? "http://localhost:5001/api/admin/categories"
      : "http://localhost:5001/api/admin/service-types";

    const body = isCategory ? { name, image } : { name, categoryId, image };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      setSnackbarMessage(
        `${isCategory ? "Category" : "Service type"} added successfully!`
      );
      setSnackbarSeverity("success");
    } else {
      setSnackbarMessage(
        `Error adding ${isCategory ? "category" : "service type"}.`
      );
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setImage("");
    setCategoryId("");
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 600,
        mx: "auto",
        mt: 4,
      }}
    >
      <Typography variant="h4" align="center" mb={4}>
        Add {isCategory ? "Category" : "Service Type"}
      </Typography>
      <Button
        variant="contained"
        onClick={() => setIsCategory(true)}
        color={isCategory ? "primary" : "default"}
        sx={{ mr: 2 }}
      >
        Category
      </Button>
      <Button
        variant="contained"
        onClick={() => setIsCategory(false)}
        color={!isCategory ? "primary" : "default"}
      >
        Service Type
      </Button>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Image URL"
          variant="outlined"
          fullWidth
          margin="normal"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
        />

        {!isCategory && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ bgcolor: "black", mt: 3 }}
          fullWidth
        >
          Add {isCategory ? "Category" : "Service Type"}
        </Button>
      </form>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Add;
