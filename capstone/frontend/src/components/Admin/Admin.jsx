import React, { useState } from "react";
import { Tabs, Tab, Typography, Box } from "@mui/material";
import Manage from "./Manage";
import Add from "./Add";
import Users from "./Users";

const Admin = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const renderContent = () => {
    switch (value) {
      case 0:
        return <Manage />;
      case 1:
        return <Add />;
      case 2:
        return <Users />;
      default:
        return <Manage />;
    }
  };

  return (
    <Box sx={{ mt: 4, mx: { xs: 1, sm: 2, md: 4 } }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="admin tabs"
        sx={{
          justifyContent: "center",
          "& .MuiTab-root": {
            bgcolor: "white",
            textTransform: "none",
            fontWeight: "bold",
            fontSize: { xs: "0.875rem", sm: "1rem" }, // Responsive font size
            minWidth: { xs: "80px", sm: "100px" }, // Ensure minimum width
          },
          "& .Mui-selected": {
            color: "blue",
            borderBottom: "2px solid blue",
          },
          ml: 56,
        }}
      >
        <Tab label="Manage" />
        <Tab label="Add" />
        <Tab label="Users" />
      </Tabs>

      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          bgcolor: "white",
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <Typography component="div">{renderContent()}</Typography>
      </Box>
    </Box>
  );
};

export default Admin;
