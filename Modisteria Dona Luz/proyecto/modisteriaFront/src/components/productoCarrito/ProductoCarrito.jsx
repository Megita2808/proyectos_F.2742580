import { useState, useEffect } from "react";
import { Trash } from "../svg/Svg";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import useDebounce from "../../hooks/useDebounce";
import axios from "axios";
import useIsFirstRender from "../../hooks/useIsMount";
import { useJwt } from "../../context/JWTContext";
import { formToCop, URL_BACK } from "../../assets/constants.d";
export default function ProductoCarrito({ data, changeSubtotal }) {
  const { token } = useJwt();
  const { removeItem } = useCart();
  const [cantidad, setCantidad] = useState(data.cantidad);
  const [precioInicial, setPrecioInicial] = useState(data.valorUnitario);
  const { debouncedValue } = useDebounce(cantidad, 2000);
  const isFirstRender = useIsFirstRender();
  useEffect(() => {
    if (isFirstRender) return;
    axios
      .put(
        `${URL_BACK}/pedidos/updatePedido/${data.idPedido}`,
        {
          cantidad: debouncedValue,
        },
        { headers: { "x-token": token } }
      )
      .then(() => {})
      .catch((msg) => {
        toast.error(msg, {
          autoClose: 222,
          toastId: "item-add-error",
        });
      });
  }, [debouncedValue]);

  const handleMinusOne = () => {
    if (cantidad <= 1) return;
    setCantidad(cantidad - 1);
    changeSubtotal((prev) => {
      return prev - precioInicial;
    });
  };

  const handlePlusOne = () => {
    setCantidad(cantidad + 1);
    changeSubtotal((prev) => {
      return prev + precioInicial;
    });
  };
  const handleRemove = () => {
    removeItem(data.idPedido);
    toast.success("Producto eliminado con éxito", {
      autoClose: 220,
      position: "top-left",
    });
  };
  // useEffect(() => {
  //   if (isFirstRender) return;
  //   setPrecioFinal(cantidad * precioInicial);
  // }, [precioInicial, cantidad]);
  return (
    <div className="itemCarrito">
      <div className="imgCarrito">
        <img
          src={data?.catalogo?.Imagens[0]?.url}
          alt=""
          className="imgCarrito"
        />
      </div>
      <div className="">
        <span>{data?.catalogo?.producto}</span>
        <span className="idPrenda" style={{ textTransform: "uppercase" }}>
          {data.Talla.nombre}
        </span>
      </div>
      <span>{formToCop(precioInicial * cantidad)}</span>
      <div className="amount">
        <span onClick={handleMinusOne} className="quantity-button">
          -
        </span>
        <span>{cantidad}</span>
        <span onClick={handlePlusOne} className="quantity-button">
          +
        </span>
      </div>

      <div onClick={handleRemove} className="trash">
        <Trash size={25}></Trash>
      </div>
    </div>
  );
}
