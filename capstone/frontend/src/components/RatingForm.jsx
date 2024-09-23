import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
  Container,
  Grid,
} from "@mui/material";
import Rating from "@mui/material/Rating";

const RatingForm = () => {
  const { provider_id, service_id, user_id } = useParams();
  const [rating, setRating] = useState(null);
  const [comments, setComments] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/api/ratings", {
        provider_id,
        service_id,
        rating: Number(rating),
        comments,
        customer_id: user_id,
      });
      setSnackbarMessage("Rating submitted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setRating(null);
      setComments("");
    } catch (error) {
      console.error("Error submitting rating:", error);
      setSnackbarMessage("Error submitting rating.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, bgcolor: "#f5f5f5" }}>
      <Typography variant="h4" align="center" gutterBottom>
        We welcome, your valuable feedback..!.!
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2, ml: 25 }}>
          <Typography sx={{ ml: 4 }} variant="h6">
            Rating:
          </Typography>
          <Rating
            name="rating"
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
            precision={0.5}
          />
        </Box>
        <TextField
          label="Feedback"
          multiline
          rows={4}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ bgcolor: "black", mt: 3 }}
          fullWidth
        >
          Submit Rating
        </Button>
      </form>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RatingForm;
