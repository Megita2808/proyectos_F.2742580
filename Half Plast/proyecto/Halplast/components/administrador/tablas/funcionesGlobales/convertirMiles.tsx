export const formatearNumero = (numero: number | undefined): string => {
    if (numero === undefined || isNaN(numero)) return "Sin valor";
  
    return new Intl.NumberFormat("es-ES").format(numero);
  };