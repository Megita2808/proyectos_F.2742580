
export const formatearFecha = (fecha: string | Date | undefined, mostrarHora: boolean = false): string => {
    if (!fecha) return "Sin fecha";
  
    const fechaObj = new Date(fecha);
    const opcionesFecha: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      year: "numeric",
      month: "short",
    };
  
    const opcionesHora: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };
  
    const fechaFormateada = fechaObj.toLocaleDateString("es-ES", opcionesFecha);
  
    if (mostrarHora) {
      const horaFormateada = fechaObj.toLocaleTimeString("es-ES", opcionesHora);
      return `${fechaFormateada}, ${horaFormateada}`;
    }
  
    return fechaFormateada;
  };