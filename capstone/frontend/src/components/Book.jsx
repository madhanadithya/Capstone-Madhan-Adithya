import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBooking } from "../actions/bookActions";
import {
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Snackbar,
  Box,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Book = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { serviceId } = useParams();

  const [bookingDetails, setBookingDetails] = useState({
    location: "",
    slot: "",
    paymentMethod: "",
    payAfterServiceOption: "",
  });

  const { loading, error, success } = useSelector((state) => state.book);
  const [serviceProviderId, setServiceProviderId] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchServiceProviderId = async () => {
      const { data } = await axios.get(
        `http://localhost:5001/api/consumer/services/${serviceId}`
      );
      setServiceProviderId(data.provider);
    };

    const fetchCustomerId = async () => {
      const { data } = await axios.get(
        "http://localhost:5001/api/consumer/me",
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );
      setCustomerId(data._id);
      setUserDetails(data);
    };

    fetchServiceProviderId();
    fetchCustomerId();
  }, [serviceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails({ ...bookingDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!serviceProviderId || !customerId) {
      console.error("Missing serviceProviderId or customerId");
      return;
    }

    const bookingData = {
      serviceId,
      serviceProviderId,
      customerId,
      location: bookingDetails.location,
      slot: new Date(bookingDetails.slot).toISOString(),
      paymentMethod: bookingDetails.paymentMethod,
      payAfterServiceOption: bookingDetails.payAfterServiceOption,
    };

    console.log("Submitting booking data:", bookingData);
    await dispatch(createBooking(bookingData));
  };

  useEffect(() => {
    if (success) {
      setSnackbarMessage("Booking successful!");
      setSnackbarOpen(true);
      navigate("/");
    }

    if (error) {
      setSnackbarMessage(`Error: ${error}`);
      setSnackbarOpen(true);
    }
  }, [success, error, navigate]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (!localStorage.getItem("token")) {
    return (
      <Typography variant="h6">
        Please log in to book a service.{" "}
        <Button onClick={() => navigate("/login")}>Login</Button>
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: "background.paper",
        mt: 10,
        mx: "auto",
        maxWidth: { xs: "90%", sm: 500 }, // Responsive width
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <form onSubmit={handleSubmit}>
        <Typography variant="h4" gutterBottom>
          Book Service
        </Typography>
        <Typography variant="h6">Username: {userDetails.username}</Typography>
        <Typography variant="h6">Phone: {userDetails.phoneNumber}</Typography>
        <Typography variant="h6">Email: {userDetails.email}</Typography>

        <TextField
          name="location"
          label="Location"
          required
          fullWidth
          margin="normal"
          onChange={handleChange}
        />
        <TextField
          name="slot"
          type="datetime-local"
          required
          fullWidth
          margin="normal"
          onChange={handleChange}
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="payment-method-label">Payment Method</InputLabel>
          <Select
            name="paymentMethod"
            labelId="payment-method-label"
            value={bookingDetails.paymentMethod}
            onChange={handleChange}
          >
            <MenuItem value="net banking">Net Banking</MenuItem>
            <MenuItem value="upi">UPI</MenuItem>
            <MenuItem value="pay after service">Pay After Service</MenuItem>
          </Select>
        </FormControl>
        {bookingDetails.paymentMethod === "pay after service" && (
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="pay-after-service-label">
              Pay After Service Option
            </InputLabel>
            <Select
              name="payAfterServiceOption"
              labelId="pay-after-service-label"
              value={bookingDetails.payAfterServiceOption}
              onChange={handleChange}
            >
              <MenuItem value="pay online">Pay Online</MenuItem>
              <MenuItem value="pay cash">Pay Cash</MenuItem>
            </Select>
          </FormControl>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 2, bgcolor: "black", width: "100%" }}
        >
          {loading ? <CircularProgress size={24} /> : "Checkout"}
        </Button>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </form>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        sx={{ mt: 8 }}
      />
    </Box>
  );
};

export default Book;
