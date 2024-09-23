import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  Grid,
  Container,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterServiceForm = () => {
  const [categories, setCategories] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5001/api/consumer/categories"
        );
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Could not fetch categories. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = async (e) => {
    const selectedCategoryId = e.target.value;
    formik.setFieldValue("categoryId", selectedCategoryId);
    formik.setFieldValue("serviceTypeId", ""); 

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5001/api/consumer/service-types/category/${selectedCategoryId}`
      );
      setServiceTypes(response.data);
    } catch (err) {
      console.error("Error fetching service types:", err);
      setError("Could not fetch service types. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      serviceName: "",
      serviceDescription: "",
      categoryId: "",
      serviceTypeId: "",
      price: "",
      timeRequired: "00:30",
      locationCity: "",
      locationState: "",
      image: "",
    },
    validationSchema: Yup.object({
      serviceName: Yup.string()
        .max(30, "Must be 30 characters or less")
        .required("Required"),
      serviceDescription: Yup.string()
        .max(150, "Must be 150 characters or less")
        .min(20, "At least 20 characters required")
        .required("Required"),
      locationCity: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Required"),
      locationState: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Required"),
      price: Yup.number()
        .required("Required")
        .positive("Must be positive")
        .min(0, "Cannot be negative"),
      image: Yup.string().url("Must be a valid URL").required("Required"),
    }),
    onSubmit: async (values) => {
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token is missing.");
          return;
        }

        setLoading(true);
        const response = await axios.post(
          "http://localhost:5001/api/provider/services",
          {
            ...values,
            name: values.serviceName,
            description: values.serviceDescription,
            serviceTypeId: values.serviceTypeId,
            price: parseFloat(values.price),
            timeRequired: values.timeRequired,
            location: {
              city: values.locationCity,
              state: values.locationState,
            },
            image: values.image,
          },
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );

        if (response.status === 200) {
          setSnackbarOpen(true);
          formik.resetForm();
          setServiceTypes([]);
          setTimeout(() => navigate("/my-services"), 2000);
        }
      } catch (error) {
        setError("Error registering service. Please try again.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Register New Service
        </Typography>
        {error && (
          <Typography color="error" align="center">
            {error}
          </Typography>
        )}
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Service Name"
                {...formik.getFieldProps("serviceName")}
                fullWidth
                error={
                  formik.touched.serviceName &&
                  Boolean(formik.errors.serviceName)
                }
                helperText={
                  formik.touched.serviceName && formik.errors.serviceName
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Service Description"
                {...formik.getFieldProps("serviceDescription")}
                fullWidth
                multiline
                rows={2}
                error={
                  formik.touched.serviceDescription &&
                  Boolean(formik.errors.serviceDescription)
                }
                helperText={
                  formik.touched.serviceDescription &&
                  formik.errors.serviceDescription
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Choose Category</InputLabel>
                <Select
                  {...formik.getFieldProps("categoryId")}
                  onChange={(e) => {
                    handleCategoryChange(e);
                    formik.handleChange(e);
                  }}
                >
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Service Type</InputLabel>
                <Select
                  {...formik.getFieldProps("serviceTypeId")}
                  disabled={!formik.values.categoryId}
                >
                  {serviceTypes.map((serviceType) => (
                    <MenuItem key={serviceType._id} value={serviceType._id}>
                      {serviceType.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Price"
                type="number"
                {...formik.getFieldProps("price")}
                fullWidth
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Time Required (HH:MM)"
                {...formik.getFieldProps("timeRequired")}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="City"
                {...formik.getFieldProps("locationCity")}
                fullWidth
                error={
                  formik.touched.locationCity &&
                  Boolean(formik.errors.locationCity)
                }
                helperText={
                  formik.touched.locationCity && formik.errors.locationCity
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="State"
                {...formik.getFieldProps("locationState")}
                fullWidth
                error={
                  formik.touched.locationState &&
                  Boolean(formik.errors.locationState)
                }
                helperText={
                  formik.touched.locationState && formik.errors.locationState
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Image URL"
                {...formik.getFieldProps("image")}
                fullWidth
                error={formik.touched.image && Boolean(formik.errors.image)}
                helperText={formik.touched.image && formik.errors.image}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ bgcolor: "black" }}
              >
                {loading ? <CircularProgress size={24} /> : "Register Service"}
              </Button>
            </Grid>
          </Grid>
        </form>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            Service registered successfully!
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default RegisterServiceForm;
