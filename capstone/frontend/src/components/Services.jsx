import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Typography,
  Container,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";
import { getServicesByServiceType } from "../actions/categoryActions";
import ServiceList from "./ServiceList";

const Services = () => {
  const { serviceTypeId } = useParams();
  const dispatch = useDispatch();
  const { services, loading, error } = useSelector((state) => state.category);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(getServicesByServiceType(serviceTypeId));
  }, [dispatch, serviceTypeId]);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Services
      </Typography>
      <TextField
        variant="outlined"
        placeholder="Search Services..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100px"
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          Error: {error}
        </Typography>
      ) : filteredServices.length > 0 ? (
        <ServiceList services={filteredServices} />
      ) : (
        <Typography align="center">No services available.</Typography>
      )}
    </Container>
  );
};

export default Services;
