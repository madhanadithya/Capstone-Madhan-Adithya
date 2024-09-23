import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";

const ImageCarousel = () => {
  const images = [
    "https://thumbs.dreamstime.com/b/gardener-keeping-spade-female-beautiful-garden-40883738.jpg",
    // "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_231,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1700137604899-896004.jpeg",
    // "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_231,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1700137613735-a7d95a.jpeg",
    // "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_231,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1700198936506-15c0e3.jpeg",
    // "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_231,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1700141800784-5ca077.jpeg",
    // "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_231,dpr_2,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1700142017541-7905b3.jpeg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000); 

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 2,
        boxShadow: 2,
        position: "relative",
      }}
    >
      <img
        src={images[currentImageIndex]}
        alt={`Advertisement ${currentImageIndex + 1}`}
        style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: 8 }}
      />
    </Box>
  );
};

export default ImageCarousel;
