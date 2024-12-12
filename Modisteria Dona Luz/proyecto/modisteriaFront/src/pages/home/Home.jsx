import Metadata from "../../components/metadata/Metadata";
import React, { useState, useEffect } from "react";
import "./home.css";
import { ToastContainer } from "react-toastify";
import { useJwt } from "../../context/JWTContext";
import { postSession, postsNoSession } from "../../assets/constants.d";
import formal from "/lineaFormal.png";
import casual from "/lineaCasual.png";
import deportiva from "/lineaDeportiva.png";
import accesorios from "/lineaAccesorios.png";
import infantil from "/lineaInfantil.png";
import temporada from "/lineaTemporada.png";

export default function Home() {
  const [postIndex, setPostIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const { token } = useJwt();
  const posts = token ? postSession : postsNoSession;
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          updatePostIndex();
          return 0;
        }
        return prevProgress + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [postIndex]);

  const updatePostIndex = () => {
    setPostIndex((prevIndex) => (prevIndex + 1) % posts.length);
  };

  const handlePostClick = (index) => {
    setProgress(0);
    setPostIndex(index);
  };

  return (
    <>
      <Metadata title={"Inicio"}></Metadata>

      <div className="carousel">
        <div className="progress-bar progress-bar--primary hide-on-desktop">
          <div
            className="progress-bar__fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <header className="main-post-wrapper">
          <div className="slides">
            {posts.map((post, index) => (
              <article
                key={index}
                className={`main-post ${
                  index === postIndex
                    ? "main-post--active"
                    : "main-post--not-active"
                }`}
              >
                <div className="main-post__image">
                  <img src={post.img} alt={post.title} loading="lazy" />
                </div>
                <div className="main-post__content">
                  <div className="main-post__tag-wrapper">
                    <span className="main-post__tag">{post.tag}</span>
                  </div>
                  <h1 className="main-post__title">{post.title}</h1>
                  <a className="main-post__link" href={post.link}>
                    <span className="main-post__link-text">
                      {post.linkText}
                    </span>
                    {post.type === "article" ? (
                      <svg
                        className="main-post__link-icon main-post__link-icon--arrow"
                        width="37"
                        height="12"
                        viewBox="0 0 37 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0 6H36.0001M36.0001 6L31.0001 1M36.0001 6L31.0001 11"
                          stroke="white"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="main-post__link-icon main-post__link-icon--play-btn"
                        width="30"
                        height="30"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="10"
                          cy="10"
                          r="9"
                          stroke="#C20000"
                          strokeWidth="2"
                        />
                        <path d="M14 10L8 6V14L14 10Z" fill="white" />
                      </svg>
                    )}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </header>

        <div className="posts-wrapper hide-on-mobile">
          {posts.map((post, index) => (
            <article
              key={index}
              className={`post ${index === postIndex ? "post--active" : ""}`}
              onClick={() => handlePostClick(index)}
            >
              <div className="progress-bar">
                <div
                  className="progress-bar__fill"
                  style={{ width: `${index === postIndex ? progress : 0}%` }}
                ></div>
              </div>
              <header className="post__header">
                <span className="post__tag">{post.tag}</span>
                <p className="post__published">{post.published}</p>
              </header>
              <h2 className="post__title">{post.title}</h2>
            </article>
          ))}
        </div>
      </div>

      <div className="seccion1">
        <div className="div1">
          <div className="contenido1">
            <h2 data-aos="fade-left">
              Redescubre tu estilo con prendas a medida
            </h2>
            <hr className="separacion1" />
            <p
              data-aos="fade-right"
              data-aos-offset="300"
              data-aos-easing="ease-in-sine"
            >
              ¡Renueva tu estilo y destaca con prendas hechas a tu medida!
              Agenda una cita con nuestra modista experta y transforma tus ideas
              en realidad.
            </p>

            <a href="cita">
              <button
                className="btn-registro"
                data-aos="fade-up"
                data-aos-anchor-placement="top-bottom"
                data-aos-delay="500"
              >
                <span>Agendar</span>
              </button>
            </a>
          </div>
        </div>
      </div>

      <div className="seccion2">
        <div className="div2">
          <div className="contenido2">
            <h2
              data-aos="fade-right"
              data-aos-offset="300"
              data-aos-easing="ease-in-sine"
            >
              Nuestro catálogo de ropa
            </h2>
            <hr className="separacion2" />
            <p data-aos="fade-up">
              ¡Descubre el estilo perfecto para cada momento! Explora nuestro
              catálogo de ropa y encuentra desde básicos versátiles hasta piezas
              únicas que reflejan tu personalidad.
            </p>
            <a href="cita">
              <button className="btn-registro" data-aos="fade-left">
                <span>Catálogo</span>
              </button>
            </a>
          </div>
        </div>
      </div>

      <section className="lineas">
        <span
          className="headerLinea"
          data-aos="fade-down"
          data-aos-duration="1000"
        >
          Nuestras Lineas
        </span>

        <div className="lineasContainer">
          <div
            className="linea deportiva"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            <div className="lineaOverlay">
              <div className="lineaContenido">
                <div className="iconoLinea">
                  <div className="iconoL">
                    <img src={deportiva} />
                  </div>
                </div>
                <span className="nombreLinea">Deportiva</span>
              </div>
            </div>
          </div>

          <div
            className="linea casual"
            data-aos="fade-down"
            data-aos-duration="1000"
          >
            <div className="lineaOverlay">
              <div className="lineaContenido">
                <div className="iconoLinea">
                  <div className="iconoL">
                    <img src={casual} />
                  </div>
                </div>
                <span className="nombreLinea">Casual</span>
              </div>
            </div>
          </div>

          <div
            className="linea formal"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            <div className="lineaOverlay">
              <div className="lineaContenido">
                <div className="iconoLinea">
                  <div className="iconoL">
                    <img src={formal} />
                  </div>
                </div>
                <span className="nombreLinea">Formal</span>
              </div>
            </div>
          </div>

          <div
            className="linea infantil"
            data-aos="fade-down"
            data-aos-duration="1000"
          >
            <div className="lineaOverlay">
              <div className="lineaContenido">
                <div className="iconoLinea">
                  <div className="iconoL">
                    <img src={infantil} />
                  </div>
                </div>
                <span className="nombreLinea">Infantil</span>
              </div>
            </div>
          </div>

          <div
            className="linea temporada"
            data-aos="fade-up"
            data-aos-duration="1000"
          >
            <div className="lineaOverlay">
              <div className="lineaContenido">
                <div className="iconoLinea">
                  <div className="iconoL">
                    <img src={temporada} />
                  </div>
                </div>
                <span className="nombreLinea">Temporada</span>
              </div>
            </div>
          </div>

          <div
            className="linea accesorios"
            data-aos="fade-down"
            data-aos-duration="1000"
          >
            <div className="lineaOverlay">
              <div className="lineaContenido">
                <div className="iconoLinea">
                  <div className="iconoL">
                    <img src={accesorios} />
                  </div>
                </div>
                <span className="nombreLinea">Accesorios</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer></ToastContainer>
    </>
  );
}
