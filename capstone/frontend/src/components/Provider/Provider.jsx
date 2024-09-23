import React, { useState } from "react";
import { AppBar, Tabs, Tab, Box } from "@mui/material";
import MyServices from "./MyServices";
import Orders from "./Orders";
import RegisterServiceForm from "./RegisterNewService";

const ProviderDashboard = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <AppBar
        position="static"
        sx={{
          bgcolor: "white",
          boxShadow: "none",
          // Responsive padding for mobile
          p: { xs: 1, sm: 2 },
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleChange}
          aria-label="provider dashboard tabs"
          sx={{
            "& .MuiTab-root": {
              color: "black",
              textTransform: "none",
              fontWeight: "bold",
              // Responsive font size
              fontSize: { xs: "0.875rem", sm: "1rem" },
            },
            "& .Mui-selected": {
              borderBottom: "2px solid blue",
              color: "blue",
            },
            "& .MuiTab-root:hover": {
              color: "blue",
            },

            ml: 50,
          }}
        >
          <Tab label="My Services" />
          <Tab label="Register New Service" />
          <Tab label="Orders" />
        </Tabs>
      </AppBar>
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: 1,

          mx: { xs: 1, sm: 2 },
        }}
      >
        {tabIndex === 0 && <MyServices />}
        {tabIndex === 1 && <RegisterServiceForm />}
        {tabIndex === 2 && <Orders />}
      </Box>
    </Box>
  );
};

export default ProviderDashboard;
