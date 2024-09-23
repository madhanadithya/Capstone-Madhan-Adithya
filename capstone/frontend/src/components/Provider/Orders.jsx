import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Modal,
  TextField,
  Snackbar,
  CircularProgress,
  Alert,
  Input,
  IconButton,
} from "@mui/material";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [phone, setPhone] = useState("");
  const [files, setFiles] = useState([]);
  const [fileUploadId, setFileUploadId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [providerId, setProviderId] = useState(null);

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
        fetchOrders(response.data._id);
      } catch (error) {
        console.error("Error fetching provider ID:", error);
      }
    };

    fetchProviderId();
  }, []);

  const fetchOrders = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/bookings/provider/${id}`
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error.message);
    }
  };

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setPhone(order.customerId.phoneNumber);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedOrder(null);
    setFiles([]);
    setFileUploadId(null);
    setPhone("");
    setOtp("");
  };

  const handleFileChange = (event) => {
    setFiles([...event.target.files]);
  };

  const handleFileUpload = async () => {
    if (files.length !== 2) {
      setSnackbarMessage("You must upload exactly 2 images.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }

    try {
      const uploadResponse = await axios.post(
        "http://localhost:5001/api/filesUpload/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setFileUploadId(uploadResponse.data._id);
      setSnackbarMessage("Files uploaded successfully!");
      setSnackbarSeverity("success");
    } catch (err) {
      setSnackbarMessage(err.response?.data?.message || "An error occurred");
      setSnackbarSeverity("error");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpGeneration = async () => {
    if (!phone || !fileUploadId) {
      setSnackbarMessage("Please enter a phone number and upload files first.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    setLoading(true);

    const { serviceId, serviceProviderId, customerId } = selectedOrder;

    try {
      await axios.post("http://localhost:5001/api/otp/send", {
        phone,
        filesUpload: fileUploadId,
        bookingId: selectedOrder._id,
        provider_id: serviceProviderId,
        service_id: serviceId._id,
        user_id: customerId._id,
      });

      setSnackbarMessage("OTP sent successfully!");
      setSnackbarSeverity("success");
    } catch (err) {
      setSnackbarMessage(err.response?.data?.message || "An error occurred");
      setSnackbarSeverity("error");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async () => {
    if (!fileUploadId) {
      setSnackbarMessage("Please complete the file upload first.");
      setSnackbarSeverity("error");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5001/api/otp/verify", {
        phone,
        otp,
        filesUpload: fileUploadId,
        bookingId: selectedOrder._id,
      });

      await axios.put(
        `http://localhost:5001/api/bookings/${selectedOrder._id}`,
        {
          status: "completed",
        }
      );

      setSnackbarMessage("OTP verified and booking completed successfully!");
      setSnackbarSeverity("success");
      fetchOrders(providerId);
      handleCloseModal();
    } catch (err) {
      setSnackbarMessage(err.response?.data?.message || "Verification failed!");
      setSnackbarSeverity("error");
    } finally {
      setLoading(false);
      setOpenSnackbar(true);
    }
  };

  const renderOrders = () => {
    return (
      <Grid container spacing={2}>
        {orders.map((order) => (
          <Grid item xs={12} sm={6} md={4} key={order._id}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                bgcolor: "#f9f9f9",
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" fontWeight="bold">
                  Order ID: {order._id}
                </Typography>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mt: 2 }}
                >
                  Customer Details
                </Typography>
                <Typography variant="body1">
                  <strong>Username:</strong> {order.customerId.username}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {order.customerId.email}
                </Typography>
                <Typography variant="body1">
                  <strong>Phone:</strong> {order.customerId.phoneNumber}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  Status: {order.status}
                </Typography>
                <Button
                  variant="contained"
                  color="black"
                  onClick={() => handleOpenModal(order)}
                  sx={{ mt: 4, ml: 10, bgcolor: "black", color: "white" }}
                >
                  Manage Order
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "white", mt: 2, borderRadius: 2 }}>
      <Box sx={{ p: 3 }}>{renderOrders()}</Box>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            p: 4,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: "400px" },
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{ position: "absolute", right: 16, top: 16 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h5" sx={{ mb: 2, ml: 10 }}>
            Manage Order
          </Typography>
          {selectedOrder && (
            <>
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <Input
                  type="file"
                  inputProps={{ accept: "image/*", multiple: true }}
                  onChange={handleFileChange}
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  variant="contained"
                  color="black"
                  onClick={handleFileUpload}
                  disabled={loading}
                  sx={{
                    height: "56px",
                    bgcolor: "black",
                    color: "white",
                    maxWidth: 20,
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Upload"
                  )}
                </Button>
              </Box>

              {files.length > 0 && (
                <Box sx={{ mt: 2, mb: 3 }}>
                  <Typography variant="subtitle1">Preview:</Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {Array.from(files).map((file, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 100,
                          height: 100,
                          overflow: "hidden",
                          borderRadius: 1,
                          boxShadow: 1,
                        }}
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`preview-${index}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <TextField
                  label="Phone Number"
                  type="text"
                  fullWidth
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  variant="outlined"
                  sx={{ flexGrow: -0.1 }}
                />
                <Button
                  variant="contained"
                  color="black"
                  onClick={handleOtpGeneration}
                  disabled={!fileUploadId}
                  sx={{
                    height: "56px",
                    bgcolor: "black",
                    color: "white",
                    maxWidth: 20,
                  }}
                >
                  Get OTP
                </Button>
              </Box>

              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <TextField
                  label="OTP"
                  type="text"
                  fullWidth
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  variant="outlined"
                  sx={{ flexGrow: 1.8 }}
                />
                <Button
                  variant="contained"
                  color="black"
                  onClick={handleOtpVerification}
                  sx={{
                    height: "56px",
                    bgcolor: "black",
                    color: "white",
                    maxWidth: 20,
                  }}
                >
                  Verify
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Orders;
