/* eslint-disable @next/next/no-img-element */
// components/Gallery.tsx
import { Grid } from '@mui/material';

const Gallery = () => {
  const images = [
    { id: 1, src: "/img/aliados/Cordinadora.png", alt: "Envío 1" },
    { id: 2, src: "/img/aliados/interRapidisimo.png", alt: "Envío 2" },
    { id: 3, src: "/img/aliados/ServiEntrega.png", alt: "Envío 3" },
  ];

  return (
    <Grid container spacing={4} justifyContent="center" alignItems="center">
      {images.map((image) => (
        <Grid item xs={2} key={image.id}>
          <img src={image.src} alt={image.alt} style={{ width: '100%' }} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Gallery;
