import React from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";

const CategoryList = ({ categories, onClick }) => {
  return (
    <>
      {categories.map((category) => (
        <Grid item xs={12} sm={6} md={4} key={category._id}>
          <Card
            onClick={() => onClick(category._id)}
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
                src={category.image}
                alt={category.name}
                style={{
                  width: "100%",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "8px",
                }}
              />
              <Typography variant="h6" color="text.primary">
                {category.name}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </>
  );
};

export default CategoryList;
