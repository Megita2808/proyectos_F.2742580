import React from "react";

interface Producto {
    idProducto: string;
    nombreProducto: string;
}

interface MedidaProducto {
    _id: string;
    producto: Producto;
}

interface Props {
  datosMedidaProducto: MedidaProducto[];
  ProductoSeleccionado?: string;
  handleChangeProducto: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ProductoSelect: React.FC<Props> = ({
  datosMedidaProducto,
  ProductoSeleccionado,
  handleChangeProducto,
}) => {
  const productosUnicos: MedidaProducto[] = [];
  const idsUnicos = new Set();

  datosMedidaProducto.forEach((medidaProducto) => {
    const idProducto = medidaProducto.producto?.idProducto;
    if (idProducto && !idsUnicos.has(idProducto)) {
      idsUnicos.add(idProducto);
      productosUnicos.push(medidaProducto);
    }
  });

  return (
    <select
      id="producto-select"
      className="selectModal"
      value={ProductoSeleccionado || ""}
      onChange={handleChangeProducto}
    >
      <option value="" disabled>
        Selecciona un producto
      </option>
      {productosUnicos.map((medidaProducto) => (
        <option key={medidaProducto.producto?.idProducto} value={medidaProducto.producto?.idProducto}>
          {medidaProducto.producto?.nombreProducto}
        </option>
      ))}
    </select>
  );
};

export default ProductoSelect;
