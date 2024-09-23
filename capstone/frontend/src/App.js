import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Services from "./components/Services";
import NavBar from "./components/NavBar";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Admin from "./components/Admin/Admin";
import Provider from "./components/Provider/Provider";
import Book from "./components/Book";
import RatingForm from "./components/RatingForm";
import Footer from "./components/Footer";
import { Container, CssBaseline } from "@mui/material";

import ProtectedRoute from "./components/Auth/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <CssBaseline />
      <NavBar />

      <Container>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services/:serviceTypeId" element={<Services />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/provider"
            element={
              <ProtectedRoute>
                <Provider />
              </ProtectedRoute>
            }
          />
          <Route path="/book/:serviceId" element={<Book />} />

          <Route
            path="/rate-service/:provider_id/:service_id/:user_id"
            element={<RatingForm />}
          />
        </Routes>
      </Container>

      <Footer/>
    </Router>
  );
};

export default App;
