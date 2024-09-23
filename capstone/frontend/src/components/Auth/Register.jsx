import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../../actions/authActions";
import ReCAPTCHA from "react-google-recaptcha";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Slide,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

const Register = () => {
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "consumer",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      phoneNumber: Yup.string()
        .matches(
          /^\+91\d{10}$/,
          "Phone number must be a valid Indian number starting with +91 and including that it should be 13 characters"
        )
        .required("Phone number is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Please confirm your password"),
      role: Yup.string().required("Role is required"),
    }),
    onSubmit: (values) => {
      if (!recaptchaVerified) {
        setSnackbarMessage("Please complete the ReCAPTCHA verification.");
        setSnackbarOpen(true);
        return;
      }

      const { confirmPassword, ...formData } = values;
      dispatch(register(formData))
        .then(() => {
          setSnackbarMessage("Registration successful!");
          setSnackbarOpen(true);
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        })
        .catch((error) => {
          setSnackbarMessage("Registration failed: " + error.message);
          setSnackbarOpen(true);
        });
    },
  });

  const handleRecaptchaChange = (value) => {
    setRecaptchaVerified(!!value);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="xs" sx={{ marginTop: 8 }}>
      <Slide direction="up" in={true} timeout={1000}>
        <Card elevation={5}>
          <CardContent>
            <Typography variant="h5" component="h2" align="center" gutterBottom>
              Register
            </Typography>
            <form onSubmit={formik.handleSubmit}>
              <Box mt={2}>
                <TextField
                  fullWidth
                  variant="outlined"
                  name="username"
                  label="Username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.username && Boolean(formik.errors.username)
                  }
                  helperText={formik.touched.username && formik.errors.username}
                  required
                  margin="normal"
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  name="phoneNumber"
                  label="Phone Number"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.phoneNumber &&
                    Boolean(formik.errors.phoneNumber)
                  }
                  helperText={
                    formik.touched.phoneNumber && formik.errors.phoneNumber
                  }
                  required
                  margin="normal"
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  name="email"
                  label="Email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  required
                  margin="normal"
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  name="password"
                  label="Password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  required
                  margin="normal"
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  helperText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                  required
                  margin="normal"
                />
                <FormControl fullWidth variant="outlined" margin="normal">
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="role"
                    value={formik.values.role}
                    onChange={formik.handleChange}
                    label="Role"
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="consumer">Consumer</MenuItem>
                    <MenuItem value="provider">Provider</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box
                mt={2}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  ml: 4,
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <ReCAPTCHA
                    sitekey="6LdZzUoqAAAAAKKe6rEo4_mzHi5u5LPCl-mCiOO9"
                    onChange={handleRecaptchaChange}
                    style={{
                      width: "100%",
                    }}
                  />
                </Box>
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2, bgcolor: "black" }}
              >
                Register
              </Button>
            </form>
          </CardContent>
        </Card>
      </Slide>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ marginTop: "64px" }}
      />
    </Container>
  );
};

export default Register;
