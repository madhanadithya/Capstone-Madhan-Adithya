import React from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";

const ServiceTypeList = ({ serviceTypes, onClick }) => {
  return (
    <Grid container spacing={2}>
      {serviceTypes.map((serviceType) => (
        <Grid item xs={12} sm={6} md={4} key={serviceType._id}>
          <Card
            onClick={() => onClick(serviceType._id)}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              transition: "0.3s",
              "&:hover": {
                boxShadow: 6,
              },
              border: "1px solid #ccc",
              height: "200px",
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <img
                src={serviceType.image}
                alt={serviceType.name}
                style={{
                  width: "100%",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "8px",
                }}
              />
              <Typography variant="h6" color="text.primary">
                {serviceType.name}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ServiceTypeList;
