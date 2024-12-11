import React, { useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IconButton, Dialog, DialogContent } from "@mui/material";

interface SliderObjectsProps {
  urls: string[];
  id_product?: string | number;
  size?: number; // Aquí puedes asegurar que el tamaño sea un número
}

const SliderObjects: React.FC<SliderObjectsProps> = ({ urls, id_product, size = 120 }) => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const sliderRef = useRef<Slider | null>(null);

  const handleClickImage = (url: string) => {
    setSelectedImage(url);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div className="slider-container">
      {urls.length > 1 ? (
        <Slider {...settings} ref={sliderRef}>
          {urls.map((url, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: size,
                backgroundColor: "#5057f1",
                margin: "20px",
              }}
            >
              <img
                src={url}
                onClick={() => handleClickImage(url)}
                style={{
                  width: "100%", // Utilizar 100% para que la imagen se ajuste al contenedor
                  height: "auto", // Mantener la proporción
                  objectFit: "contain", // Asegurarse de que la imagen no se distorsione
                  borderRadius: "10%",
                  boxShadow: "4px 4px 16px rgba(0, 0, 0, 0.2)",
                  cursor: "pointer",
                }}
                alt={`Slide ${index}`}
              />
            </div>
          ))}
        </Slider>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: size,
            backgroundColor: "#f5f5f5",
          }}
        >
          <img
            src={urls[0]}
            onClick={() => handleClickImage(urls[0])}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
              borderRadius: "10%",
              boxShadow: "4px 4px 16px rgba(0, 0, 0, 0.2)",
              cursor: "pointer",
            }}
            alt="Single Image"
          />
        </div>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          style: {
            backgroundColor: "rgb(87 80 241/.2)",
            boxShadow: "10px 20px 30px rgba(0, 0, 0, 0.8)",
            borderRadius: "30px",
            width: "100%",
            height: "100%",
            border: "4px solid #000",
          },
        }}
        sx={{ backdropFilter: "blur(5px)" }}
      >
        <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
          <img
            src={selectedImage}
            style={{
              width: "auto",
              height: "auto",
              objectFit: "cover",
              borderRadius: "30px",
              boxShadow: "10px 20px 30px rgba(0, 0, 0, 0.8)",
              border: "3px dotted #000",
            }}
            alt="Expanded"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SliderObjects;
