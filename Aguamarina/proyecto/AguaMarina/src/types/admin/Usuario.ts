export type Usuario = {
  id_user: number;
  names: string;
  lastnames: string;
  dni: string;
  mail: string;
  password?: string;
  phone_number : string;
  id_rol: number;
  rol: string;
  status: boolean;
  permissions: [];
  accessDashboard: boolean;
  createdAt: Date;
  updatedAt: Date;
};