export type Reserva = {
    id_reservation: number;
    id_user: number;
    name_client: string;
    start_date: string;
    end_date: string;
    address: string;
    city : string;
    neighborhood : string;
    subtotal_reservation : number;
    shipping_cost : number;
    deposit : number;
    total_reservation : number;
    status: string;
    details: any[];
  };