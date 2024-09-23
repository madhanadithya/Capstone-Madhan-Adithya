import React, { useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ServiceList = ({ services }) => {
  const [open, setOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [serviceRating, setServiceRating] = useState(null);
  const [providerRating, setProviderRating] = useState(null);
  const navigate = useNavigate();

  const fetchRatings = async (serviceId, providerId) => {
    try {
      const serviceResponse = await axios.get(
        `http://localhost:5001/api/ratings/service/${serviceId}`
      );
      setServiceRating(serviceResponse.data.averageRating);

      const providerResponse = await axios.get(
        `http://localhost:5001/api/ratings/provider/${providerId}`
      );
      setProviderRating(providerResponse.data.averageRating);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  const handleSeeMore = (service) => {
    setSelectedService(service);
    fetchRatings(service._id, service.provider?._id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedService(null);
    setServiceRating(null);
    setProviderRating(null);
  };

  const handleBookNow = (serviceId) => {
    navigate(`/book/${serviceId}`);
  };

  return (
    <>
      <Grid container spacing={2}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service._id}>
            <Card style={{ position: "relative" }}>
              <CardMedia
                component="img"
                height="200"
                image={service.image}
                alt={service.provider?.username || "Service Image"}
                sx={{
                  objectFit: "cover",
                  borderRadius: 1,
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  color: "white",
                  padding: "2px 6px",
                  borderRadius: "4px",
                }}
              >
                Posted on: {dayjs(service.createdAt).format("MMM D, YYYY")}
              </Typography>
              <CardContent>
                <Typography variant="h6" noWrap>
                  {service.name}
                </Typography>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="subtitle2" color="textSecondary">
                    Provider: {service.provider?.username || "N/A"}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleBookNow(service._id)}
                  >
                    Book Now
                  </Button>
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  my={1}
                >
                  <Typography variant="body1">₹{service.price}</Typography>
                  <Typography variant="body1">
                    {service.timeRequired} hrs
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  sx={{ mt: 1 }}
                  onClick={() => handleSeeMore(service)}
                >
                  See More
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedService && (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedService.name} - Details
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Typography sx={{ ml: 45 }} variant="h6" gutterBottom>
              Service Details
            </Typography>
            <Typography>
              <strong>Provider:</strong>{" "}
              {selectedService.provider?.username || "N/A"}
            </Typography>
            <Typography>
              <strong>Email:</strong> {selectedService.provider?.email || "N/A"}
            </Typography>
            <Typography sx={{ mb: 3 }}>
              <strong>Phone:</strong>{" "}
              {selectedService.provider?.phoneNumber || "N/A"}
            </Typography>
            <Typography>
              <strong>Location:</strong> {selectedService.location.city},{" "}
              {selectedService.location.state}
            </Typography>
            <Typography>
              <strong>Price:</strong> ₹{selectedService.price}
            </Typography>
            <Typography sx={{ mb: 3 }}>
              <strong>Time Required:</strong> {selectedService.timeRequired} hrs
            </Typography>
            <Typography>
              <strong>Description:</strong> {selectedService.description}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Posted on:{" "}
              {dayjs(selectedService.createdAt).format("MMM D, YYYY")}
            </Typography>

            <Typography variant="body1" my={2}>
              <strong>Service Rating:</strong>{" "}
              {serviceRating
                ? "⭐".repeat(Math.round(serviceRating))
                : "No Ratings available"}
            </Typography>
            <Typography variant="body1">
              <strong>Provider Rating:</strong>{" "}
              {providerRating
                ? "⭐".repeat(Math.round(providerRating))
                : "No Ratings available"}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleBookNow(selectedService._id)}
            >
              Book Now
            </Button>
            <Button onClick={handleClose} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default ServiceList;
