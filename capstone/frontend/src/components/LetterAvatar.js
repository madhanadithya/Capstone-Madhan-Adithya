import React from "react";
import { Box, Typography } from "@mui/material";

const LetterAvatar = ({ letters }) => {
  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        backgroundColor: "#1976d2",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        transition: "background-color 0.3s",
        "&:hover": {
          backgroundColor: "#145a86",
        },
      }}
    >
      <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
        {letters}
      </Typography>
    </Box>
  );
};

export default LetterAvatar;
