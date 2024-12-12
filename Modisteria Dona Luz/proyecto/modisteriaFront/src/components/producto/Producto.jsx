import { Fragment, useRef } from "react";
import { useState, useEffect } from "react";
import { Cart, Info } from "../../components/svg/Svg";
import Modal from "../../components/modal/Modal";
import { toast } from "react-toastify";
import useDecodedJwt from "../../hooks/useJwt";
import axios from "axios";
import { useJwt } from "../../context/JWTContext";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { formToCop, URL_BACK } from "../../assets/constants.d";
export default function Product({ data, isLoading }) {
  const { token } = useJwt();
  const payload = useDecodedJwt(token);
  const navigate = useNavigate();
  const sliderSettings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 1500,

    autoplaySpeed: 1200,
    cssEase: "linear",
  };
  const [showModal, setShowModal] = useState(false);

  const [cantidad, setCantidad] = useState(1);
  const [title, setTitle] = useState("");
  const [sizes, setSizes] = useState([]);
  const [size, setSize] = useState();
  const [description, setDescription] = useState("");
  const [initialPrice, setInitialPrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const listRef = useRef();
  const listRefModal = useRef();
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  console.log(data);

  const pedidoAlreadyExists = async (catalogoId, talla) => {
    try {
      const response = await axios.get(
        `${URL_BACK}/pedidos/getPedidoById/${payload?.id}?catalogoId=${catalogoId}&tallaId=${talla}`,
        { headers: { "x-token": token } }
      );
      return response.data;
    } catch (err) {
      return err;
    }
  };
  useEffect(() => {
    console.log(size);
  }, [size]);

  const handleMinusOne = () => {
    if (cantidad == 1) return;
    setCantidad(cantidad - 1);
  };
  const handlePlusOne = () => {
    setCantidad(cantidad + 1);
  };
  const handleAddToCart = async () => {
    if (!size) {
      if (listRef.current) {
        const buttons = listRef.current.querySelectorAll(".item-list-button");
        buttons.forEach((button) => {
          button.classList.add("alarm");
        });
        setTimeout(() => {
          buttons.forEach((button) => {
            button.classList.remove("alarm");
          });
        }, 1000);
      }
      if (listRefModal.current) {
        const buttons =
          listRefModal.current.querySelectorAll(".item-list-button");
        buttons.forEach((button) => {
          button.classList.add("alarm");
        });
        setTimeout(() => {
          buttons.forEach((button) => {
            button.classList.remove("alarm");
          });
        }, 1000);
      }
      toast.error("Error, selecciona una talla!", {
        autoClose: 700,
        toastId: "error",
      });
      return;
    }
    if (!token) {
      toast.error("Inicia sesión para agregar al carrito!", {
        autoClose: 1000,
        toastId: "item-add",
        onClose: () => {
          navigate("/sesion");
        },
      });
      return;
    }
    console.log("size", size);
    const carritoData = {
      idPedido: uuidv4(),
      catalogoId: data.id,
      tallaId: size,
      precioFinal: finalPrice,
      cantidad: cantidad,
      catalogo: {
        producto: data.producto,
        precio: data.precio,
        Imagens: data.Imagens,
      },
      usuarioId: payload?.id,
    };
    const response = await pedidoAlreadyExists(data.id, size);
    console.log(response);
    response.length === 1
      ? axios
          .put(
            `${URL_BACK}/pedidos/updatePedido/${response[0].idPedido}`,
            {
              cantidad: response[0].cantidad + carritoData.cantidad,
              precioFinal: response[0].precioFinal + carritoData.precioFinal,
            },
            { headers: { "x-token": token } }
          )
          .then(() => {
            toast.success("Item actualizado con éxito! 😊", {
              autoClose: 222,
              toastId: "updateItem",
            });
          })
          .catch((msg) => {
            toast.error(msg, {
              autoClose: 222,
              toastId: "item-add-error",
            });
          })
      : axios
          .post(
            `${URL_BACK}/pedidos/createPedido`,
            carritoData,
            { headers: { "x-token": token } }
          )
          .then(() => {
            toast.success("Item agregado con éxito! 😊", {
              autoClose: 222,
            });
          })
          .catch((msg) => {
            toast.error(msg, {
              autoClose: 222,
              toastId: "item-add-error",
            });
          });
  };
  useEffect(() => {
    setFinalPrice(initialPrice * cantidad);
  }, [cantidad, initialPrice]);
  useEffect(() => {
    setTitle(data.producto);
    setSizes(data.Tallas);
    setDescription(data.descripcion);
    setInitialPrice(data.precio);
  }, []);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const timeoutId = setTimeout(() => {
        setIsAnimating(true);
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isLoading]);

  return (
    <Fragment>
      {" "}
      <div className={`card ${isAnimating ? "show" : ""}`}>
        <div className="image_container">
          <img src={data.Imagens[0]?.url} className=" image_container" />
        </div>
        <div className="title">
          <span>{title}</span>
        </div>
        <div className="size">
          <span>Tallas</span>
          <ul ref={listRef} className="list-size">
            {sizes.map((valueSize, idx) => (
              <li key={idx} className="item-list">
                <button
                  style={{ textTransform: "uppercase" }}
                  onClick={() => {
                    console.log(valueSize.id);
                    setSize(valueSize.id);
                  }}
                  className={`item-list-button ${
                    valueSize.id === size ? "active" : ""
                  }`}
                >
                  {valueSize.nombre}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="action">
          <div className="price">
            <span>{formToCop(finalPrice)}</span>
          </div>
          <div className="quantity ">
            <span onClick={handleMinusOne} className="quantity-button">
              -
            </span>
            <span>{cantidad}</span>
            <span onClick={handlePlusOne} className="quantity-button">
              +
            </span>
          </div>
          <button className="btnAccion" onClick={toggleModal}>
            <span>
              <Info></Info>
            </span>
          </button>
          <button onClick={handleAddToCart} className="btnAccion">
            <span>
              <Cart color={"#fff"}></Cart>
            </span>
          </button>
        </div>
      </div>
      <Modal
        show={showModal}
        onClose={toggleModal}
        className="modalDetalle"
        customWidth="800px"
      >
        <section className="contenedorDetalle">
          <div className="imageDetalle">
            {data.Imagens.length === 1 ? (
              <img src={data.Imagens[0].url} className="imageDetalle" />
            ) : (
              <Slider {...sliderSettings}>
                {data.Imagens.map((imagen) => (
                  <img src={imagen.url} className="imageDetalle" />
                ))}
              </Slider>
            )}
          </div>
          <div className="infoDetalle">
            <span className="tituloPrenda">{title}</span>
            <br /><br />
            <span className="precioDetalle">{formToCop(finalPrice)}</span>
            <br />
            <br />
            <div className="detalleDetalle">
              <span>Detalles:</span>
              <p>{description}</p>
            </div>
            <div className="size">
              <span>Tallas:</span>
              <ul ref={listRefModal} className="list-size">
                {sizes.map((valueSize, idx) => (
                  <li key={idx} className={`item-list`}>
                    <button
                      style={{ textTransform: "uppercase" }}
                      onClick={() => {
                        setSize(valueSize.id);
                      }}
                      className={`item-list-button ${
                        valueSize.id === size ? "active" : ""
                      }`}
                    >
                      {valueSize.nombre}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="accionesDetalle">
              <div className="quantity-detalle ">
                <span onClick={handleMinusOne} className="quantity-button">
                  -
                </span>
                <span>{cantidad}</span>
                <span onClick={handlePlusOne} className="quantity-button">
                  +
                </span>
              </div>
              <button onClick={handleAddToCart} className="btnAccionDetalle">
                <span>
                  <Cart color={"#fff"}></Cart>
                </span>
              </button>
            </div>
          </div>
        </section>
      </Modal>
    </Fragment>
  );
}
