import React, { useState, useMemo, useEffect, useCallback } from 'react';
import ProductoSelectXmedidaProducto from '@/components/administrador/tablas/catalogo/selects/productoXmedidaProducto';
import InputFormato from '@/components/layaout/elementos/inputLog';
import { DataRowVenta, DetalleVenta ,DetalleVentaEnviar, MedidaVentaEnviar, MedidaProductoEnviar, MedidaProducto as MedidaProductoPersonalizado, MedidaVenta as MedidaVentaPersonalizado, Area, PesoPersonalizado as PesoPersonalizadoEnviar } from '@/components/administrador/tablas/tiposFilas/venta';
import { getMedidaProducto, MedidaProducto, MedidaVenta, PesoValor } from "@/service/api/catalogo/medidaProducto/TodoMedidaProductoConMedidasVenta";
import { getMedidasVenta, MedidaVenta as MedidaVentaTodoApi } from "@/service/api/catalogo/medidaVenta/TodoMedidaVenta";
import { getPreciosVenta, PrecioVenta as PrecioVentaInterfaceApi } from "@/service/api/precioVenta/TodoPrecioVenta";

import { PrecioVenta } from "../../tiposFilas/compra";
import { getPesos, Peso as interfacePeso } from "@/service/api/catalogo/peso/TodoPeso";
import { Trash2 } from 'lucide-react';

interface PreciosListProps {
  onSelect: (datosSelect: DetalleVentaEnviar) => void;
  DatoCompletosMedida: DetalleVentaEnviar;
}

const PrecioSelect: React.FC<PreciosListProps> = ({
  onSelect,
  DatoCompletosMedida
}) => {
  const [selectedSetIndex, setSelectedSetIndex] = useState<number | null>(null);
  const [tempEditedPrices, setTempEditedPrices] = useState<{ [key: number]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1;

  const [MedidaProductoSeleccionado, setSelectedMedidaProducto] = useState<MedidaProducto>();
  const [MedidaVentaSeleccionado, setSelectedMedidaVenta] = useState<MedidaVenta>();
  const [datosMedidaVenta, setDataMedidaVenta] = useState<MedidaVentaTodoApi[]>([]);
  const [datosMedidaProducto, setDataMedidaProducto] = useState<MedidaProducto[]>([]);
  const [datosPrecioVenta, setDataPrecioVenta] = useState<PrecioVentaInterfaceApi[]>([]);
  const [datosPeso, setDataPesos] = useState<interfacePeso[]>([]);

  const [ListaPesosUnicaMedida, setListaPesosUnicaMedida] = useState<interfacePeso[]>([]);

  const [longitudPersonalizada, setLontitudPersonalizada] = useState<number>();
  const [anchoPersonalizada, setAnchoPersonalizada] = useState<number>();
  const [pesoPersonalizado, setPesoPersonalizado] = useState<number>();

  const [CambioMedida, setCambioMedida] = useState<boolean>();
  const [UnidadMedidaBasePeso, setUnidadMedidaBasePeso] = useState<string>('gm');
  const [ProductoIdentificador, setProducto] = useState<string>('');
  const [PrecioVentaSeleccionado, setPrecioVentaSeleccionado] = useState<PrecioVenta>();
  const [PesoSeleccionado, setPesoVentaSeleccionado] = useState<interfacePeso>();

  const [cantidadNueva, setCantidadNueva] = useState<number>(0);
  const [totalNueva, setTotalNueva] = useState<number>(0);

  const getPrecioVenta = (precioVentaId: string) => {
    let precioVentaDatos = datosPrecioVenta.find((precioVentaUnico) => precioVentaUnico._id === precioVentaId)
    return precioVentaDatos 
  };

  const ObtenerDatosMedida =(IdentificadorMedida : string) => {
    const  medidaUnicaOProducto = datosMedidaVenta.find(medida => medida._id === IdentificadorMedida);
    if (!medidaUnicaOProducto && datosMedidaProducto){
      const extramedidaUnicaOProducto = datosMedidaProducto.find(medida => medida._id === IdentificadorMedida);
      return extramedidaUnicaOProducto
    }else{
      return medidaUnicaOProducto
    }
  };

  const handleSetSelect = (index: number) => {
    setSelectedSetIndex(index === selectedSetIndex ? null : index);
    setTempEditedPrices({});
    setProducto('');
    setSelectedMedidaProducto(undefined);
    setPrecioVentaSeleccionado(undefined);
    setCantidadNueva(0);
    setTotalNueva(0);
  };

  const handleDelete = (index: number) => {
    let updatedMedidasProducto = DatoCompletosMedida.medidasProducto || [];
    let updatedMedidasVenta = DatoCompletosMedida.medidasVenta || [];
  
    if (index < updatedMedidasProducto.length) {
      updatedMedidasProducto = updatedMedidasProducto.filter((_, i) => i !== index);
    } else {
      const adjustedIndex = index - updatedMedidasProducto.length;
      updatedMedidasVenta = updatedMedidasVenta.filter((_, i) => i !== adjustedIndex);
    }
  
    const updatedData: DetalleVentaEnviar = {
      medidasProducto: updatedMedidasProducto.length > 0 ? updatedMedidasProducto : null,
      medidasVenta: updatedMedidasVenta.length > 0 ? updatedMedidasVenta : null,
    };
  
    onSelect(updatedData);
  };

  const handleSaveEdit = useCallback(
    (selectedSetIndex: MedidaProductoEnviar | MedidaVentaEnviar | null) => {
      if (selectedSetIndex === null) return;
  
      const updatedMedidasProducto = DatoCompletosMedida.medidasProducto || [];
      const updatedMedidasVenta = DatoCompletosMedida.medidasVenta || [];
  
      const medidaUnicaOProducto = datosMedidaVenta.find(
        (medida) => medida._id === selectedSetIndex.medida
      );
  
      let updatedMedidas = 1;
      if (!medidaUnicaOProducto && datosMedidaProducto) {
        const extraMedidaUnicaOProducto = datosMedidaProducto.find(
          (medida) => medida._id === selectedSetIndex.medida
        );
        updatedMedidas = extraMedidaUnicaOProducto ? 2 : 1;
      } else {
        updatedMedidas = medidaUnicaOProducto ? 3 : 1;
      }
  
      const isProducto = updatedMedidas === 2 ? true : false;
      const isVenta = updatedMedidas === 3 ? true : false;
  
      const targetMedidas = isProducto
        ? updatedMedidasProducto
        : isVenta
        ? updatedMedidasVenta
        : null;
  
      if (!targetMedidas) return;
  
      const nuevaCantidad = cantidadNueva || selectedSetIndex.cantidad;
      const nuevoTotal = totalNueva || selectedSetIndex.total;
      const nuevoProducto = ProductoIdentificador || selectedSetIndex.producto;
      const nuevaMedida =
        MedidaProductoSeleccionado?._id ||
        MedidaVentaSeleccionado?._id ||
        selectedSetIndex.medida;
      const nuevoColor =
        PrecioVentaSeleccionado?.PrecioVenta.color._id || selectedSetIndex.color;
      const nuevoPeso =
        pesoPersonalizado
          ? {
              valor: pesoPersonalizado ? 
              pesoPersonalizado : typeof(selectedSetIndex.peso) === 'object' ? selectedSetIndex.peso.valor : 0,

              unidad: PrecioVentaSeleccionado ? 
              PrecioVentaSeleccionado?.PrecioVenta.unidadMedida._id : typeof(selectedSetIndex.peso) === 'object' ? selectedSetIndex.peso.unidad : '',
            }
          : PesoSeleccionado?._id || selectedSetIndex.peso;
      const nuevoNombreColor =
        PrecioVentaSeleccionado?.PrecioVenta.color.nombreColor ||
        selectedSetIndex.nombercolor;
      const nuevoPrecioVenta =
        PrecioVentaSeleccionado?.PrecioVenta._id || selectedSetIndex.precioVenta;
      const nuevaLongitud =
        anchoPersonalizada && longitudPersonalizada
          ? { ancho: anchoPersonalizada, largo: longitudPersonalizada }
          : selectedSetIndex.longitud;
  
      const existeDuplicado = targetMedidas.some(
        (item) =>
          item._id !== selectedSetIndex._id &&
          item.producto === nuevoProducto &&
          item.medida === nuevaMedida &&
          item.color === nuevoColor &&
          item.nombercolor === nuevoColor &&
          item.precioVenta === nuevoColor &&
          JSON.stringify(item.longitud) === JSON.stringify(nuevaLongitud) &&
          JSON.stringify(item.peso) === JSON.stringify(nuevoPeso)
      );
  
      if (existeDuplicado) {
        console.log('El registro editado es idéntico a otro registro existente.');
        return;
      }
  
      const updatedData = targetMedidas.map((item) => {
        if (item._id === selectedSetIndex._id && item.cantidad === selectedSetIndex.cantidad && item.color === selectedSetIndex.color && item.longitud === selectedSetIndex.longitud && item.medida === selectedSetIndex.medida && item.nombercolor === selectedSetIndex.nombercolor && item.peso === selectedSetIndex.peso && item.precioVenta === selectedSetIndex.precioVenta && item.producto === selectedSetIndex.producto && item.total === selectedSetIndex.total) {
          return {
            ...item,
            cantidad: nuevaCantidad,
            total: nuevoTotal,
            producto: nuevoProducto,
            medida: nuevaMedida,
            color: nuevoColor,
            peso: nuevoPeso,
            nombercolor: nuevoNombreColor,
            precioVenta: nuevoPrecioVenta,
            longitud: nuevaLongitud,
          };
        }
        return item;
      });
  
      const finalData: DetalleVentaEnviar = {
        medidasProducto:
          (isProducto && !MedidaVentaSeleccionado) || MedidaProductoSeleccionado
            ? updatedData
            : updatedMedidasProducto,
        medidasVenta:
          (isVenta && !MedidaProductoSeleccionado) || MedidaVentaSeleccionado
            ? updatedData
            : updatedMedidasVenta,
      };
      onSelect(finalData);
      setTempEditedPrices({});
      setSelectedSetIndex(null);
    },
    [
      DatoCompletosMedida,
      MedidaProductoSeleccionado,
      MedidaVentaSeleccionado,
      cantidadNueva,
      totalNueva,
      PrecioVentaSeleccionado,
      ProductoIdentificador,
      pesoPersonalizado,
      PesoSeleccionado,
      anchoPersonalizada,
      longitudPersonalizada,
    ]
  );
  
  const handleChangeCantidad = (e: React.ChangeEvent<HTMLInputElement>, totalAntigua: number, cantidaAntigua: number) => { 
    const value = Math.floor(Number(e.target.value));
    if (value > 0) {
      setCantidadNueva(value);
      if (!MedidaProductoSeleccionado && !MedidaVentaSeleccionado){
        const DatoTotal = totalAntigua / cantidaAntigua
        setTotalNueva(DatoTotal * value);
      }
    }
  };

  const handleChangeTotal = (e: React.ChangeEvent<HTMLInputElement>) => { 
    const value = Number(e.target.value);
    if (value > 0){
      setTotalNueva(value);
    }
  };

  const handleChangeProducto = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setProducto(e.target.value);
    setSelectedMedidaProducto(undefined);
    setPrecioVentaSeleccionado(undefined);
    let medidasUnicaOProducto = datosMedidaProducto.filter(medida => medida.producto.idProducto === e.target.value);
    if(medidasUnicaOProducto.length === 1){
      if(medidasUnicaOProducto[0].medidaVenta.length < 1){
        setSelectedMedidaProducto(medidasUnicaOProducto[0]);
        setSelectedMedidaVenta(undefined)
        setListaPesosUnicaMedida([])
        if(medidasUnicaOProducto[0]?.colores.length === 1 && (medidasUnicaOProducto[0].colores[0].PrecioVenta.unidadMedida)){
          setPrecioVentaSeleccionado({
            PrecioVenta: {
              _id: medidasUnicaOProducto[0].colores[0].PrecioVenta._id,
              precioUnitario: medidasUnicaOProducto[0].colores[0].PrecioVenta.precioUnitario.toString(),
              unidadMedida: medidasUnicaOProducto[0].colores[0].PrecioVenta.unidadMedida,
              color: {
                _id: medidasUnicaOProducto[0].colores[0].PrecioVenta.color._id,
                nombreColor: medidasUnicaOProducto[0].colores[0].PrecioVenta.color.nombreColor,
              },
            }
          })
        }
      }else{
        setSelectedMedidaProducto(undefined)
        setSelectedMedidaVenta(medidasUnicaOProducto[0].medidaVenta[0]);
        setListaPesosUnicaMedida([])
        if(medidasUnicaOProducto[0].medidaVenta[0]?.colores.length === 1 && medidasUnicaOProducto[0].medidaVenta[0].colores[0].PrecioVenta.unidadMedida){
          setPrecioVentaSeleccionado({
            PrecioVenta: {
              _id: medidasUnicaOProducto[0].medidaVenta[0].colores[0].PrecioVenta._id,
              precioUnitario: medidasUnicaOProducto[0].medidaVenta[0].colores[0].PrecioVenta.precioUnitario.toString(),
              unidadMedida: medidasUnicaOProducto[0].medidaVenta[0].colores[0].PrecioVenta.unidadMedida,
              color: {
                _id: medidasUnicaOProducto[0].medidaVenta[0].colores[0].PrecioVenta.color._id,
                nombreColor: medidasUnicaOProducto[0].medidaVenta[0].colores[0].PrecioVenta.color.nombreColor,
              },
            }
          })
        }
      }
    }else{
      setSelectedMedidaProducto(undefined)
      setSelectedMedidaVenta(undefined)
      setPrecioVentaSeleccionado(undefined)
      setLontitudPersonalizada(0)
      setAnchoPersonalizada(0)
      setPesoPersonalizado(0)
      setTotalNueva(0)
      setCantidadNueva(0)
      setListaPesosUnicaMedida([])
    }

  }, [datosMedidaProducto, ProductoIdentificador, MedidaProductoSeleccionado, MedidaVentaSeleccionado, PrecioVentaSeleccionado]);

  const handleChangeMedida = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {

    let medidaUnicaOProducto = datosMedidaProducto.find(medida => medida._id === e.target.value);
    let medidaUnicaVenta2
    if (!medidaUnicaOProducto) {
      medidaUnicaOProducto = datosMedidaProducto.find(medida => medida.medidaVenta.some( (medidaVentaUnica) => medidaVentaUnica._id === e.target.value));
      const medidaUnicaVenta = medidaUnicaOProducto?.medidaVenta
      if (medidaUnicaOProducto?.medidaVenta && medidaUnicaVenta){
        medidaUnicaVenta2 = medidaUnicaVenta?.find(medida => medida._id === e.target.value);
      }
    }

    if ((medidaUnicaOProducto && !medidaUnicaVenta2) && medidaUnicaOProducto.producto !== MedidaProductoSeleccionado?.producto){
      setSelectedMedidaVenta(undefined); 
    }else if (medidaUnicaVenta2 && !medidaUnicaOProducto){
      setSelectedMedidaProducto(undefined);
    }

    if(!medidaUnicaVenta2 ||( medidaUnicaVenta2 === null || undefined) && (!medidaUnicaOProducto?.medidaVenta || medidaUnicaOProducto?.medidaVenta.length === 0)){
      setSelectedMedidaProducto(medidaUnicaOProducto);
      if(medidaUnicaOProducto?.colores.length === 1 && medidaUnicaOProducto.colores[0].PrecioVenta.unidadMedida){
        setPrecioVentaSeleccionado({PrecioVenta: {
          _id: medidaUnicaOProducto.colores[0].PrecioVenta._id,
          precioUnitario: medidaUnicaOProducto.colores[0].PrecioVenta.precioUnitario.toString(),
          unidadMedida: medidaUnicaOProducto.colores[0].PrecioVenta.unidadMedida,
          color: {
            _id: medidaUnicaOProducto.colores[0].PrecioVenta.color._id,
            nombreColor: medidaUnicaOProducto.colores[0].PrecioVenta.color.nombreColor,
          },
        }})
      }
    }else{
      setSelectedMedidaVenta(medidaUnicaVenta2);
      if(medidaUnicaVenta2?.colores.length === 1 && medidaUnicaVenta2.colores[0].PrecioVenta.unidadMedida){
        setPrecioVentaSeleccionado({PrecioVenta: {
          _id: medidaUnicaVenta2.colores[0].PrecioVenta._id,
          precioUnitario: medidaUnicaVenta2.colores[0].PrecioVenta.precioUnitario.toString(),
          unidadMedida: medidaUnicaVenta2.colores[0].PrecioVenta.unidadMedida,
          color: {
            _id: medidaUnicaVenta2.colores[0].PrecioVenta.color._id,
            nombreColor: medidaUnicaVenta2.colores[0].PrecioVenta.color.nombreColor,
          },
        }})
      }
    }

    setCambioMedida(false)

  },[MedidaProductoSeleccionado, datosMedidaProducto]);

  const handleChangeLongitudPersonalizada = (e: React.ChangeEvent<HTMLInputElement>) => { 
    const value = Number(e.target.value);
    if (value > 0) {
      setLontitudPersonalizada(value);
    }
  };

  const handleChangeAnchoPersonalizado = (e: React.ChangeEvent<HTMLInputElement>) => { 
    const value = Number(e.target.value);
    if (value > 0) {
      setAnchoPersonalizada(value);
    }
  };

  const handleChangePesoPersonalizado = (e: React.ChangeEvent<HTMLInputElement>) => { 
    const value = Number(e.target.value);
    if (value > 0) {
      setPesoPersonalizado(value);
    }
  };

  const handleChangeColorPrecioVenta = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;

    const Color = datosPrecioVenta.find(precioVentaUnico => precioVentaUnico._id === selectedId );

    if (Color && Color !== undefined && Color.unidadMedida) {
      setPrecioVentaSeleccionado({PrecioVenta: {      
        _id: Color._id,
        precioUnitario: Color.precioUnitario.toString(),
        unidadMedida: Color.unidadMedida,
        color: {
          _id: Color.color._id,
          nombreColor: Color.color.nombreColor,
        }
      }});
    }
  };

  const handleChangePesoVenta = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;

    const PesoDatos = datosPeso.find(
      (peso) => peso._id === selectedId
    );

    if (PesoDatos && PesoDatos !== undefined) {
      setPesoVentaSeleccionado(PesoDatos);
    }
  };

  const handleUnidadBaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevaUnidad = e.target.value;
    setUnidadMedidaBasePeso(nuevaUnidad);
  };

  const ObtenerMedidaProducto =(IdentificadorMedida : string) => {
    const medidaUnicaOProducto = datosMedidaProducto.find(medida => medida.medidaVenta.some( (medidaVentaUnica) => medidaVentaUnica._id === IdentificadorMedida));
    return medidaUnicaOProducto?.longitudMedida.valor + ' ' + medidaUnicaOProducto?.longitudMedida.unidadMedida.simbolo
  };

  const ObtenerNombreProducto =(IdentificadorMedida : string) => {
    const medidaUnicaOProducto = datosMedidaProducto.find(medida => medida.medidaVenta.some( (medidaVentaUnica) => medidaVentaUnica._id === IdentificadorMedida));
    if (!medidaUnicaOProducto &&datosMedidaProducto){
      const extramedidaUnicaOProducto = datosMedidaProducto.find(medida => medida._id === IdentificadorMedida);
      return extramedidaUnicaOProducto?.producto.nombreProducto
    }else{
      return medidaUnicaOProducto?.producto.nombreProducto
    }
  };

  const ObtenerMedidaVenta =(IdentificadorMedidaVenta : string) => {
    const  medidaUnicaOProducto = datosMedidaVenta.find(medida => medida._id === IdentificadorMedidaVenta);
    if (!medidaUnicaOProducto && datosMedidaProducto){
      const extramedidaUnicaOProducto = datosMedidaProducto.find(medida => medida._id === IdentificadorMedidaVenta);
      return extramedidaUnicaOProducto?.longitudMedida.valor + ' ' + extramedidaUnicaOProducto?.longitudMedida.unidadMedida.simbolo
    }else{
      return medidaUnicaOProducto?.longitudMedida.valor + ' ' + medidaUnicaOProducto?.longitudMedida.unidadMedida.simbolo
    }
  };

  const ObtenerMedidaProductoLongitud =(IdentificadorMedidaVenta : string) => {
    const medidaUnicaOProducto = datosMedidaProducto.find(medida => medida.medidaVenta.some( (medidaVentaUnica) => medidaVentaUnica._id === IdentificadorMedidaVenta));
    return medidaUnicaOProducto?.longitudMedida.valor || 1
  };

  const convertirDecimalAFraccion = (valor: number): string => {
    const parteEntera = Math.floor(valor);
    const parteDecimal = valor - parteEntera;

    if (parteDecimal === 0) {
        return parteEntera.toString();
    }

    const decimalStr = parteDecimal.toString().split('.')[1];
    let denominador = Math.pow(10, decimalStr.length);
    let numerador = Math.round(parteDecimal * denominador);
    const calcularMCD = (a: number, b: number): number => {
        return b === 0 ? a : calcularMCD(b, a % b);
    };

    const mcd = calcularMCD(numerador, denominador);
    numerador /= mcd;
    denominador /= mcd;

    return parteEntera > 0 ? `${parteEntera} ${numerador}/${denominador}` : `${numerador}/${denominador}`;
  };

  const LimpiarDatos = () => {
    setProducto('')
    setSelectedMedidaProducto(undefined)
    setSelectedMedidaVenta(undefined)
    setPrecioVentaSeleccionado(undefined);
    setPesoVentaSeleccionado(undefined);
    setUnidadMedidaBasePeso('gm');
    setListaPesosUnicaMedida([]);
    setAnchoPersonalizada(undefined);
    setPesoPersonalizado(undefined);
    setLontitudPersonalizada(undefined);
    setCantidadNueva(0);
    setTotalNueva(0);
  };

  const CalcularTotal = (precioEntradaDato: string | undefined) => {
    let precioDatos: PrecioVenta | undefined
    if (!precioEntradaDato && PrecioVentaSeleccionado){
      precioDatos = PrecioVentaSeleccionado
    }else {
      const dato = datosPrecioVenta.find((precioVentaUnico) => {
        return precioVentaUnico._id == precioEntradaDato
      })
      
      if (dato){
        precioDatos = {
          PrecioVenta: {
            _id: dato._id,
            precioUnitario: dato.precioUnitario.toString(),
            unidadMedida: dato.unidadMedida,
            color: {
              _id: dato.color._id,
              nombreColor: dato.color.nombreColor,
            }
          }
        }
      }
    }
    if(precioDatos && ((cantidadNueva && cantidadNueva > 0) || (pesoPersonalizado && PrecioVentaSeleccionado && PrecioVentaSeleccionado.PrecioVenta.unidadMedida.simbolo === 'Kg'))){
      let total = 0;
      if (precioDatos.PrecioVenta.unidadMedida.simbolo === 'Kg' && ( pesoPersonalizado && pesoPersonalizado > 0)){
        total= pesoPersonalizado * Number(precioDatos.PrecioVenta.precioUnitario)
      }else if (precioDatos.PrecioVenta.unidadMedida.simbolo === 'Mt²' && (anchoPersonalizada && longitudPersonalizada) ){
        total= ((anchoPersonalizada * longitudPersonalizada) * Number(precioDatos.PrecioVenta.precioUnitario)) * cantidadNueva
      }else if (precioDatos.PrecioVenta.unidadMedida.simbolo === '½' ){
        if (MedidaProductoSeleccionado){
          total = ((MedidaProductoSeleccionado?.longitudMedida.valor * 2) * Number(precioDatos.PrecioVenta.precioUnitario) ) * cantidadNueva
        }else if (MedidaVentaSeleccionado){
          total = ((MedidaVentaSeleccionado?.longitudMedida.valor * 2) * Number(precioDatos.PrecioVenta.precioUnitario) * ObtenerMedidaProductoLongitud(MedidaVentaSeleccionado._id)) * cantidadNueva
        }
      }else if ((precioDatos.PrecioVenta.unidadMedida.simbolo === 'YD' || precioDatos.PrecioVenta.unidadMedida.simbolo === 'mt') && cantidadNueva){
        if (MedidaProductoSeleccionado){
          total= cantidadNueva * (Number(precioDatos.PrecioVenta.precioUnitario) * MedidaProductoSeleccionado?.longitudMedida.valor)
        }else if (MedidaVentaSeleccionado){
          total= cantidadNueva * (Number(precioDatos.PrecioVenta.precioUnitario) * MedidaVentaSeleccionado?.longitudMedida.valor)
        }
      }else if ((precioDatos.PrecioVenta.unidadMedida.simbolo === 'gm' || precioDatos.PrecioVenta.unidadMedida.simbolo === 'Kg' || precioDatos.PrecioVenta.unidadMedida.simbolo === 'Tn') || (anchoPersonalizada && longitudPersonalizada) ){
        if (PesoSeleccionado?.peso){
          total= (PesoSeleccionado?.peso * Number(precioDatos.PrecioVenta.precioUnitario)) * cantidadNueva
        }else if (anchoPersonalizada && longitudPersonalizada){
          total= ((anchoPersonalizada * longitudPersonalizada) * Number(precioDatos.PrecioVenta.precioUnitario)) * cantidadNueva
        }
      }
      setTotalNueva(total);
      if (precioEntradaDato && total){
        return total
      }else {
        return 0
      }
    }
  };

  const convertirYOrdenarPesos = useCallback ((pesos: any[] | undefined, unidadBase: string): any[] | undefined => {
    const conversiones: { [unidad: string]: number } = {
      gm: 1,
      Kg: 1000,
      Tn: 1000000,
    };
  
    if (!conversiones[unidadBase]) {
      console.error("Unidad base no soportada:", unidadBase);
      return [];
    }

    if (pesos){
   
      const pesosConvertidos = pesos.map((peso) => {
        const factor = conversiones[peso.unidadMedida?.simbolo || 'gm'] || 1;
        let valorConvertido
        if (peso.peso){
          valorConvertido = peso.peso * factor / conversiones[unidadBase];
        }else{
          valorConvertido = peso.valor.peso * factor / conversiones[unidadBase];
        }

        return {
          ...peso,
          pesoConvertido: valorConvertido,
        };
      });
      
      pesosConvertidos.sort((a, b) => a.pesoConvertido - b.pesoConvertido);
    
      if (pesosConvertidos[0] && pesosConvertidos[0].pesoConvertido < 1) {
        pesosConvertidos.sort((a, b) => b.pesoConvertido - a.pesoConvertido);
      }
      return pesosConvertidos;
    }

  },[UnidadMedidaBasePeso]);

  const fetchMedidasProducto = useCallback(async () => {
    try {
      const medidasProducto = await getMedidaProducto();
      setDataMedidaProducto(medidasProducto);
    } catch (error) {
      console.error('Error al obtener las medidas de producto:', error);
    }
  }, []);

  const fetchPrecioVenta = useCallback(async () => {
    try {
      const PreciosVenta = await getPreciosVenta();
      setDataPrecioVenta(PreciosVenta);
    } catch (error) {
      console.error('Error al obtener las medidas de producto:', error);
    }
  }, []);

  const fetchPesos = useCallback(async () => {
    try {
      const datosPeso = await getPesos();
      setDataPesos(datosPeso);
    } catch (error) {
      console.error('Error al obtener los pesos:', error);
    }
  }, []);

  const fetchMedidasVenta = useCallback(async () => {
    try {
      const datosMedidaVenta = await getMedidasVenta();
      setDataMedidaVenta(datosMedidaVenta);
    } catch (error) {
      console.error('Error al obtener los pesos:', error);
    }
  }, []);
  
  useEffect(() => {
    fetchPesos();
    fetchMedidasProducto();
    fetchPrecioVenta();
    fetchMedidasVenta();
  }, []);

  useEffect(() => {
    LimpiarDatos()
  }, [currentPage]);

  useEffect(() => {
    if (ProductoIdentificador !== '') {
      const medidaUnica = datosMedidaProducto.find(medida => medida.producto.idProducto === ProductoIdentificador);
      setSelectedMedidaProducto(medidaUnica || undefined);
      setCambioMedida(true)
    }
  }, [ProductoIdentificador, datosMedidaProducto]);

  useEffect(() => {
    if (datosPeso) {
      if ((MedidaProductoSeleccionado && MedidaProductoSeleccionado.peso.valores.length > 1) || (MedidaVentaSeleccionado && MedidaVentaSeleccionado.peso.valores.length > 1)) {
        let listaPesos: interfacePeso[] = []
        if (MedidaProductoSeleccionado && !MedidaVentaSeleccionado){
          const datos = MedidaProductoSeleccionado.peso.valores.map((pesoUnico) => {
            const encontrado = datosPeso.find((pesoDatoUnico) => {
              return pesoUnico._id === pesoDatoUnico._id;
            });
        
            return encontrado;
          });
          if (datos) {
            datos.forEach((dato) => {
              if (dato?.peso) {
                listaPesos.push(dato);
              }
            });
          }
        }else if (MedidaVentaSeleccionado && !MedidaProductoSeleccionado) {
          const datos = MedidaVentaSeleccionado.peso.valores.map((pesoUnico) => {
            const encontrado = datosPeso.find((pesoDatoUnico) => {
              return pesoUnico.valor._id == pesoDatoUnico._id;
            });
            return encontrado;
          });
          if (datos) {
            datos.forEach((dato) => {
              if (dato?.peso) {
                listaPesos.push(dato);
              }
            });
          }
        }
          
        if(listaPesos){
          setListaPesosUnicaMedida(listaPesos);
        }
      }
    }
  }, [MedidaProductoSeleccionado, MedidaVentaSeleccionado, datosPeso]);

  useEffect(() => {
    CalcularTotal(undefined);
  }, [PrecioVentaSeleccionado, cantidadNueva, MedidaProductoSeleccionado, PesoSeleccionado, pesoPersonalizado, anchoPersonalizada, longitudPersonalizada]);

  const getPaginatedItems = (
    medidasProducto: MedidaProductoEnviar[] | null,
    medidasVenta: MedidaVentaEnviar[] | null,
    currentPage: number,
    itemsPerPage: number
  ) => {
    const combinedData = [
      ...(medidasProducto || []),
      ...(medidasVenta || []),
    ];
  
    if (combinedData.length === 0) return [];

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    return combinedData.slice(indexOfFirstItem, indexOfLastItem);
  };

  const currentItems = getPaginatedItems(
    DatoCompletosMedida.medidasProducto,
    DatoCompletosMedida.medidasVenta,
    currentPage,
    itemsPerPage
  );

  return (
    <div className="precio-select-container">
      {DatoCompletosMedida && 
      (( DatoCompletosMedida.medidasProducto && DatoCompletosMedida.medidasProducto.length === 0) && ( DatoCompletosMedida.medidasVenta && DatoCompletosMedida.medidasVenta?.length === 0) )
       ? (
        <p>No hay precios seleccionados.</p>
      ) : (
        <>
          {currentItems.map((MedidaProductoCompleto, index) => {
            const precioActual = getPrecioVenta(MedidaProductoCompleto.precioVenta) || {};
            return (
              <div key={index} className={`precio-item ${selectedSetIndex === index ? 'expanded' : ''}`}>
                <button
                  onClick={() => handleSetSelect(index)}
                  className="precio-button"
                  style={{ width: '300px' }}
                >
                  {`
                  ${ 
                    typeof precioActual === 'object' && MedidaProductoCompleto._id ?
                    ObtenerNombreProducto(MedidaProductoCompleto._id) + ' - ' + ( MedidaProductoCompleto.longitud === 0 ? ObtenerMedidaVenta(MedidaProductoCompleto._id) : typeof(MedidaProductoCompleto.longitud) === 'object' ? (MedidaProductoCompleto.longitud.ancho * MedidaProductoCompleto.longitud.largo) + ' ' + getPrecioVenta(MedidaProductoCompleto.precioVenta)?.unidadMedida.simbolo : MedidaProductoCompleto.longitud) +' - ' + MedidaProductoCompleto.nombercolor
                   : 'N/A'}`}
                </button>
                

                {selectedSetIndex === index && (
                  <div className="precio-edit-form">
                    <label htmlFor="producto-select" className="LabelModal">Productos</label>
                    <ProductoSelectXmedidaProducto
                      datosMedidaProducto={datosMedidaProducto || []}
                      handleChangeProducto={handleChangeProducto}
                      ProductoSeleccionado={ProductoIdentificador === '' ? MedidaProductoCompleto?.producto : ProductoIdentificador || MedidaProductoCompleto.producto}
                    />

                    {(ProductoIdentificador !== '' || MedidaProductoCompleto.producto) && (
                      <>
                        <label htmlFor="medida-producto-select" className="LabelModal">Medidas de producto</label>
                        <select
                          id="medida-producto-select"
                          className="selectModal"
                          value={
                            MedidaProductoSeleccionado?._id && 
                            (!MedidaProductoSeleccionado.medidaVenta || MedidaProductoSeleccionado.medidaVenta.length === 0)  
                            ? 
                            MedidaProductoSeleccionado?._id 
                            : 
                            MedidaVentaSeleccionado?._id 
                            ||
                            MedidaProductoCompleto.medida
                          }
                          onChange={handleChangeMedida}
                        >
                          <option value="" disabled>Selecciona una medida producto</option>

                          {datosMedidaProducto
                            .filter(medidaProducto => medidaProducto.producto.idProducto === (ProductoIdentificador === '' ? MedidaProductoCompleto.producto : ProductoIdentificador))
                            .flatMap(medidaProducto => 
                              !medidaProducto.medidaVenta || medidaProducto.medidaVenta.length === 0
                                ? [{
                                    _id: medidaProducto._id,
                                    longitud: medidaProducto.longitudMedida?.valor || 0,
                                    unidad: medidaProducto.longitudMedida?.unidadMedida?.simbolo || '',
                                    producto: 0,
                                    tipo: 'producto',
                                  }]
                                : medidaProducto.medidaVenta.map(medidaVenta => ({
                                    _id: medidaVenta._id,
                                    longitud: medidaVenta.longitudMedida?.valor || 0,
                                    unidad: medidaVenta.longitudMedida?.unidadMedida?.simbolo || '',
                                    producto: ObtenerMedidaProductoLongitud(medidaVenta._id),
                                    tipo: 'venta',
                                  }))
                            )
                            .sort((a, b) => {
                              if (a.longitud !== b.longitud && a.unidad !== '½' && b.unidad !== '½') {
                                return a.longitud - b.longitud;
                              }
                            
                              if ( a.producto && b.producto && a.producto !== b.producto) {
                                return a.producto - b.producto;
                              }
                            
                              return 0;
                            })
                            .map(({ _id, longitud, unidad, tipo }) => (
                              <option key={_id} value={_id}>
                                {`${unidad === '½' ? convertirDecimalAFraccion(longitud) + ' x ' + ObtenerMedidaProducto(_id) : longitud + ' ' + unidad}  ${tipo === 'producto' ? '' : '(Medida venta)'}`}
                              </option>
                            ))}
                        </select>
                      </>
                    )}

                    {
                      (ProductoIdentificador !== '' || MedidaProductoCompleto.producto)
                      &&
                      (
                        (MedidaProductoSeleccionado && MedidaProductoSeleccionado.colores.length > 1) 
                        ||
                        (MedidaVentaSeleccionado && MedidaVentaSeleccionado.colores.length > 1) 
                        || 
                        ((ObtenerDatosMedida(MedidaProductoCompleto.medida)?.colores.length || 0) > 1 && ( !MedidaVentaSeleccionado && !MedidaProductoSeleccionado) )
                      ) 
                      && (
                      <>
                        <label htmlFor="precioVenta-select" className="LabelModal">Colores de medida</label>
                        <select
                          id="precioVenta-select"
                          className="selectModal"
                          value={PrecioVentaSeleccionado?.PrecioVenta._id || MedidaProductoCompleto.precioVenta }
                          onChange={handleChangeColorPrecioVenta}
                        >
                          <option value="" disabled>Selecciona un color</option>
                          {!MedidaProductoSeleccionado && !MedidaVentaSeleccionado ? (
                            ObtenerDatosMedida(MedidaProductoCompleto.medida)?.colores?.map((medidaProductoColor) => (
                              <option key={medidaProductoColor.PrecioVenta._id} value={medidaProductoColor.PrecioVenta._id}>
                                {medidaProductoColor.PrecioVenta.color.nombreColor}
                              </option>
                            ))
                          ) : MedidaVentaSeleccionado ? (
                            MedidaVentaSeleccionado.colores?.map((medidaProductoColor) => (
                              <option key={medidaProductoColor.PrecioVenta._id} value={medidaProductoColor.PrecioVenta._id}>
                                {medidaProductoColor.PrecioVenta.color.nombreColor}
                              </option>
                            ))
                          ) : MedidaProductoSeleccionado ? (
                            MedidaProductoSeleccionado.colores?.map((medidaProductoColor) => (
                              <option key={medidaProductoColor.PrecioVenta._id} value={medidaProductoColor.PrecioVenta._id}>
                                {medidaProductoColor.PrecioVenta.color.nombreColor}
                              </option>
                            ))
                          ) : null}
                        </select>
                      </>
                    )}

                    {((ProductoIdentificador !== '' || MedidaProductoCompleto.producto)
                      &&
                      (
                        ( MedidaProductoSeleccionado && MedidaProductoSeleccionado?.peso.valores.length > 1 ) 
                        || 
                        ( MedidaVentaSeleccionado && MedidaVentaSeleccionado?.peso.valores.length > 1 )
                        ||
                        ((ObtenerDatosMedida(MedidaProductoCompleto.medida)?.peso.valores.length || 0) > 1 && ( !MedidaVentaSeleccionado && !MedidaProductoSeleccionado))
                      ) 
                      &&
                      ListaPesosUnicaMedida && 
                      (
                        <>
                          <label htmlFor="precioVenta-select" className="LabelModal">Pesos de medida</label>
                          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                            <label>
                              <input
                                type="radio"
                                name="unidadBase"
                                value="gm"
                                checked={UnidadMedidaBasePeso === "gm"}
                                onChange={handleUnidadBaseChange}
                              />
                              Gramos (g)
                            </label>
                            <label>
                              <input
                                type="radio"
                                name="unidadBase"
                                value="Kg"
                                checked={UnidadMedidaBasePeso === "Kg"}
                                onChange={handleUnidadBaseChange}
                              />
                              Kilo (kg)
                            </label>
                            <label>
                              <input
                                type="radio"
                                name="unidadBase"
                                value="Tn"
                                checked={UnidadMedidaBasePeso === "Tn"}
                                onChange={handleUnidadBaseChange}
                              />
                              Tonelada (t)
                            </label>
                          </div>
                          <select
                            id="precioVenta-select"
                            className="selectModal"
                            value={
                              PesoSeleccionado?._id 
                              || 
                              (typeof MedidaProductoCompleto.peso === "string" 
                                  ? MedidaProductoCompleto.peso 
                                  : '')
                            }
                            onChange={handleChangePesoVenta}
                          >
                            <option value="" disabled>Selecciona un peso</option>
                            {convertirYOrdenarPesos(ListaPesosUnicaMedida.length === 0 ? ObtenerDatosMedida(MedidaProductoCompleto.medida)?.peso.valores : ListaPesosUnicaMedida ? ListaPesosUnicaMedida : ListaPesosUnicaMedida, UnidadMedidaBasePeso !== '' ? UnidadMedidaBasePeso : 'gm')?.map((PesoValor) => (
                              <option key={PesoValor.valor._id} value={PesoValor.valor._id}>
                                {PesoValor.pesoConvertido + ' ' + (UnidadMedidaBasePeso || "gm")}
                              </option>
                            ))}
                          </select>
                        </>
                      )
                    )}

                    {(
                      PrecioVentaSeleccionado?.PrecioVenta.unidadMedida.simbolo === 'Mt²' || 
                      (
                        getPrecioVenta(MedidaProductoCompleto.precioVenta)?.unidadMedida.simbolo === 'Mt²'
                        && 
                        (
                          (MedidaProductoCompleto.medida === MedidaProductoSeleccionado?._id || !MedidaProductoSeleccionado) 
                          || 
                          (MedidaProductoCompleto.medida === MedidaVentaSeleccionado?._id || !MedidaVentaSeleccionado)
                        )
                      ) 
                      && 
                      (
                        <>
                          <InputFormato nombreInput="Ancho" tipoInput="number" nameInput="ancho" handleChangeCantidad={handleChangeLongitudPersonalizada} valor={longitudPersonalizada || (typeof(MedidaProductoCompleto.longitud) === 'object' ? MedidaProductoCompleto.longitud.largo : 0)} />

                          <InputFormato nombreInput="Largo" tipoInput="number" nameInput="largo" handleChangeCantidad={handleChangeAnchoPersonalizado} valor={anchoPersonalizada || (typeof(MedidaProductoCompleto.longitud) === 'object' ? MedidaProductoCompleto.longitud.ancho : 0)} />
                        </>
                      )
                    )}
                    
                    {(
                      ( 
                        PrecioVentaSeleccionado 
                        && 
                        PrecioVentaSeleccionado?.PrecioVenta.unidadMedida.simbolo === 'Kg' )
                      || 
                      (
                        typeof(MedidaProductoCompleto.peso) === 'object' 
                        && 
                        MedidaProductoCompleto.peso.valor 
                        && 
                        MedidaProductoCompleto.peso.unidad
                      ) 
                      && (
                        <>
                          <InputFormato nombreInput="Kilogramos" tipoInput="number" nameInput="kilogramos" handleChangeCantidad={handleChangePesoPersonalizado} valor={pesoPersonalizado || (typeof(MedidaProductoCompleto.peso) === 'object' ? MedidaProductoCompleto.peso.valor : MedidaProductoCompleto.peso)} />
                        </>   
                      )
                    )}
                    
                    {(
                      (
                        ( PrecioVentaSeleccionado && PrecioVentaSeleccionado?.PrecioVenta.unidadMedida.simbolo !== 'Kg') 
                        || 
                        !(typeof(MedidaProductoCompleto.peso) === 'object') 
                      ) 
                      && (
                        <>
                        <InputFormato nombreInput="Cantidad" tipoInput="number" nameInput="cantidad" handleChangeCantidad={(e) => handleChangeCantidad((e), MedidaProductoCompleto.total, MedidaProductoCompleto.cantidad)} valor={MedidaProductoCompleto.cantidad !== cantidadNueva && cantidadNueva !== 0 ? cantidadNueva : MedidaProductoCompleto.cantidad} />
                        </>
                      )
                    )}

                    <InputFormato nombreInput="Total" tipoInput="number" nameInput="total" handleChangeCantidad={handleChangeTotal} valor={ totalNueva !== 0 && MedidaProductoCompleto.total !== totalNueva ? totalNueva: MedidaProductoCompleto.total} disabled={true}/>

                    <div className="edit-buttons">
                      <button onClick={() => (setSelectedSetIndex(index), handleSaveEdit(MedidaProductoCompleto))} className="save-button">Editar</button>
                      <button onClick={() => handleSetSelect(index)} className="cancel-button">Cancelar</button>
                      <button onClick={() => handleDelete(index)} className="delete-button"><Trash2 className="h-6 w-6 hover:text-red-600" /></button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      {(DatoCompletosMedida &&
        (
          (DatoCompletosMedida.medidasProducto?.length || 0) + 
          (DatoCompletosMedida.medidasVenta?.length || 0)
        ) > itemsPerPage && (
          <div className="pagination-container">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`pagination-button ${currentPage === 1 ? 'active' : ''}`}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <div style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <span>
              Página
              </span><br />
              <span>
                {currentPage} de {Math.ceil(((DatoCompletosMedida.medidasProducto?.length || 0) + (DatoCompletosMedida.medidasVenta?.length || 0)) / itemsPerPage)}
              </span>
            </div>
           
            <button
              onClick={() => {
                setCurrentPage((prev) =>
                  Math.min(
                    prev + 1,
                    Math.ceil(
                      ((DatoCompletosMedida.medidasProducto?.length || 0) +
                        (DatoCompletosMedida.medidasVenta?.length || 0)) /
                        itemsPerPage
                    )
                  )
                )
              }}
              className={`pagination-button ${
                currentPage === Math.ceil(((DatoCompletosMedida.medidasProducto?.length || 0) + (DatoCompletosMedida.medidasVenta?.length || 0)) / itemsPerPage)
                  ? 'active'
                  : ''
              }`}
              disabled={
                currentPage ===
                Math.ceil(
                  ((DatoCompletosMedida.medidasProducto?.length || 0) +
                    (DatoCompletosMedida.medidasVenta?.length || 0)) /
                    itemsPerPage
                )
              }
            >
              Siguiente
            </button>
          </div>
        )
      )}
      
    </div> 
  );
};

export default PrecioSelect;
