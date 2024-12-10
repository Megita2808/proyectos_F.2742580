import axios, { AxiosResponse } from 'axios';

interface ResponseData {
    region: string;
    c_digo_dane_del_departamento: string;
    departamento: string;
    c_digo_dane_del_municipio: string;
    municipio: string;
}

interface MunicipioPorDepartamento {
    codigoDANEDepartamento: string;
    nombreDepartamento: string;
    municipios: string[];
}

interface RegionAgrupada {
    nombreRegion: string;
    departamentos: MunicipioPorDepartamento[];
}

const obtenerDepartamentos = async (): Promise<RegionAgrupada[] | void> => {
  try {
    const respuesta: AxiosResponse<ResponseData[]> = await axios.get<ResponseData[]>(
      'https://www.datos.gov.co/resource/xdk5-pm3f.json'
    );

    if (respuesta.status === 200) {
      const data = respuesta.data;

      const agrupadosPorRegion = data.reduce((acc: Record<string, RegionAgrupada>, item) => {
        const { region, departamento, municipio, c_digo_dane_del_departamento } = item;

        if (!acc[region]) {
          acc[region] = {
            nombreRegion: region,
            departamentos: []
          };
        }

        let departamentoExistente = acc[region].departamentos.find(
          (d) => d.codigoDANEDepartamento === c_digo_dane_del_departamento
        );

        if (!departamentoExistente) {
          departamentoExistente = {
            codigoDANEDepartamento: c_digo_dane_del_departamento,
            nombreDepartamento: departamento,
            municipios: []
          };
          acc[region].departamentos.push(departamentoExistente);
        }

        if (!departamentoExistente.municipios.includes(municipio)) {
          departamentoExistente.municipios.push(municipio);
        }

        return acc;
      }, {});

      const resultadoFinal = Object.values(agrupadosPorRegion);

      resultadoFinal.forEach(region => {
        region.departamentos.sort((a, b) => a.nombreDepartamento.localeCompare(b.nombreDepartamento));
      });
      
      return resultadoFinal;
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Error en la solicitud:', error.response?.data || error.message);
    } else {
      console.error('Error desconocido:', error);
    }
  }
};

export default obtenerDepartamentos;
