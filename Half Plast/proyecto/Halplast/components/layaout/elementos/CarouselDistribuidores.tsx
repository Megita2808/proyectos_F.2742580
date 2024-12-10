/* eslint-disable @next/next/no-img-element */
// components/Carousel.tsx
"use client";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const CustomerCarousel = () => {
  const reviews = [
    { id: 1, name: "Distribuidor 1", review: "¡Nuestro distribuidor de la parte norte de medellin!", rating: 5, image: "/img/usuario/usuariosLogo.png" },
    { id: 2, name: "Distribuidor 2", review: "¡Nuestro distribuidor de la parte sur de medellin!", rating: 4, image: "/img/usuario/usuariosLogo.png" },
    { id: 3, name: "Distribuidor 3", review: "¡Nuestro distribuidor de la parte este de medellin!", rating: 5, image: "/img/usuario/usuariosLogo.png" },
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<span key={i} style={{ color: 'gold' }}>★</span>);
    }
    return stars;
  };

  return (
    <Carousel 
      autoPlay 
      interval={3000} 
      infiniteLoop 
      showThumbs={false}
      renderIndicator={(onClickHandler, isSelected, index, label) => {
        const style = isSelected ? { backgroundColor: 'blue' } : { backgroundColor: 'gray' };
        return (
          <li
            className="custom-indicator"
            style={{ ...style, display: 'inline-block', margin: '0 8px', cursor: 'pointer', borderRadius: '50%', width: '10px', height: '10px' }}
            key={index}
            onClick={onClickHandler}
            onKeyDown={onClickHandler}
            value={index}
            role="button"
            tabIndex={0}
            aria-label={`${label} ${index + 1}`}
          />
        );
      }}
    >
      {reviews.map((review) => (
      <div key={review.id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ marginRight: '20px' }}>
          <img src={review.image} alt={review.name} style={{ width: '20%', height: '20%', objectFit: 'cover' }} />
          <p>{review.review}</p>
          <div>{renderStars(review.rating)}</div>
          <p><strong>{review.name}</strong></p>
          <br /><br />
        </div>
        <div style={{ marginRight: '20px' }}>
          <img src={review.image} alt={review.name} style={{ width: '20%', height: '20%', objectFit: 'cover' }} />
          <p>{review.review}</p>
          <div>{renderStars(review.rating)}</div>
          <p><strong>{review.name}</strong></p>
          <br /><br />
        </div>
        <div style={{ marginRight: '20px' }}>
          <img src={review.image} alt={review.name} style={{ width: '20%', height: '20%', objectFit: 'cover' }} />
          <p>{review.review}</p>
          <div>{renderStars(review.rating)}</div>
          <p><strong>{review.name}</strong></p>
          <br /><br />
        </div>
      </div>
      ))}
    </Carousel>
  );
};

export default CustomerCarousel;
