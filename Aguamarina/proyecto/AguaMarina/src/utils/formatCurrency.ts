export default function formatCurrency(value: string | number): string {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
    if (isNaN(numericValue)) {
      return "Invalid price";
    }
  
    return numericValue.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
  