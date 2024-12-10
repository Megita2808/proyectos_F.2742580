/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useDispatch } from "react-redux";
import { agregarProducto } from "@/redux/slice/carritoCompra";
import Modal from 'react-modal'
import React, { useState, useEffect, useCallback } from "react";
import { motion, Variants } from "framer-motion";
import { Categoria, Producto, MedidaProducto, PrecioVenta, Colores,  } from '@/components/administrador/tablas/tiposFilas/catalogo';
import { ShoppingCart } from "lucide-react";
import { green } from "@mui/material/colors";
import { Console } from "console";

import { getPesos, Peso as interfacePeso } from "@/service/api/catalogo/peso/TodoPeso";

const modalVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.3,
    x: "-50%", 
    y: "-50%",
    transition: { delay: 5 }
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    x: "-50%", 
    y: "-50%",
    transition: { 
      type: "spring", 
      stiffness: 600, 
      damping: 60,
      delay: 5
    }
  },
  exit: {
    opacity: 0, 
    scale: 0.8,
    transition: { duration: 0.3, delay: 5 }
  }
};

const trailVariants = {
  hidden: {
    scale: 0,
    opacity: 0
  },
  visible: {
    scale: [0, 5, 20],
    opacity: [1, 0.5, 0],
    transition: { 
      duration: 0.6, 
      ease: "easeOut" 
    }
  },
};

type CustomChangeEvent = {
  target: { value: string };
  simbolo: string;
};

const Catalogo = () => {

  const dispatch = useDispatch();
  const [isSelecting, setIsSelecting] = useState(false);

  const [datosPeso, setDataPesos] = useState<interfacePeso[]>([]);

  const [LongitudCuadradaSeleccionadoValor, setSelectedLongitudCuadradaValor] = useState<{parte1: number ; parte2: number }>({parte1: 0, parte2: 0});
  
  const [coloresMedidaproductoLista, setColoresMedidaproductoLista] = useState<Colores[]>([]);
  const [MedidaProductoLista, setMedidaproductoLista] = useState<MedidaProducto[]>([]);

  const [TipoProducto, setTipoProducto] = useState<number>(0);

  const [ProductoNombreSeleccionado, setSelectedProductoNombre] = useState<string>('');
  const [ProductoLogitudSeleccionado, setSelectedProductoLongitudValor] = useState<number>(0);
  const [ProductoLongitudSeleccionadoSimbolo, setSelectedSimboloProducto] = useState<string>('');
  const [PrecioSeleccionado, setSelectedPrecio] = useState<number>(0);
  const [PrecioSeleccionadoId, setSelectedPrecioId] = useState<string>('');
  const [PrecioSeleccionadoSimbolo, setSelectedPrecioSimbolo] = useState<string>('');
  const [LongitudSeleccionadoValor, setSelectedLongitudValor] = useState<number>(0);
  const [LongitudSeleccionadoSimbolo, setSelectedLongitudSimbolo] = useState<string>('');
  const [ColorSeleccionadoId, setSelectedColorId] = useState<string>('');
  const [ColorSeleccionadoNombre, setSelectedColorNombre] = useState<string>('');
  const [PesoSeleccionado, setSelectedPeso] = useState<number>(0);
  const [PesoSimboloSeleccionado, setSelectedPesoSimbolo] = useState<string>('');
  const [CantidadIndicada, setCantidad] = useState<number>(0);
  const [PesoSeleccionadoId, setSelectedPesoId] = useState<string>('');

  const [ProductoLogitudSeleccionadoMaximo, setSelectedProductoLongitudValorMaximo] = useState<number>(0);
  const [ProductoSeleccionadoId, setSelectedProductoId] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCondinal, setCondinal] = useState(false);

  const [imagenSeleccionada, setImagenActual] = useState<{ imagen: string; identificadorMedidaVenta: string }>({ imagen: '', identificadorMedidaVenta: '' });
  const [animationKey, setAnimationKey] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [openCardId, setOpenCardId] = useState<string>('');
  const [valorFormateado, setValorFormateado] = useState<string>('');

  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });

  const [catalogo, setCatalogo] = useState<Categoria[]>([]);
  const [filters, setFilters] = useState({
    categoria: '',
    producto: '',
    medida: '',
    color: '',
  });
  
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
  const [medidasFiltradas, setMedidasFiltradas] = useState<MedidaProducto[]>([]);
  const [coloresFiltrados, setColoresFiltrados] = useState<string[]>([]);

  const [areaCalculada, setAreaCalculada] = useState<number>(0);
  const [haSuperadoMaximo, setHaSuperadoMaximo] = useState<boolean>(false);

  const fetchPesos = useCallback(async () => {
    try {
      const datosPeso = await getPesos();
      setDataPesos(datosPeso);
    } catch (error) {
      console.error('Error al obtener los pesos:', error);
    }
  }, []);

  const ObtenerDatosPesoAndSet =(IdentificadorPeso : string) => {
    const pesoUnico = datosPeso.find(datoPeso => datoPeso._id === IdentificadorPeso);
    if (pesoUnico && pesoUnico?.unidadMedida){
      setSelectedPeso(pesoUnico?.peso)
      setSelectedPesoSimbolo(pesoUnico?.unidadMedida?.simbolo)
      setSelectedPesoId(pesoUnico?._id)
      return pesoUnico;
    }else{
      return '';
    }
  };

  const ObtenerDatosPesoUnicoSimbolo = (IdentificadorPeso : string) => {
    const pesoUnico = datosPeso.find(datoPeso => datoPeso._id === IdentificadorPeso);
    if (pesoUnico && pesoUnico?.unidadMedida){
      return pesoUnico.unidadMedida.simbolo;
    }else{
      return '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let longitudIngresarMedida
    let longitudIngresarProducto

    if (ProductoLogitudSeleccionadoMaximo != 0 && areaCalculada != 0){
      if (ProductoLogitudSeleccionadoMaximo < areaCalculada) {
        longitudIngresarMedida = ProductoLogitudSeleccionadoMaximo
        longitudIngresarProducto = ProductoLogitudSeleccionadoMaximo
      }else if (areaCalculada){
        longitudIngresarMedida = areaCalculada
        longitudIngresarProducto = areaCalculada
      }else{
        return false;
      }
    }else{
      longitudIngresarMedida = LongitudSeleccionadoValor
      longitudIngresarProducto = ProductoLogitudSeleccionado
    }
    
    let cantidad =  CantidadIndicada
    if (PrecioSeleccionadoSimbolo === 'Kg'){
      cantidad = 1;
    }

    let longitud: number | { parte1: number; parte2: number } = longitudIngresarMedida;

    if (LongitudCuadradaSeleccionadoValor.parte1 !== 0 && LongitudCuadradaSeleccionadoValor.parte2 !== 0) {
      longitud = LongitudCuadradaSeleccionadoValor;
    }

    if (cantidad === 0){
      return false;
    } 
    let identificadorProducto = ''
    if (productosFiltrados.find(productoFiltadro => productoFiltadro._id === ProductoSeleccionadoId)) {
      if (medidasFiltradas.length > 1) {
        const unicaMedida = medidasFiltradas.find(medidaFiltrada => medidaFiltrada.longitudMedida.valor === LongitudSeleccionadoValor); 
        if(unicaMedida){
          identificadorProducto = unicaMedida?._id
        }
      }else{
        identificadorProducto = medidasFiltradas[0]._id
      }
    }else{
      identificadorProducto = ProductoSeleccionadoId
    }

    let datoPeso
    let datoSimboloPeso
    let datoIdPeso

    if((PesoSeleccionadoId && PesoSeleccionadoId !== '') && (!PesoSimboloSeleccionado || PesoSimboloSeleccionado === '' || PesoSimboloSeleccionado === 'sin simbolos') && (!PesoSeleccionado || PesoSeleccionado === 0)){
      datoPeso = 0
      datoSimboloPeso = ''
      datoIdPeso = ''
    }else{
      datoPeso = PesoSeleccionado
      datoSimboloPeso = PesoSimboloSeleccionado
      datoIdPeso = PesoSeleccionadoId
    }
    const nuevoProducto = {
      idProducto: identificadorProducto,
      idColor: ColorSeleccionadoId,
      idPeso: datoIdPeso,
      longitudProducto: longitudIngresarProducto,
      longitudProductoSimbolo: ProductoLongitudSeleccionadoSimbolo,
      productoNombre: ProductoNombreSeleccionado,
      longitud: longitud,
      simboloLongitud: LongitudSeleccionadoSimbolo,
      peso: datoPeso,
      simboloPeso: datoSimboloPeso,
      colorNombre: ColorSeleccionadoNombre,
      cantidad: cantidad,
      precioUnitario: PrecioSeleccionado,
      simboloprecioUnitario: PrecioSeleccionadoSimbolo,
      identificadorPrecio: PrecioSeleccionadoId,
      tipoProducto: TipoProducto,
    };
    
    dispatch(agregarProducto(nuevoProducto));
    setOpenCardId('');
    setCondinal(false);
    limpiarDatos();
    closeModal();
  };
  
  const handleToggleCard = (cardId: string) => {
    if (isModalOpen !== true) {
      if (openCardId === cardId) {
        setOpenCardId('');
      } else {
        if (medidasFiltradas != null && medidasFiltradas.length > 0) {
          const medidaSeleccionada = medidasFiltradas.find((medida) =>
            medida.medidaVenta.some((MedidaVenta) => MedidaVenta._id === cardId)
          );
          const medidaVentaSeleccionada = medidaSeleccionada?.medidaVenta.find(
            (MedidaVenta) => MedidaVenta._id === cardId
          );
        
          const colorActual = medidaVentaSeleccionada?.colores[0];
        
          if (colorActual) {
            setImagenActual({
              imagen: colorActual.imagen,
              identificadorMedidaVenta: cardId,
            });
        
            if (medidaSeleccionada?.longitudMedida) {
              setSelectedProductoLongitudValor(medidaSeleccionada.longitudMedida.valor || 0);
              setSelectedSimboloProducto(medidaSeleccionada.longitudMedida.unidadMedida.simbolo || "Sin simbolo");
            }
        
            if (medidaVentaSeleccionada?.longitudMedida) {
              setSelectedLongitudValor(medidaVentaSeleccionada.longitudMedida.valor || 0);
              setSelectedLongitudSimbolo(medidaVentaSeleccionada.longitudMedida.unidadMedida.simbolo || "Sin simbolo");
            }
            if (filters.producto && medidasFiltradas.length > 0 && medidasFiltradas[0].medidaVenta.length > 0) {
              setSelectedProductoNombre(filters.producto );
            }
            setSelectedPrecio(Number(colorActual.PrecioVenta.precioUnitario));
            setSelectedPrecioId(colorActual.PrecioVenta._id);
            setSelectedPrecioSimbolo(colorActual.PrecioVenta.unidadMedida.simbolo);
            setSelectedColorId(colorActual.PrecioVenta.color._id);
            setSelectedColorNombre(colorActual.PrecioVenta.color.nombreColor);
          }
        
          setOpenCardId(cardId);
          calcularPrecio();
        }
      }
    }
  };

  const handleAddToCart = (cardId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    setTipoProducto(2)
    event.stopPropagation();
    
    setSelectedProductoId(cardId);
    setCondinal(true);
    
    const rect = event.currentTarget.getBoundingClientRect();
    setButtonPosition({ x: rect.left + rect.width / 2, y: rect.top });
    
    setIsModalOpen(true);
  };

  const handleChangeColor = (e: React.ChangeEvent<HTMLSelectElement>, idMedidaVenta: string) => {
    if ( e.target.name === 'IdentificarColorModal') {
      const [selectedColorId, selectedPrecioUnitario, identificadorPrecio] = e.target.value.split('|');
      const selectedColorNombre = e.target.options[e.target.selectedIndex].text

      const medidasOrdenadas = MedidaProductoLista
      .sort((a, b) => a.longitudMedida.valor - b.longitudMedida.valor)
      .filter(a => 
        a.colores.some(color => color.PrecioVenta.color._id.toString() === selectedColorId)
      );

      const medidaMasPequena = medidasOrdenadas[0]; 

      if ((!LongitudSeleccionadoValor && !LongitudSeleccionadoSimbolo) || ((LongitudSeleccionadoValor && LongitudSeleccionadoSimbolo) && !medidasOrdenadas.find(medidaUnica => medidaUnica.longitudMedida.valor === LongitudSeleccionadoValor && medidaUnica.longitudMedida.unidadMedida.simbolo === LongitudSeleccionadoSimbolo))){
        setSelectedLongitudValor(medidaMasPequena.longitudMedida.valor)
        setSelectedLongitudSimbolo(medidaMasPequena.longitudMedida.unidadMedida.simbolo)
      }

      console.log(selectedColorId)
      console.log(selectedColorNombre)
      console.log(selectedPrecioUnitario)

      setSelectedColorId(selectedColorId)
      setSelectedColorNombre(selectedColorNombre)
      setSelectedPrecio(Number(selectedPrecioUnitario))
      setSelectedPrecioId(identificadorPrecio)
    }else {
      const [selectedColorId, selectedPrecioUnitario, identificadorPrecio] = e.target.value.split('|');
      
      const colorActual = medidasFiltradas.find((medida) => medida.medidaVenta.some((MedidaVenta) => 
        MedidaVenta._id === idMedidaVenta))
        ?.medidaVenta.find((MedidaVenta) => MedidaVenta._id === idMedidaVenta)
        ?.colores.find((color) => color._id === selectedColorId);
  
      if (colorActual) {
        setImagenActual({
          imagen: colorActual.imagen,
          identificadorMedidaVenta: idMedidaVenta,
        });

        setSelectedPrecio(Number(colorActual.PrecioVenta.precioUnitario))
        setSelectedPrecioId(colorActual.PrecioVenta._id)
        setSelectedPrecioSimbolo(colorActual.PrecioVenta.unidadMedida.simbolo);
        
        setSelectedColorId(colorActual.PrecioVenta.color._id)
        setSelectedColorNombre(colorActual.PrecioVenta.color.nombreColor)
      }
    }
  };

  const handleChangePeso = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectedPesoId(value)
  };

  const handleChangePesoModal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value && Number(value)){
      setSelectedPeso(Number(value));
      calcularPrecio();
    }
  };
  
  const handleChangeLongitudProducto = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (Number(value) !== PesoSeleccionado) {
      
      const MedidaUnica = MedidaProductoLista.find((medida) => {
        return medida.longitudMedida.valor === Number(value) && medida.colores.find(color => color.PrecioVenta.color._id === ColorSeleccionadoId)
      })

      setSelectedLongitudValor(Number(value));

      setSelectedPrecio(
        Number(
          MedidaUnica?.colores
            .find(color => color.PrecioVenta.color._id === ColorSeleccionadoId)
            ?.PrecioVenta.precioUnitario
        ) || Number(MedidaUnica?.colores[0]?.PrecioVenta.precioUnitario) || 0
      );
      
      setSelectedPrecioId(
        MedidaUnica?.colores
          .find(color => color.PrecioVenta.color._id === ColorSeleccionadoId)
          ?.PrecioVenta._id
          || MedidaUnica?.colores[0]?.PrecioVenta._id || ''
      );

      setSelectedPrecioSimbolo(
        MedidaUnica?.colores
          .find(color => color.PrecioVenta.color._id === ColorSeleccionadoId)
          ?.PrecioVenta.unidadMedida.simbolo
          || MedidaUnica?.colores[0]?.PrecioVenta.unidadMedida.simbolo || ''
      );

      calcularPrecio();
    }
  };

  const handleChangeFiltroButton = (zona: string, identificador : string, dato : string,) => {
    if (zona === 'limpiar') {
      limpiarFiltros();
    } else {
      if (zona === 'categoria') {
        const categoriaSeleccionada = catalogo.find((cat) => cat.nombreCategoria === dato);
        if (categoriaSeleccionada) {
          setFilters((prevFilters) => ({
            ...prevFilters,
            categoria: categoriaSeleccionada.nombreCategoria,
            producto: '',
            medida: '',
            color: '',
          }));
          setProductosFiltrados(categoriaSeleccionada.productos);
          setMedidasFiltradas([]);
          setColoresFiltrados([]);
        }
      } else if (zona === 'producto') {
        const productoSeleccionado = productosFiltrados.find((prod) => prod._id === identificador);

        if (productoSeleccionado?.medidaProducto[0].medidaVenta.length === 0) {
          setTipoProducto(1)
          setSelectedColorId('')
          setSelectedProductoId(productoSeleccionado._id)
          setSelectedProductoNombre(productoSeleccionado.nombreProducto)
          setMedidaproductoLista(productoSeleccionado.medidaProducto)
          const coloresProductoUnicos = [
            ...new Map(
              productoSeleccionado.medidaProducto
                .flatMap((medida) => medida.colores)
                .map((precioVenta) => [
                  `${precioVenta.PrecioVenta.precioUnitario}-${precioVenta.PrecioVenta.color.nombreColor}`,
                  precioVenta
                ])
            ).values()
          ];

          setColoresMedidaproductoLista(coloresProductoUnicos)
          const medidasOrdenadas = productoSeleccionado.medidaProducto.sort(
            (a, b) => a.longitudMedida.valor - b.longitudMedida.valor
          );
          const medidaMasPequena = medidasOrdenadas[0]; 

          const medidaMasGrande = medidasOrdenadas[medidasOrdenadas.length - 1];

          setSelectedSimboloProducto(medidaMasPequena.longitudMedida.unidadMedida.simbolo)

          setSelectedProductoLongitudValorMaximo(medidaMasGrande.longitudMedida.valor || 0);

          setSelectedColorNombre(medidaMasPequena?.colores[0]?.PrecioVenta.color.nombreColor || "Sin color")
          setSelectedColorId(medidaMasPequena?.colores[0]?.PrecioVenta.color._id || "Sin color")

          setSelectedLongitudValor(Number(medidaMasPequena.longitudMedida.valor))          
          setSelectedLongitudSimbolo(medidaMasPequena.longitudMedida.unidadMedida.simbolo)  

          setSelectedPrecio(Number(medidaMasPequena.colores[0]?.PrecioVenta.precioUnitario))                  
          setSelectedPrecioId(medidaMasPequena.colores[0]?.PrecioVenta._id)          
          setSelectedPrecioSimbolo(medidaMasPequena.colores[0]?.PrecioVenta.unidadMedida.simbolo);
          setIsModalOpen(true);

          if (productoSeleccionado) {
            setMedidasFiltradas(productoSeleccionado.medidaProducto);
          }
        }
        else {  
          if (productoSeleccionado) {
            setMedidasFiltradas(productoSeleccionado.medidaProducto);
          }

          const productoSeleccionado2 = productosFiltrados.find((cat) => cat._id === identificador);
          const medidasSeleccionadas = productoSeleccionado2?.medidaProducto || [];
  
          if (medidasSeleccionadas) {
            setFilters((prevFilters) => ({
              ...prevFilters,
              producto: dato,
              medida: '',
              color: '',
            }));
            setMedidasFiltradas(medidasSeleccionadas);
            setColoresFiltrados([]);
          }
        }
      }
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAnimationKey((prevKey) => prevKey + 1);
  
    if (value === 'limpiar') {
      limpiarFiltros();
      return;
    }
  
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  
    if (name === 'categoria') {
      const categoriaSeleccionada = catalogo.find((cat) => cat.nombreCategoria === value);
      if (categoriaSeleccionada) {
        setProductosFiltrados(categoriaSeleccionada.productos);
      }
      setFilters({ categoria: value, producto: '', medida: '', color: '' });
      setMedidasFiltradas([]);
      setColoresFiltrados([]);
      setSelectedPrecio(0);
      setSelectedPeso(0);
    }
  
    if (name === 'producto') {
      const productoSeleccionado = productosFiltrados.find((prod) => prod.nombreProducto === value);
      if (productoSeleccionado) {
        setMedidasFiltradas(productoSeleccionado.medidaProducto);
      }
      setFilters((prevFilters) => ({ ...prevFilters, producto: value, medida: '', color: '' }));
      setColoresFiltrados([]);
      setSelectedPrecio(0);
      setSelectedPeso(0);
    }
  
    if (name === 'medida') {
      const medidaSeleccionada = medidasFiltradas.find(
        (medida) => medida.colores[0]?.PrecioVenta.unidadMedida.nombre === value
      );
      if (medidaSeleccionada) {
        const coloresUnicos: string[] = Array.from(
          new Set([medidaSeleccionada.colores[0]?.PrecioVenta.color.nombreColor])
        );
        setColoresFiltrados(coloresUnicos);
      }
      setFilters((prevFilters) => ({ ...prevFilters, medida: value, color: '' }));
    }
  
    if (name === 'color') {
      setFilters((prevFilters) => ({ ...prevFilters, color: value }));
    }
  };

  const handleChangeLongitudCuadrada = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setSelectedLongitudCuadradaValor((prevState) => ({
      ...prevState,
      [name]: parseFloat(value),
    }));
  };

  const limpiarDatos = useCallback(() => {
    setSelectedProductoLongitudValorMaximo(0)
    setSelectedColorId('')
    setColoresMedidaproductoLista([]);
    setMedidaproductoLista([]);
    setSelectedPrecio(0);
    setCantidad(0);
    setSelectedPesoId('');
    setSelectedPesoSimbolo('');
    setSelectedPeso(0);
    setAreaCalculada(0);
    setSelectedSimboloProducto('')
    setSelectedProductoLongitudValor(0)
    setSelectedLongitudCuadradaValor({parte1: 0, parte2: 0});
  },[]);

  const limpiarFiltros = () => {
    setFilters({
      categoria: '',
      producto: '',
      medida: '',
      color: '',
    });
    setSelectedPeso(0)
    setProductosFiltrados([]);
    setMedidasFiltradas([]);
    setColoresFiltrados([]);
    document.querySelectorAll('select').forEach((select) => {
      select.value = '';
    });
  };

  const calcularPrecio = () => {
    let valor

    if ( PesoSeleccionado != 0 ) {
      valor = `$ ${(PrecioSeleccionado * (PesoSeleccionado)).toLocaleString('es-CO', {
        minimumFractionDigits: 0,
      })} pesos`;
    }else if (LongitudSeleccionadoValor && MedidaProductoLista.length === 0){
      valor = `$ ${(PrecioSeleccionado * ((LongitudSeleccionadoValor * 2) *  ProductoLogitudSeleccionado)).toLocaleString('es-CO', {
        minimumFractionDigits: 0,
      })} pesos`;
    }else if (MedidaProductoLista.length > 0 && LongitudSeleccionadoValor) {
      valor = `$ ${(PrecioSeleccionado * LongitudSeleccionadoValor *  CantidadIndicada).toLocaleString('es-CO', {
        minimumFractionDigits: 0,
      })} pesos`;
    }else{
      valor = `$ ${PrecioSeleccionado.toLocaleString('es-CO', {
        minimumFractionDigits: 0,
      })} pesos`;
    }
    setValorFormateado(valor);
  }

  const calcularPrecioModalCantidad = () => { 
    let valor
    if (coloresMedidaproductoLista.length > 1){
      valor = (LongitudSeleccionadoValor * PrecioSeleccionado) * CantidadIndicada 
    }else if ((MedidaProductoLista.length > 0 && LongitudSeleccionadoSimbolo === 'Mt²' && PrecioSeleccionadoSimbolo !== 'Kg')) {
      valor = (areaCalculada * PrecioSeleccionado) * CantidadIndicada 
    }else if (PrecioSeleccionadoSimbolo === 'Kg') {
      valor = (PesoSeleccionado * PrecioSeleccionado) 
    }else {
      if ( PesoSeleccionado != 0 ) {
        valor = (PrecioSeleccionado * (PesoSeleccionado)) * CantidadIndicada
      }else if (LongitudSeleccionadoValor && MedidaProductoLista.length === 0) {
        valor = (PrecioSeleccionado * ((LongitudSeleccionadoValor * 2) *  ProductoLogitudSeleccionado))  * CantidadIndicada
      }else if (MedidaProductoLista.length > 0 && LongitudSeleccionadoValor) {
        valor = PrecioSeleccionado * LongitudSeleccionadoValor * CantidadIndicada
      }else{
        valor = PrecioSeleccionado  * CantidadIndicada
      }
    }
    return valor;
  }

  const Pesobase = (buscadorId: string, identificador: string) => {
    let datoMedida;
    if (identificador) {
      datoMedida = medidasFiltradas.find((medidaProducto) => medidaProducto._id === identificador);
    }

    if (!PesoSeleccionadoId || PesoSeleccionadoId === 'vacio' || PesoSeleccionadoId === '' && identificador.length > 0) {
      const primerPeso =
        medidasFiltradas[0].medidaVenta[0].peso.valores.find((peso) => peso.valor.peso === 100) ||
        medidasFiltradas[0].medidaVenta[0].peso.valores[0];

      const unidadMedida = medidasFiltradas[0].medidaVenta[0].peso.unidadMedida;

      if (primerPeso) {
        const customEvent: CustomChangeEvent = {
          target: { value: String(primerPeso.valor.peso) },
          simbolo: unidadMedida.simbolo,
        };
  
        handleChangePeso(
          customEvent as unknown as React.ChangeEvent<HTMLSelectElement>,
        );
        setSelectedPesoId(primerPeso._id);
      }
    } else { 
      const primerPeso = medidasFiltradas[0].medidaVenta[0].peso.valores.find(
        (peso) => peso._id === buscadorId
      );
      if (primerPeso) {
        const customEvent: CustomChangeEvent = {
          target: { value: String(primerPeso.valor.peso) },
          simbolo: medidasFiltradas[0].medidaVenta[0].peso.unidadMedida.simbolo,
        };

        handleChangePeso(
          customEvent as unknown as React.ChangeEvent<HTMLSelectElement>,
        );

        setSelectedPesoId(primerPeso._id);
      } else {
        setSelectedPesoId("vacio");
      }
    }
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setCondinal(false);
    setSelectedColorId('')
    setTipoProducto(0)
    setSelectedProductoLongitudValor(0)
    if (setMedidaproductoLista.length > 0) {
      setColoresMedidaproductoLista([])
      setMedidaproductoLista([]);
      setSelectedPrecio(0);
      setCantidad(0);
      setSelectedPesoId('')
      setSelectedPesoSimbolo('')
      setSelectedPeso(0)  
      setSelectedLongitudCuadradaValor({parte1: 0, parte2: 0});
      setAreaCalculada(0);
      setSelectedProductoLongitudValorMaximo(0)
      setSelectedSimboloProducto('')
    }
    setOpenCardId('');
  }, []);

  useEffect(() => {
    const storedCatalogo = localStorage.getItem('catalogo');
    if (storedCatalogo) {
      try {
        const parsedCatalogo: Categoria[] = JSON.parse(storedCatalogo);
        setCatalogo(parsedCatalogo);
      } catch (error) {
        console.error('Error parsing catalogo from localStorage:', error);
      }
    }
  }, []);
  
  useEffect(() => {
    if (PesoSeleccionado === 0 && medidasFiltradas?.length > 0 && isModalOpen !== true) {
      const primeraMedidaVenta = medidasFiltradas[0]?.medidaVenta;
      
      if (primeraMedidaVenta?.length > 0 && LongitudSeleccionadoSimbolo !== '½') {
        const primerPeso = primeraMedidaVenta[0]?.peso?.valores?.find(
          (peso) => peso.valor.peso === 100
        );
        const unidadMedida = primeraMedidaVenta[0]?.peso?.unidadMedida;
        setSelectedPeso(primerPeso?.valor.peso || 0);
        setSelectedPesoId(primerPeso?.valor._id || "sin simbolos");
        setSelectedPesoSimbolo(unidadMedida?.simbolo || "sin simbolos");
      }
    }
  
    if (medidasFiltradas?.length > 0 && medidasFiltradas[0]?.medidaVenta) {
      calcularPrecio();
    }
  }, [medidasFiltradas, PesoSeleccionado, LongitudSeleccionadoValor, PrecioSeleccionado]);
  
  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  useEffect(() => {
    if (MedidaProductoLista){
      const area = LongitudCuadradaSeleccionadoValor.parte1 * LongitudCuadradaSeleccionadoValor.parte2;

      if (area > ProductoLogitudSeleccionadoMaximo) {
        setHaSuperadoMaximo(true);

        const timeoutId = setTimeout(() => {
          const factorCorreccion = Math.sqrt(ProductoLogitudSeleccionadoMaximo / area);
          const parte1Corregido = Math.floor(LongitudCuadradaSeleccionadoValor.parte1 * factorCorreccion);
          const parte2Corregido = Math.floor(LongitudCuadradaSeleccionadoValor.parte2 * factorCorreccion);

          setSelectedLongitudCuadradaValor({ parte1: parte1Corregido, parte2: parte2Corregido });
          setAreaCalculada(parte1Corregido * parte2Corregido);
          setHaSuperadoMaximo(false);
        }, 2000);

        return () => clearTimeout(timeoutId);
      } else {
        setAreaCalculada(area);
        setHaSuperadoMaximo(false);
      }
    }
  }, [LongitudCuadradaSeleccionadoValor, ProductoLogitudSeleccionadoMaximo, MedidaProductoLista]);
  
  useEffect(() => {
    let valor = LongitudSeleccionadoValor
    if (valor === 0) {
      valor
    }

    calcularPrecio();
  }, [LongitudSeleccionadoValor, coloresMedidaproductoLista.length > 0, MedidaProductoLista]);

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

  useEffect(() => {
    fetchPesos();
  }, []);

  useEffect(() => {
    if (PesoSeleccionadoId){
      ObtenerDatosPesoAndSet(PesoSeleccionadoId);
    }
  }, [handleChangePeso, handleChangePesoModal]);

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex">
          <div className="w-1/4 pr-4">
            <h2 className="font-bold text-lg mb-4">Filtrar por</h2>
            <div className="mb-4">
              <label className="block font-medium mb-2">Categoría</label>
              <select
                name="categoria"
                value={filters.categoria}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="" disabled>Selecciona una categoría</option>
                {catalogo.map((categoria) => (
                  <option key={categoria._id} value={categoria.nombreCategoria}>
                    {categoria.nombreCategoria}
                  </option>
                ))}
              </select>
            </div>
            {filters.categoria && (
              <div className="mb-4">
                <label className="block font-medium mb-2">Producto</label>
                <select
                  name="producto"
                  value={filters.producto}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Selecciona un producto</option>
                  {productosFiltrados.map((producto) => (
                    <option key={producto._id} value={producto.nombreProducto}>
                      {producto.nombreProducto}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <button
              className="w-full text-white p-2 mt-4 rounded-md buttonCatalogo"
              onClick={limpiarFiltros}
              name='limpiar'
              value='limpiar'
              style={{backgroundColor: '#ffb1ac'}}
            >
              Limpiar filtro
            </button>
          </div>
          <div className="w-3/4">
            <div className={`grid gap-4 
              ${ 
                productosFiltrados.length === 0 || 
                (
                  catalogo.length <= 3 
                    && 
                  medidasFiltradas.every(medidaFiltrada => medidaFiltrada.medidaVenta.length === 0)
                )
                ?
                'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 
                (
                  productosFiltrados.length <= 3 
                    ? 
                  'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' 
                    : 
                  'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                )

              }`}>
              
              {!filters.categoria && catalogo.map((categoria) => (
                <motion.div
                  key={categoria._id + '-' + 'categoria'}
                  className="border p-3 rounded-lg shadow-lg bg-white flex flex-col items-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleChangeFiltroButton('categoria', categoria._id , categoria.nombreCategoria)}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    onLoad={() => setIsLoaded(true)} 
                  >
                    <img
                      src={categoria.imagenCategoria}
                      alt={categoria.nombreCategoria}
                      className="w-60 h-32 object-cover mb-4 rounded-md"
                      style={{ margin: '0 auto', marginBottom: "20px" }}
                    />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-lg font-semibold mb-2 text-center"
                  >
                    {categoria.nombreCategoria}
                  </motion.h3>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="border p-3 rounded-lg shadow-lg bg-white w-full"
                  >
                    <p className="text-gray-700 mb-2 text-center">
                      {categoria.productos.map((producto) => (
                        <span key={producto._id} className="block">
                          {producto.nombreProducto}
                        </span>
                      ))}
                    </p>
                  </motion.div>
                </motion.div>
              ))}

              {!filters.producto && productosFiltrados.map((producto) => (
                <motion.div
                  key={producto._id + '-' + 'productos'}
                  className="border p-3 rounded-lg shadow-lg bg-white"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleChangeFiltroButton('producto', producto._id , producto.nombreProducto)}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    onLoad={() => setIsLoaded(true)} 
                  >
                    <img
                      src={producto.imagenProducto}
                      alt={producto.nombreProducto}
                      className="w-60 h-32 object-cover mb-4 rounded-md"
                      style={{ margin: '0 auto', marginBottom: "20px" }}
                    />
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-lg font-semibold mb-2 text-center"
                  >
                    {producto.nombreProducto}
                  </motion.h3>
                  {!producto.medidaProducto.some(medida => medida.longitudMedida.unidadMedida.simbolo === 'Unic') && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="border p-3 rounded-lg shadow-lg bg-white"
                    >
                      <p className="text-gray-700 mb-2 text-center">{producto.medidaProducto.length > 1 ? "Medidas" : 'Medida \n\n se vende por ' + producto.medidaProducto[0].colores[0]?.PrecioVenta.unidadMedida.simbolo}</p>
                      <div className="grid grid-cols-2 mb-2 text-center gap-2">
                        {[
                          ...producto.medidaProducto, 
                          ...producto.medidaProducto.flatMap(mp => mp.medidaVenta)
                        ]
                          .sort((a, b) => a.longitudMedida.valor - b.longitudMedida.valor)
                          .filter((medida, index, self) =>
                            index === self.findIndex(m =>
                              m.longitudMedida.valor === medida.longitudMedida.valor &&
                              m.longitudMedida.unidadMedida.simbolo === medida.longitudMedida.unidadMedida.simbolo
                            )
                          )
                          .reduce<{ simboloEspecial: any[]; otrasMedidas: any[] }>(
                            (acc, medida) => {
                              acc.simboloEspecial.push(medida);
                              return acc;
                            },
                            { simboloEspecial: [] as MedidaProducto[], otrasMedidas: [] as MedidaProducto[] }
                          )
                          .simboloEspecial.reduce<{ _id: string; longitudMedida: { valor: number; unidadMedida: { simbolo: string } } }[][]>(
                            (rows, medida, index, array) => {
                              const prevMedida = array[index - 1];
                          
                              if (prevMedida && prevMedida.longitudMedida.unidadMedida.simbolo !== medida.longitudMedida.unidadMedida.simbolo) {
                                rows.push([medida]);
                              } else {
                                if (rows.length === 0 || rows[rows.length - 1].length === 2) {
                                  rows.push([medida]);
                                } else {
                                  rows[rows.length - 1].push(medida);
                                }
                              }
                              return rows;
                            },
                            []
                          )
                          .map((row, rowIndex) => (
                            <React.Fragment key={rowIndex}>
                              {row.map(medida => {
                                const productoAsociado = producto.medidaProducto.find(mp =>
                                  mp.medidaVenta.some(mv => mv._id === medida._id)
                                );
                                return (
                                  <span
                                    key={medida._id}
                                    className={`block ${row.length === 1 ? 'col-span-2 text-center' : ''}`}
                                  >
                                    {medida.longitudMedida.unidadMedida.simbolo === "½" && productoAsociado
                                      ? `${convertirDecimalAFraccion(medida.longitudMedida.valor)} pulgada`
                                      : `${medida.longitudMedida.valor} ${medida.longitudMedida.unidadMedida.simbolo}`
                                    }
                                  </span>
                                );
                              })}
                            </React.Fragment>
                          ))
                        }                 
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}

              {!filters.medida && medidasFiltradas && medidasFiltradas  
                .map((medidaProducto) => 
                  medidaProducto.medidaVenta.map((medidaVenta) => ({
                    ...medidaVenta,
                    longitud: medidaProducto.longitudMedida
                  }))
                )
                .flat()
                .sort((a, b) => a.longitud.valor - b.longitud.valor)
                .map((medidaVenta) => (
                  <motion.div
                    key={medidaVenta._id + '-' + 'medidaVenta'}
                    className="border rounded-lg shadow-lg bg-white flex flex-col items-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: openCardId === medidaVenta._id ? 1.05 : 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    style={{ height: openCardId === medidaVenta._id ? "auto" : "220px" }}
                    onClick={() => {
                      if (!isSelecting) {
                        handleToggleCard(medidaVenta._id);
                        handleChangeFiltroButton('medidaVenta', medidaVenta._id, medidaVenta.longitudMedida.unidadMedida.nombre);
                      }
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="flex-grow flex items-center justify-center"
                    >
                      <img
                        src={imagenSeleccionada.identificadorMedidaVenta === medidaVenta._id ? imagenSeleccionada.imagen : medidaVenta.colores[0].imagen}
                        alt={medidaVenta.colores[0]._id}
                        className="object-cover mb-4 rounded-md"
                        style={{
                          width: "75%",
                          maxHeight: "200px",
                          objectFit: "contain",
                          transform: medidaVenta.longitudMedida.unidadMedida.simbolo === "½" ? "none" : "rotate(90deg)",
                        }}
                      />
                    </motion.div>

                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="text-lg font-semibold mb-2 text-center"
                      style={{ minHeight: "40px" }}
                    >
                      {medidaVenta.longitudMedida.unidadMedida.simbolo === "½" 
                        ? `${convertirDecimalAFraccion(medidaVenta.longitudMedida.valor)} X ${medidaVenta.longitud.valor}  ${medidaVenta.longitud.unidadMedida.simbolo}`
                        : `${medidaVenta.longitudMedida.valor} ${medidaVenta.longitudMedida.unidadMedida.simbolo}`}
                    </motion.h3>

                    {openCardId === medidaVenta._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mt-4"
                      >
                        {medidaVenta.colores.length !== 1 && (
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", margin: "0 auto" }}>
                            <label className="block text-gray-700 font-semibold mb-1 text-center">Colores</label>
                            <motion.select
                              name="IdentificarColor"
                              id="IdentificadorColor"
                              className="border border-gray-300 p-1 rounded-lg"
                              onFocus={() => setIsSelecting(true)}
                              onBlur={() => setIsSelecting(false)}
                              onChange={(e) => handleChangeColor(e, medidaVenta._id)}
                              style={{ width: "100%" }}
                            >
                              {medidaVenta.colores.map((color) => (
                                <option key={color._id} value={`${color._id}|${color.PrecioVenta.precioUnitario}|${color.PrecioVenta._id}`}>
                                  {color.PrecioVenta.color.nombreColor}
                                </option>
                              ))}
                            </motion.select>
                          </div>
                        )}
                        {medidaVenta.peso.valores[0].valor.peso !== 0 && (
                          <div className="mt-4" style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", margin: "0 auto" }}>
                            <label className="block text-gray-700 font-semibold mb-1 text-center">Pesos</label>
                            <motion.select
                              name="IdentificarPeso"
                              id="IdentificadorPeso"
                              className="border border-gray-300 p-1 rounded-lg"
                              onFocus={() => setIsSelecting(true)}
                              onBlur={() => setIsSelecting(false)}
                              onChange={(e) => handleChangePeso(e)}
                              style={{ width: "60%", margin: "auto 0" }}
                            >
                              {[...medidaVenta.peso.valores.filter((valor) => valor._id === PesoSeleccionadoId),
                                ...medidaVenta.peso.valores.filter((valor) => valor._id !== PesoSeleccionadoId).sort((a, b) => a.valor.peso - b.valor.peso),
                              ].map((valor) => (
                                <option key={valor._id} value={valor.valor._id}>
                                  {valor.valor.peso} {ObtenerDatosPesoUnicoSimbolo(valor.valor._id) !== '' ? ' '+ObtenerDatosPesoUnicoSimbolo(valor.valor._id) : ''} 
                                </option>
                              ))}
                            </motion.select>
                          </div>
                        )}
                        <div className="mt-4" style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", margin: "0 auto", marginTop: "10px" }}>
                          <div style={{ marginBottom: "10px" }}>
                            <span>Precio {valorFormateado}</span>
                          </div>
                          <motion.button
                            className="text-white rounded-full p-3 flex items-center justify-center mx-auto"
                            whileTap={{ scale: 1.2 }}
                            onClick={(e) => handleAddToCart(medidaVenta._id, e)}
                            style={{ backgroundColor: 'rgba(164, 255, 66, 0.8)', marginBottom: "10px" }}
                          >
                            <ShoppingCart size={20} />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))
              }
            </div>
          </div>

        </div>
      </div>

      <div id="root">
        {/* {isModalOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={trailVariants}
            style={{
              position: 'absolute',
              top: buttonPosition.y,
              left: buttonPosition.x,
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "rgba(0, 150, 255, 0.5)",
              zIndex: 999,
            }}
          />
        )} */}

        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Agregar Producto"
          className="Modal"
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.75)",
            },
          }}
        >
          <motion.div
            initial="hidden"
            animate={isModalOpen ? "visible" : "hidden"}
            exit="exit"
            variants={{
              hidden: { 
                opacity: 0, 
                scale: 0.3,
                transition: { delay: 5 }
              },
              visible: { 
                opacity: 1, 
                scale: 1,
                transition: { 
                  type: "spring", 
                  stiffness: 600, 
                  damping: 60,
                  delay: 0
                }
              },
              exit: {
                opacity: 0, 
                scale: 0.8,
                transition: { duration: 0.3 }
              }
            }}
          >
            <h2>Agregar Producto: {ProductoNombreSeleccionado}</h2>
            <form onSubmit={handleSubmit}>
              <div>
                {PrecioSeleccionadoSimbolo !== 'Kg'  &&
                  <>
                    <label htmlFor="cantidadProducto" className="block text-gray-700 font-semibold mb-1">Cantidad</label>
                    <input
                      type="number"
                      id="cantidadProducto"
                      name="cantidadProducto"
                      step="1"
                      value={CantidadIndicada}
                      onChange={(e) => setCantidad(Number(e.target.value))}
                      required
                    />
                  </>
                }
                {coloresMedidaproductoLista.length > 1 &&
                  <>
                    <label htmlFor="longitudProducto" className="block text-gray-700 font-semibold mb-1">Colores</label>
                    <motion.select
                      name="IdentificarColorModal"
                      id="IdentificarColorModal"
                      className="border border-gray-300 p-1 rounded-lg"
                      onFocus={() => setIsSelecting(true)}
                      onBlur={() => setIsSelecting(false)}
                      onChange={(e) => handleChangeColor(e, MedidaProductoLista[0]._id)}
                      style={{ width: "100%", margin: "auto" }}
                    >
                      {coloresMedidaproductoLista
                      .map((ColoresUnic) => (
                          <option key={ColoresUnic.PrecioVenta.color._id} value={`${ColoresUnic.PrecioVenta.color._id}|${ColoresUnic.PrecioVenta.precioUnitario}|${ColoresUnic.PrecioVenta._id}`} >
                            {ColoresUnic.PrecioVenta.color.nombreColor}
                          </option>
                      ))}
                    </motion.select>
                  </>
                }

                {MedidaProductoLista.length > 1 && MedidaProductoLista[0].longitudMedida.unidadMedida.simbolo !== 'Mt²' &&
                  <>
                    <label htmlFor="longitudProducto" className="block text-gray-700 font-semibold mb-1">Longitud</label>
                    <motion.select
                      name="IdentificarPeso"
                      id="IdentificadorPeso"
                      className="border border-gray-300 p-1 rounded-lg"
                      onFocus={() => setIsSelecting(true)}
                      onBlur={() => setIsSelecting(false)}
                      onChange={handleChangeLongitudProducto}
                      style={{ width: "100%", margin: "auto" }}
                    >
                      {MedidaProductoLista.sort((a, b) => a.longitudMedida.valor - b.longitudMedida.valor)
                        .filter(a =>
                          a.colores.some(color => 
                            Number(color.PrecioVenta.precioUnitario) === PrecioSeleccionado
                          ) || 
                          a.colores.some(color => 
                            color.PrecioVenta.color._id === ColorSeleccionadoId
                          )
                        )
                        .map(valor => (
                          <option key={valor._id} value={valor.longitudMedida.valor}>
                            {valor.longitudMedida.valor + '' + valor.longitudMedida.unidadMedida.simbolo}
                          </option>
                        ))}
                    </motion.select>
                  </>
                }

                {MedidaProductoLista.length > 0 && MedidaProductoLista[0].longitudMedida.unidadMedida.simbolo === 'Mt²' && PrecioSeleccionadoSimbolo !== 'Kg' &&
                  <>
                    <label htmlFor="longitudProducto" className="block text-gray-700 font-semibold mb-1">
                      Longitud en metros cuadrados
                    </label>
                    <div className="flex flex-col space-y-4">
                      <div className="flex flex-col space-y-4">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <label htmlFor="parte1">Ancho</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              id="parte1"
                              name="parte1"
                              min={1}
                              value={LongitudCuadradaSeleccionadoValor.parte1}
                              onChange={handleChangeLongitudCuadrada}
                              className="border p-2"
                            />
                            <span>Mt</span>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <label htmlFor="parte2">Largo</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              id="parte2"
                              name="parte2"
                              min={1}
                              value={LongitudCuadradaSeleccionadoValor.parte2}
                              onChange={handleChangeLongitudCuadrada}
                              className="border p-2"
                            />
                            <span>Mt</span>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </>
                }

                {MedidaProductoLista.length > 0 && PrecioSeleccionadoSimbolo === 'Kg'  &&
                  <>
                     <label htmlFor="longitudProducto" className="block text-gray-700 font-semibold mb-1">Peso en {PrecioSeleccionadoSimbolo}</label>
                     <div className="flex flex-col space-y-4">

                      <div className="flex flex-col space-y-4">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <input
                            type="number"
                            id="parte1"
                            name="parte1"
                            min={1}
                            value={PesoSeleccionado}
                            onChange={(e) => handleChangePesoModal(e)}
                            className="border p-2"
                          />
                        </motion.div>
                      </div>
                    </div>
                  </>
                }

                {(
                MedidaProductoLista.length > 0 && 
                MedidaProductoLista[0]?.longitudMedida?.unidadMedida?.simbolo === 'Mt²' &&
                (LongitudCuadradaSeleccionadoValor?.parte1 && LongitudCuadradaSeleccionadoValor?.parte1 !== 0) && 
                (LongitudCuadradaSeleccionadoValor?.parte2 && LongitudCuadradaSeleccionadoValor?.parte2 !== 0) ? (
                  <>
                    <label htmlFor="Precio" className="block text-gray-700 font-semibold mb-1" style={{ marginTop: "10px" }}>
                      Metros cuadrados
                    </label>
                    <input 
                      placeholder="Precio" 
                      type="string" 
                      value={isNaN(areaCalculada) || areaCalculada === null ? 'N/A' : `${areaCalculada} Mt²`} 
                      disabled 
                    />
                    {(areaCalculada >= ProductoLogitudSeleccionadoMaximo || haSuperadoMaximo) && (
                      <p className="text-red-500">El valor máximo permitido es {ProductoLogitudSeleccionadoMaximo}</p>
                    )}
                  </>
                ) : null )}

                <label htmlFor="Precio" className="block text-gray-700 font-semibold mb-1" style={{marginTop:"10px"}}>Precio</label>
                <input placeholder="Precio" type="number" value={ calcularPrecioModalCantidad()} disabled />
              </div>
              <div>
                <button className='buttonCatalogo' type="submit" >Agregar Producto</button>
                <button className='buttonCatalogo' type="button" onClick={closeModal}>
                  Cerrar
                </button>
              </div>
            </form>
          </motion.div>
        </Modal>
      </div>
    </>
  );
};

export default Catalogo;
