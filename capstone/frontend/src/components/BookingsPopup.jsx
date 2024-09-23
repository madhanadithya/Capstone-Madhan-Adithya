import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";

const BookingsPopup = ({ open, onClose, token }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (open) {
        setLoading(true);
        setError("");

        try {
          const response = await fetch(
            "http://localhost:5001/api/bookings/customer/bookings",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "x-auth-token": token,
              },
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch bookings");
          }

          const data = await response.json();
          setBookings(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBookings();
  }, [open, token]);

  const handleSeeMore = (booking) => {
    setSelectedBooking(booking);
  };

  const handleCloseDetails = () => {
    setSelectedBooking(null);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: 2,
          padding: 4,
          maxWidth: { xs: "90%", sm: 600 }, // Responsive width
          margin: "auto",
          mt: { xs: 5, sm: 10 }, // Responsive margin
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" gutterBottom>
          My Bookings
        </Typography>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100px"
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {error ? (
              <Typography color="error">{error}</Typography>
            ) : bookings.length === 0 ? (
              <Typography>No bookings found</Typography>
            ) : (
              bookings.map((booking) => (
                <Box
                  key={booking._id}
                  sx={{
                    mb: 2,
                    p: 2,
                    border: "1px solid #1976d2",
                    borderRadius: 1,
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  <Typography variant="subtitle1">
                    {booking.serviceId.name}
                  </Typography>
                  <Typography variant="body2">
                    Slot: {new Date(booking.slot).toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    Status: {booking.status}
                  </Typography>
                  <Typography variant="body2">
                    Payment Method: {booking.paymentMethod}
                  </Typography>
                  <Button
                    onClick={() => handleSeeMore(booking)}
                    variant="outlined"
                    sx={{ mt: 1 }}
                  >
                    See More
                  </Button>
                </Box>
              ))
            )}
          </Box>
        )}
        <Button
          onClick={onClose}
          variant="contained"
          sx={{ mt: 2, bgcolor: "black", width: "100%" }}
        >
          Close
        </Button>

        {selectedBooking && (
          <Modal open={Boolean(selectedBooking)} onClose={handleCloseDetails}>
            <Box
              sx={{
                bgcolor: "white",
                borderRadius: 2,
                padding: 4,
                maxWidth: { xs: "90%", sm: 600 }, // Responsive width
                maxHeight: "80vh",
                overflowY: "auto",
                margin: "auto",
                mt: { xs: 5, sm: 10 }, // Responsive margin
                boxShadow: 3,
              }}
            >
              <Typography variant="h6">Booking Details</Typography>
              <img
                src={selectedBooking.serviceId.image}
                alt="Service"
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "contain",
                  borderRadius: 4,
                }}
              />
              <Typography variant="subtitle1">
                {selectedBooking.serviceId.name}
              </Typography>
              <Typography variant="body2">
                Slot: {new Date(selectedBooking.slot).toLocaleString()}
              </Typography>
              <Typography variant="body2">
                Status: {selectedBooking.status}
              </Typography>
              <Typography variant="body2">
                Payment Method: {selectedBooking.paymentMethod}
              </Typography>

              <Typography variant="h6" sx={{ mt: 2 }}>
                Provider Contact Details
              </Typography>
              <Typography variant="body2">
                Name: {selectedBooking.serviceProviderId.username}
              </Typography>
              <Typography variant="body2">
                Email: {selectedBooking.serviceProviderId.email}
              </Typography>
              <Typography variant="body2">
                Phone: {selectedBooking.serviceProviderId.phoneNumber}
              </Typography>

              <Button
                onClick={handleCloseDetails}
                variant="contained"
                sx={{ mt: 2, width: "100%" }}
              >
                Close Details
              </Button>
            </Box>
          </Modal>
        )}
      </Box>
    </Modal>
  );
};

export default BookingsPopup;
