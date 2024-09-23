import React from "react";
import { useDispatch } from "react-redux";
import { login } from "../../actions/authActions";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  Box,
  Slide,
  Link,
  Snackbar,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

const Login = () => {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        await dispatch(login(values));
        setSnackbarMessage("Login successful!");
      } catch (error) {
        setSnackbarMessage("Login failed: " + error.message);
      } finally {
        setSnackbarOpen(true);
      }
    },
  });

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="xs" sx={{ marginTop: 8 }}>
      <Slide direction="up" in={true} timeout={1000}>
        <Card elevation={5}>
          <CardContent>
            <Typography variant="h5" component="h2" align="center" gutterBottom>
              Login
            </Typography>
            <form onSubmit={formik.handleSubmit}>
              <Box mt={2}>
                <TextField
                  fullWidth
                  variant="outlined"
                  name="email"
                  label="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  margin="normal"
                  required
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
                  margin="normal"
                  required
                />
              </Box>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2, bgcolor: "black" }}
              >
                Login
              </Button>
            </form>
            <Box mt={2} textAlign="center">
              <Typography variant="body2">
                Don't have an account?{" "}
                <Link href="/register" underline="hover" color="primary">
                  Register
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Slide>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ marginTop: "16px" }}
      />
    </Container>
  );
};

export default Login;
