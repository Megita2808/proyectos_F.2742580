import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';
import { store, persistor } from '@/redux/store';

import { saveAs } from 'file-saver';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { vaciarCarrito } from '@/redux/slice/carritoCompra';

interface PesoEsquema  {
  valor: any;
  unidad: any;
}

type ProductoTransformado = {
  medida: string;
  longitud: any;
  peso: string | { valor: any; unidad: any; };
  cantidad: any;
  total: number;
  precioVenta: string;
};

type DetalleVenta = {
  medidasProducto: ProductoTransformado[];
  medidasVenta: ProductoTransformado[];
};

export const generarPDFDesdeBase = async (carrito: any[], pdfBaseBytes: Uint8Array) => {
  const pdfDoc = await PDFDocument.load(pdfBaseBytes);
  const maxProductosPorPagina = 9;
  const totalPaginas = Math.ceil(carrito.length / maxProductosPorPagina);
  const pages: any[] = [];
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let subtotal = 0;
  let total = 0;

  for (let pagina = 0; pagina < totalPaginas; pagina++) {
    const startIndex = pagina * maxProductosPorPagina;
    const endIndex = Math.min(startIndex + maxProductosPorPagina, carrito.length);
    const productosPagina = carrito.slice(startIndex, endIndex);

    const [templatePage] = await pdfDoc.copyPages(pdfDoc, [0]);
    const newPage = pdfDoc.addPage(templatePage);

    let yPosition = 500;

    productosPagina.forEach((item) => {
      const medida = `${item.longitud || ''} ${item.longitudProductoSimbolo || ''}`;
      const peso = item.idPeso !== 'vacio' && item.idPeso !== null 
        ? `${item.peso} ${item.simboloPeso}` 
        : '';
      const totalProducto = item.total || 0;

      subtotal += totalProducto;
      total += totalProducto;

      newPage.drawText(
        `${item.cantidad} - ${item.idProducto} - ${medida} - ${peso} - $${totalProducto.toFixed(2)}`,
        { x: 50, y: yPosition, size: 10, font, color: rgb(0, 0, 0) }
      );

      yPosition -= 20;
    });

    newPage.drawText(`Subtotal: $${subtotal.toFixed(2)}`, { x: 400, y: 50, size: 12, font });
    pages.push(newPage);
  }
  
  const lastPage = pages[pages.length - 1];
  lastPage.drawText(`Total: $${total.toFixed(2)}`, { x: 400, y: 30, size: 14, font });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};

interface RespuestaVenta {
  msg: string;
  status: number;
}


const AgregarEnvio = async (
  fecha: Date,
  direccion: string,
  selected: google.maps.LatLngLiteral | undefined,
  tipoEnvio: string,
  departamento: string | undefined,
  municipio: string | undefined
): Promise<RespuestaVenta |void> => {
  try {
    let subTotal = 0;

    const transformarCarrito = (carrito: any[]) => {
      const detalleVenta: DetalleVenta = {
        medidasProducto: [],
        medidasVenta: []
      };    
      carrito.forEach(item => {

        let peso: PesoEsquema = {
          valor: 0,
          unidad: ''
        };

        if (item.idPeso !== 'vacio' && item.idPeso !== null) {
          peso = { valor: item.peso, unidad: item.simboloPeso };
        }

        const precioUnitario = Number(item.precioUnitario);
        const cantidad = Number(item.cantidad);
        if (isNaN(precioUnitario) || isNaN(cantidad)) {
          console.error(`Error en item ${item.idProducto}: precioUnitario o cantidad no son números.`);
          return;
        }
        const productoTransformado = {
          medida: String(item.idProducto),
          longitud: typeof item.longitud === 'object' 
          ? {
              ancho: item.longitud.parte1,
              largo: item.longitud.parte2,
            } : item.longitud
          ,
          peso: String(item.idPeso) || peso,  
          cantidad: item.cantidad,
          total: item.simboloprecioUnitario === 'Kg' ? cantidad * (item.precioUnitario * item.peso) :
          item.simboloprecioUnitario === 'gm' ? cantidad * (precioUnitario * item.peso):
          item.longitudProductoSimbolo === 'Mt²' && typeof item.longitud === 'object' ? cantidad * (precioUnitario * (item.longitud.parte1 * item.longitud.parte2)) :
          item.simboloprecioUnitario === 'Mt²' && item.simboloprecioUnitario === 'Kg'  ? cantidad * (precioUnitario * item.peso) :
          item.peso === '0' && item.simboloPeso === '' && typeof item.longitud === 'object' ? cantidad * (precioUnitario * item.longitud) :
          item.longitudProductoSimbolo === '½' && item.simboloprecioUnitario === 'yd'  ? (precioUnitario * ((item.longitud * 2) *  item.longitudProducto)) * cantidad :
          cantidad * item.precioUnitario,
          precioVenta: item.identificadorPrecio,
          color: item.idColor,
        };
        subTotal +=  productoTransformado.total;
        if (item.tipoProducto === 1) {
          detalleVenta.medidasProducto.push(productoTransformado);
        } else if (item.tipoProducto === 2) {
          detalleVenta.medidasVenta.push(productoTransformado);
        }
      });
    
      return detalleVenta;
    };

    const state = store.getState(); 
   
    let  direccionFormateada
    if ((undefined === departamento && municipio === undefined  && selected === undefined) && tipoEnvio == 'enviar') {
      direccionFormateada = {
        identificadorLocacion : direccion,
        usuario: state.user.name,
      }
    }else if (selected && tipoEnvio == 'enviar') {
      direccionFormateada = {
        usuario: state.user.name,
        nombreDepartamento: departamento,
        ciudades: [
          {
            nombreCiudad: municipio,
            locaciones: [
                {
                    locacion: direccion,
                    coordenadas: {
                        latitud: selected.lat,
                        longitud: selected.lng
                    }
                }
            ]
          }
        ]
      };
    }else{
      direccionFormateada = {
        usuario: state.user.name,
      }
    }

    const carrito = state.carrito.carrito;

    const fetchPDFBase = async () => {
      const response = await fetch('/pdf/facturaFormatoDatos.pdf');
      if (!response.ok) {
        throw new Error('No se pudo cargar el archivo PDF.');
      }
      return new Uint8Array(await response.arrayBuffer());
    };

    const handleGenerarPDF = async () => {
      const pdfBaseBytes = await fetchPDFBase();
    
      const pdfBytes = await generarPDFDesdeBase(state.carrito.carrito, pdfBaseBytes);
    
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, 'factura_generada.pdf');
    };

    handleGenerarPDF();

    const detalleVentaTransformado = transformarCarrito(carrito);

    const response: AxiosResponse<RespuestaVenta> = await axios2.post<RespuestaVenta>('/api/ventas',
      { 
        fechaEnvio: fecha,
        detalleVenta: detalleVentaTransformado,
        direccion: direccionFormateada,
        tipoVenta: tipoEnvio,
        subTotal,
      }
    );

    if(response.status === 200){
      store.dispatch(vaciarCarrito());
      persistor.flush();
    }

    return {
      status: response.status,
      msg: response.data.msg,
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        status: error.response.status,
        msg: error.response.data.error || 'Ocurrió un error en la solicitud.'
      };
    } else {
      return {
        status: 500,
        msg: 'Error desconocido en la solicitud'
      };
    }
  }
};

export default AgregarEnvio;
