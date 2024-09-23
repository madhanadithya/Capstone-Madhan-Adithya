import React from "react";
import { Box, Typography, Link, Grid, IconButton } from "@mui/material";
import { Twitter, Facebook, Instagram, LinkedIn } from "@mui/icons-material";
import AppleIcon from "@mui/icons-material/Apple";
import AndroidIcon from "@mui/icons-material/Android";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{ backgroundColor: "#f9f9f9", py: 4, mt: "auto" }}
    >
      <Grid container spacing={2} justifyContent="space-evenly">
        <Grid item xs={12} sm={3}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Company
          </Typography>
          {[
            "About us",
            "Terms & conditions",
            "Privacy policy",
            "Anti-discrimination policy",
            "UC impact",
            "Careers",
          ].map((text) => (
            <Link
              key={text}
              href="#"
              color="inherit"
              display="block"
              underline="hover"
            >
              {text}
            </Link>
          ))}
        </Grid>

        <Grid item xs={12} sm={3}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            For customers
          </Typography>
          {["UC reviews", "Categories near you", "Blog", "Contact us"].map(
            (text) => (
              <Link
                key={text}
                href="#"
                color="inherit"
                display="block"
                underline="hover"
              >
                {text}
              </Link>
            )
          )}
        </Grid>

        <Grid item xs={12} sm={3}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            For partners
          </Typography>
          <Link href="#" color="inherit" display="block" underline="hover">
            Register as a professional
          </Link>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Social links
          </Typography>
          <Box>
            <IconButton aria-label="Twitter" color="primary">
              <Twitter />
            </IconButton>
            <IconButton aria-label="Facebook" color="primary">
              <Facebook />
            </IconButton>
            <IconButton aria-label="Instagram" color="primary">
              <Instagram />
            </IconButton>
            <IconButton aria-label="LinkedIn" color="primary">
              <LinkedIn />
            </IconButton>
          </Box>
          <Box mt={2}>
            <IconButton href="#" color="inherit" sx={{ mr: 1 }}>
              <AppleIcon sx={{ fontSize: 40 }} />
            </IconButton>
            <IconButton href="#" color="inherit">
              <AndroidIcon sx={{ fontSize: 40 }} />
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      <Box mt={4} textAlign="center">
        <Typography variant="body2" color="textSecondary">
          © Copyright 2024 Urban Company. All rights reserved. | CIN:
          U74140DL2014PTC274413
        </Typography>
      </Box>
    </Box>
  );
};

const PageLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default PageLayout;
