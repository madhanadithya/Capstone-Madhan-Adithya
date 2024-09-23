import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import axios from "axios";

const Manage = () => {
  const [view, setView] = useState("category");
  const [categories, setCategories] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [filteredServiceTypes, setFilteredServiceTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");

  const fetchCategories = async () => {
    const response = await axios.get(
      "http://localhost:5001/api/admin/categories",
      {
        headers: { "x-auth-token": token },
      }
    );
    setCategories(response.data);
  };

  const fetchServiceTypes = async () => {
    const response = await axios.get(
      "http://localhost:5001/api/admin/service-types",
      {
        headers: { "x-auth-token": token },
      }
    );
    setServiceTypes(response.data);
    setFilteredServiceTypes(response.data);
  };

  const handleEditOpen = (item) => {
    setEditItem(item);
    setName(item.name);
    setImage(item.image);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditItem(null);
    setName("");
    setImage("");
    setSelectedCategoryId("");
  };

  const handleSubmit = async () => {
    if (editItem) {
      const endpoint =
        view === "category"
          ? `http://localhost:5001/api/admin/categories/${editItem._id}`
          : `http://localhost:5001/api/admin/service-types/${editItem._id}`;

      const data =
        view === "category"
          ? { name, image }
          : { name, categoryId: selectedCategoryId, image };

      await axios.put(endpoint, data, {
        headers: { "x-auth-token": token },
      });
    }
    handleClose();
    fetchCategories();
    fetchServiceTypes();
  };

  const handleDelete = async (item) => {
    const endpoint =
      view === "category"
        ? `http://localhost:5001/api/admin/categories/${item._id}`
        : `http://localhost:5001/api/admin/service-types/${item._id}`;

    await axios.delete(endpoint, {
      headers: { "x-auth-token": token },
    });
    fetchCategories();
    fetchServiceTypes();
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    const filtered = serviceTypes.filter((service) =>
      service.name.toLowerCase().includes(searchValue)
    );
    setFilteredServiceTypes(filtered);
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchCategories();
      await fetchServiceTypes();
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography sx={{ ml: 57 }} variant="h4" gutterBottom>
        Manage Data
      </Typography>

      <Tabs
        value={view === "category" ? 0 : 1}
        onChange={(event, newValue) =>
          setView(newValue === 0 ? "category" : "serviceType")
        }
        sx={{ ml: 55, mb: 4, bgcolor: "white" }}
        aria-label="manage tabs"
      >
        <Tab label="Category" />
        <Tab label="Service Type" />
      </Tabs>

      {loading ? (
        <CircularProgress />
      ) : view === "category" ? (
        <Grid container spacing={2}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={category.image}
                  alt={category.name}
                />
                <CardContent>
                  <Typography variant="h5">{category.name}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleEditOpen(category)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => handleDelete(category)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          <TextField
            label="Search Service Types"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ mb: 4 }}
          />
          <Grid container spacing={2}>
            {filteredServiceTypes.map((service) => (
              <Grid item xs={12} sm={6} md={4} key={service._id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={service.image}
                    alt={service.name}
                  />
                  <CardContent>
                    <Typography variant="h5">{service.name}</Typography>
                    <Typography variant="body2">
                      Category ID: {service.category}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleEditOpen(service)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="secondary"
                      onClick={() => handleDelete(service)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      <Modal open={open} onClose={handleClose}>
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
          }}
        >
          <Typography variant="h6" gutterBottom>
            {view === "category" ? "Edit Category" : "Edit Service Type"}
          </Typography>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Image URL"
            variant="outlined"
            fullWidth
            margin="normal"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          {view === "serviceType" && (
            <FormControl fullWidth margin="normal">
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ bgcolor: "black", mt: 4, ml: 35 }}
          >
            Save
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Manage;
