import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Modal,
  Box,
  TextField,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";

const MyServices = () => {
  const [services, setServices] = useState([]);
  const [providerId, setProviderId] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
    timeRequired: "",
    location: { city: "", state: "" },
    image: "",
  });

  useEffect(() => {
    const fetchProviderId = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/consumer/me",
          {
            headers: { "x-auth-token": localStorage.getItem("token") },
          }
        );
        setProviderId(response.data._id);
        fetchServices(response.data._id);
      } catch (error) {
        console.error("Error fetching provider ID:", error);
      }
    };

    fetchProviderId();
  }, []);

  const fetchServices = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/consumer/services/provider/${id}`
      );
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error.message);
    }
  };

  const handleOpenModal = (service) => {
    setSelectedService(service);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedService(null);
  };

  const handleOpenEditModal = (service) => {
    setEditForm({
      name: service.name,
      description: service.description,
      price: service.price,
      timeRequired: service.timeRequired,
      location: { city: service.location.city, state: service.location.state },
      image: service.image,
    });
    setSelectedService(service);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedService(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      setEditForm((prev) => ({
        ...prev,
        location: { ...prev.location, [name.split(".")[1]]: value },
      }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSubmit = async () => {
    const updatedService = {
      name: editForm.name,
      description: editForm.description,
      serviceTypeId: selectedService.serviceType._id, 
      price: editForm.price,
      timeRequired: editForm.timeRequired,
      location: {
        city: editForm.location.city,
        state: editForm.location.state,
      },
      image: editForm.image,
    };

    console.log("Submitting updated service:", updatedService); 

    try {
      await axios.put(
        `http://localhost:5001/api/provider/services/${selectedService._id}`, 
        updatedService,
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      fetchServices(providerId);
      handleCloseEditModal(); 
      handleCloseModal();
    } catch (error) {
      if (error.response) {
        console.error("Error updating service:", error.response.data);
      } else {
        console.error("Error updating service:", error);
      }
    }
  };

  const handleDeleteService = async () => {
    try {
      await axios.delete(
        `http://localhost:5001/api/provider/services/${selectedService._id}`,
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      fetchServices(providerId);
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const renderServices = () => {
    return (
      <Grid container spacing={2}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service._id}>
            <Card
              sx={{ display: "flex", flexDirection: "column", height: "100%" }}
            >
              <Box sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={service.image}
                  alt={service.name}
                />
                <Typography
                  variant="caption"
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    bgcolor: "rgba(255, 255, 255, 0.7)",
                    padding: "2px 4px",
                    borderRadius: 1,
                  }}
                >
                  Posted on: {dayjs(service.createdAt).format("MMMM D")}
                </Typography>
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="div">
                  {service.name}
                </Typography>
                <Typography variant="body1">
                  ₹{service.price} | {service.timeRequired}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleOpenModal(service)}
                  sx={{ mt: 2, ml: 13, bgcolor: "black" }}
                >
                  Show More
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box>
      {services.length > 0 ? (
        renderServices()
      ) : (
        <Typography>You have no service, register to show services.</Typography>
      )}

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "60%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxWidth: 500,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxHeight: "80vh",
            overflowY: "auto", 
          }}
        >
          {selectedService && (
            <>
              <CardMedia
                component="img"
                height="180"
                image={selectedService.image}
                alt={selectedService.name}
                sx={{ borderRadius: 1, mb: 2 }}
              />
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, textAlign: "center" }}
              >
                {selectedService.name}
              </Typography>
              <Typography
                variant="body1"
                sx={{ mt: 2, mb: 2, fontWeight: 600, textAlign: "center" }}
              >
                Service Id: {selectedService._id}
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "center", mb: 2 }}>
                {selectedService.description}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
                ₹{selectedService.price}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Time Required: {selectedService.timeRequired}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Location: {selectedService.location.city},{" "}
                {selectedService.location.state}
              </Typography>
              <Typography variant="caption" sx={{ mb: 3 }}>
                Posted on: {dayjs(selectedService.createdAt).format("MMMM D")}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDeleteService}
                sx={{ borderRadius: 20 }}
              >
                Delete
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleOpenEditModal(selectedService)}
                sx={{ mt: 2 }}
              >
                Edit
              </Button>
            </>
          )}
        </Box>
      </Modal>

      <Modal open={openEditModal} onClose={handleCloseEditModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxWidth: 500,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Edit Service
          </Typography>
          <TextField
            label="Service Name"
            name="name"
            value={editForm.name}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="description"
            value={editForm.description}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price"
            name="price"
            value={editForm.price}
            onChange={handleEditChange}
            type="number"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Time Required (HH:MM)"
            name="timeRequired"
            value={editForm.timeRequired}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="City"
            name="location.city"
            value={editForm.location.city}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="State"
            name="location.state"
            value={editForm.location.state}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Image URL"
            name="image"
            value={editForm.image}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditSubmit}
            sx={{ mt: 2 }}
          >
            Save Changes
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default MyServices;
