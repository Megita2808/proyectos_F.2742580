import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useJwt } from "./JWTContext";
import useDecodedJwt from "../hooks/useJwt";
import { json } from "react-router-dom";
import { URL_BACK } from "../assets/constants.d";
const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export default function CartProvider({ children }) {
  const { token } = useJwt();
  const payload = useDecodedJwt(token);
  const [cartData, setCartData] = useState([]);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const fetchCartData = async () => {
    setIsCartLoading(true);
    axios
      .get(
        `${URL_BACK}/pedidos/getPedidoById/${payload?.id}`,
        { headers: { "x-token": token } }
      )
      .then((res) => {
        setCartData(res.data);
        setIsCartLoading(false);
      });
  };
  useEffect(() => {
    setSubtotal(getSubtotal());
  }, [cartData]);
  const getSubtotal = () => {
    return cartData.reduce((a, b) => a + b.valorUnitario * b.cantidad, 0);
  };
  const emptyData = () => setCartData([]);

  const removeItem = (idPedido) => {
    setCartData((prev) => prev.filter((value) => value.idPedido !== idPedido));
    axios.delete(
      `${URL_BACK}/pedidos/deletePedido/${idPedido}`,
      { headers: { "x-token": token } }
    );
  };
  return (
    <CartContext.Provider
      value={{
        cartData,
        removeItem,
        subtotal,
        emptyData,
        fetchCartData,
        isCartLoading,
        setSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
