import axios, { AxiosResponse } from 'axios';
import axios2 from '@/utils/axiosConfig';

import { store } from '@/redux/store';

interface Area {
  ancho: number;
  largo: number;
}

interface PesoPersonalizado {
  valor: number;
  unidad: string;
}

interface MedidaVenta {
  _id: string;
  medida: string;
  longitud: number | Area;
  peso: string | PesoPersonalizado;
  color: string;
  cantidad: string;
  total: number;
}

interface MedidaProducto {
  _id: string;
  medida: string;
  longitud: number | Area;
  peso: string | PesoPersonalizado | null;
  color: string;
  cantidad: string;
  total: number;
}

interface DetalleVenta {
  medidasProducto: MedidaProducto[] | null;
  medidasVenta: MedidaVenta[] | null;
}

interface RespuestaVenta {
  msg: string;
  status: number;
}

const AgregarVenta = async (
  fecha: Date,
  direccion: string,
  selected: google.maps.LatLngLiteral | undefined,
  departamento: string | undefined,
  municipio: string | undefined,
  tipoEnvio: string,
  usuarioIdentificador: string,
  detalleVenta: DetalleVenta,
  transformarDireccion: boolean,
): Promise<RespuestaVenta | void> => {
  try {
    let subTotal = 0;
   
    detalleVenta.medidasProducto?.map((medidaProducto) => {subTotal += medidaProducto.total})
    detalleVenta.medidasVenta?.map((medidaVenta) => {subTotal += medidaVenta.total})
    let direccionFormateada 

    if (!transformarDireccion && tipoEnvio == 'enviar'){
      direccionFormateada = {
        identificadorLocacion : direccion,
        usuario: usuarioIdentificador,
      }
    }else if(selected && transformarDireccion && tipoEnvio == 'enviar') {
      direccionFormateada = {
        usuario: usuarioIdentificador,
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
        usuario: usuarioIdentificador,
      }
    }

    const response: AxiosResponse<RespuestaVenta> = await axios2.post<RespuestaVenta>('/api/ventas',
      { 
        fechaEnvio: fecha,
        detalleVenta,
        direccion: direccionFormateada,
        tipoVenta: tipoEnvio,
        subTotal,
      }
    );
    
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

export default AgregarVenta;
