import { useEffect, useState } from "react";
import { URL_BACK } from "../assets/constants.d";
export default function useCatalogoData(page,price,categoria) {
  const [isLoading, setIsLoading] = useState(false);
  const [fetchCatalagoData, setFetchCatalogoData] = useState(null);
  const [numberOfPages, setNumberOfPages] = useState([]);
  useEffect(() => {
    const url = categoria ?  `${URL_BACK}/catalogos/getAllCatalogo?page=${page}&price=${price}&category=${categoria}` :  `${URL_BACK}/catalogos/getAllCatalogo?page=${page}&price=${price}`
    const fetchCatalogo = async () => {
      setIsLoading(true);
      fetch(
        url
      )
        .then((res) => res.json())
        .then((data) => {
          setFetchCatalogoData(data.rows)
          const number = Math.ceil(data.count/9)
          setNumberOfPages(Array(number).fill(null).map((_, index) => index + 1))
          
         })
        .catch((err) => console.log(err))
        .finally(() => setIsLoading(false));
    };
    window.scrollTo({ 
      top: 0,  
      behavior: 'smooth'
    }); 
    fetchCatalogo();
  }, [page,price,categoria]);
  return { fetchCatalagoData, isLoading,numberOfPages };
}