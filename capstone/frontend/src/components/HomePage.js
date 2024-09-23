import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import flyer from "../assets/flyer.jpeg";
import adGif from "../assets/ad.gif";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Grid,
  Box,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  getCategories,
  getServiceTypesByCategory,
} from "../actions/categoryActions";
import CategoryList from "./CategoryList";
import ServiceTypeList from "./ServiceTypeList";
import ImageCarousel from "./ImageCarousel";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, serviceTypes, loading, error } = useSelector(
    (state) => state.category
  );

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    dispatch(getServiceTypesByCategory(categoryId));
    setOpenCategoryDialog(true);
  };

  const handleServiceTypeClick = (serviceTypeId) => {
    navigate(`/services/${serviceTypeId}`);
  };

  const handleCloseCategoryDialog = () => {
    setOpenCategoryDialog(false);
    setSelectedCategory(null);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ p: 2, mt: 2 }}>
      <Box sx={{ mb: 2, height: "auto", backgroundColor: "#e0e0e0" }}>
        <img
          src={flyer}
          alt="flyer placeholder"
          style={{ width: "100%", height: "auto", objectFit: "cover" }}
        />
      </Box>

      <TextField
        variant="outlined"
        placeholder="Search Categories..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2, width: "100%" }}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} md={9}>
          <Typography variant="h4" gutterBottom>
            Categories
          </Typography>
          {loading && <Typography>Loading...</Typography>}
          {error && <Typography color="error">Error: {error}</Typography>}
          <Grid container spacing={2}>
            <CategoryList
              categories={filteredCategories}
              onClick={handleCategoryClick}
            />
          </Grid>

          <Dialog
            open={openCategoryDialog}
            onClose={handleCloseCategoryDialog}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              Service Types
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleCloseCategoryDialog}
                aria-label="close"
                sx={{ position: "absolute", right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <ServiceTypeList
                serviceTypes={serviceTypes}
                onClick={handleServiceTypeClick}
              />
            </DialogContent>
          </Dialog>
        </Grid>

        <Grid item xs={12} md={3} sx={{ padding: 2 }}>
          <ImageCarousel />
        </Grid>
      </Grid>

      <Box
        sx={{
          mt: 8,
          height: { xs: "200px", sm: "300px", md: "400px" },
          backgroundColor: "#e0e0e0",
          overflow: "hidden",
        }}
      >
        <img
          src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_1232,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1726491697663-0d6bab.jpeg"
          alt="Navbar placeholder"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.2s ease-in-out",
          }}
        />
      </Box>

      <Grid container spacing={2} sx={{ mt: 5 }}>
        <Grid item xs={12} md={6} sx={{ mt: 2 }}>
          <Box sx={{ textAlign: "center" }}>
            <img
              src={adGif}
              alt="Your GIF description"
              style={{
                width: "100%",
                maxHeight: { xs: "200px", sm: "300px", md: "400px" },
                objectFit: "contain",
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 2,
            }}
          >
            <img
              src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_233,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1651040419628-022a2b.jpeg"
              alt="Placeholder"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
