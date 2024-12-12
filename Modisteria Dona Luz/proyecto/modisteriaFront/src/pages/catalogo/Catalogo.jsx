import "./catalogo.css";
import { useState, useEffect } from "react";
import Metadata from "../../components/metadata/Metadata";
import Loading from "../../components/loading/Loading";
import useCatalogoData from "../../hooks/useCatalogo";
import Product from "../../components/producto/Producto";
import { ArrowRight, ArrowLeft } from "../../components/svg/Svg";
import useDebounce from "../../hooks/useDebounce";
import { ToastContainer } from "react-toastify";
import { formToCop } from "../../assets/constants.d";
import { Alert } from "../../components/svg/Svg";
import useCategoriaData from "../../hooks/useCategoriaData";
export default function Catalogo() {
  const [page, setPage] = useState(1);
  const [catalogoData, setCatalogoData] = useState(null);
  const [categoria, setCategoria] = useState(null);
  const [filterPrice, setFilterPrice] = useState(250000);
  const { debouncedValue } = useDebounce(filterPrice, 1000);
  const { fetchCatalagoData, isLoading, numberOfPages } = useCatalogoData(
    page,
    debouncedValue,
    categoria
  );
  const { initialFetchAllCategorias } = useCategoriaData();
  const handlePreviousPage = () => {
    if (page == 1) return;
    setPage((prev) => prev - 1);
  };
  const handleNextPage = () => {
    if (page === numberOfPages.length) return;
    setPage((prev) => prev + 1);
  };
  const handleFilterPrice = (e) => {
    e.preventDefault();
    if (e.target.value > 250000 || e.target.value < 1) return;
    setFilterPrice(e.target.value);
  };
  useEffect(() => {
    const fetchData = async () => {
      const response = await initialFetchAllCategorias();
      setCatalogoData(response.data);
    };
    fetchData();
  }, []);

  const handleCategoryChange = (e) => {
    setCategoria(e.target.value);
  };
  return (
    <>
      <Metadata title={"Catálogo - Modistería Doña Luz"}></Metadata>
      {isLoading && <Loading></Loading>}
      <h1>Catálogo</h1>
      <hr className="separacionCatalogo" />
      <section className="contenedorCatalogo">
        <div className="filtros">
          <h4>Filtrar por precio</h4>
          <h3>{formToCop(filterPrice)} COP</h3>
          <input
            type="range"
            value={filterPrice}
            min={5000}
            step={5000}
            onChange={handleFilterPrice}
            max={250000}
            className="range-category"
          />

          <h4>Filtrar por Categoría</h4>
          <div className="categorias">
            {catalogoData &&
              catalogoData.map((value) => (
                <div key={value.id}>
                  <label className="categoria-option">
                    <input
                      type="radio"
                      value={value.id}
                      onChange={handleCategoryChange}
                      name="categoria"
                    />
                    <span>{value.nombre}</span>
                  </label>
                </div>
              ))}
          </div>
        </div>

        {fetchCatalagoData?.length >= 1 ? (
          <div className="catalogo">
            {!isLoading &&
              fetchCatalagoData?.map((data) => (
                <Product key={data.id} isLoading={isLoading} data={data} />
              ))}
          </div>
        ) : (
          <div className="sinProductos">
            <span>Sin productos disponibles</span> <Alert size={"20"}></Alert>
          </div>
        )}
      </section>
      {fetchCatalagoData?.length >= 1 && (
        <div className="cPaginador">
          <ul className="paginador">
            <li onClick={handlePreviousPage}>
              <a>
                <ArrowLeft size={25}></ArrowLeft>
              </a>
            </li>
            {numberOfPages.map((value) => (
              <li
                className={value === page ? `active` : ""}
                key={value}
                onClick={() => {
                  setPage(value);
                }}
              >
                <a>{value}</a>
              </li>
            ))}
            <li onClick={handleNextPage}>
              <a>
                <ArrowRight size={25}></ArrowRight>
              </a>
            </li>
          </ul>
        </div>
      )}

      <ToastContainer></ToastContainer>
    </>
  );
}
