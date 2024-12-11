import { useState, useEffect } from "react";
import { postReservationsDashboard } from "@/api/fetchs/posts/post_reserva";
import InputGroup from "@/components/FormElements/InputGroup";
import LoaderBasic from "@/components/Loaders/LoaderBasic";
import { checkToken } from "@/api/validations/check_cookie";
import { fetchProducts } from "@/api/fetchs/get_productos";
import { useAuth } from "@/context/AuthContext";
import SelectPrueba from "@/components/SelectImages/SelectPrueba";
import { fetchUsers } from "@/api/fetchs/get_usuarios";
import SelectGroupOne from "@/components/FormElements/SelectGroup/SelectGroupOne";
import Fecha from "@/components/Clients/Pricing/FiltroFecha";
import { Tag } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { Collapse, TableBody, TableCell, TableHead, TableRow, Typography, Table } from "@mui/material";
import { fetchCities } from "@/api/fetchs/get_ciudades";
import CardTable from "@/components/Tables/CardTable";
import { useCart } from "@/context/CartContext";
import toast, {Toaster} from "react-hot-toast";

interface CrearReservaProps {
  handleClose: () => void;
}

interface FormData {
  id_user: number;
  start_date: string;
  end_date: string;
  address: string;
  city: string;
  neighborhood: string;
  type_payment: string;
  type_shipping: string;
  shipping_cost: number;
  deposit: number;
  details: any[]; // You can specify a more specific type for details if you know its structure
}

const CrearReserva: React.FC<CrearReservaProps> = ({ handleClose }) => {
  const [productos, setProductos] = useState<any []>([]);
  const [usuariosOpc, setUsuariosOpc] = useState<{ id: string | number; name: string }[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<{ id_product: number, quantity : number }[]>([]);
  const {dataUser} = useAuth();
  const [ selectedDates, setSelectedDates] = useState<[string, string] | null>(null);
  const [loadingDates, setLoadingDates] = useState(false);
  const [subtotalReservation, setSubtotalReservation] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [opcionesMunicipios, setOpcionesmunicipios] = useState<{ id: string; name: string }[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [loadKeySelect, setLoadKeySelect] = useState(0);
  const [typeShipping, setTypeShipping] = useState("Sin envio");
  const [envioCost, setEnvioCost] = useState(0);
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    id_user: 1,
    start_date: "",
    end_date: "",
    address: "",
    city: "",
    neighborhood: "",
    type_shipping: "",
    type_payment: "",
    shipping_cost: 0,
    deposit: 0,
    details: [],
  });

function formatCurrency(value: string | number): string {
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

useEffect(() => {
  const getDates = async() => {
    const dates = sessionStorage.getItem("dates");
    if (dates) {
      try {
        const datesArray: [string, string] = JSON.parse(dates);
    
        const formattedStartDate = new Date(datesArray[0]).toISOString().split('T')[0];
        const formattedEndDate = new Date(datesArray[1]).toISOString().split('T')[0];
    
        setFormData(prevState => ({
          ...prevState,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
        }));
      } catch (error) {
        console.error("Error al parsear 'dates' desde sessionStorage:", error);
      }
    }
  }
  const fetchData = async () => {
    let filtered
    try {
      if(selectedDates) {
        filtered = await fetchProducts(selectedDates[0], selectedDates[1]);
      } else {
        filtered = await fetchProducts();
      }
      setProductos(filtered);
    } catch (error) {
      console.error("Error al cargar los productos:", error);
    } finally {
      setLoading(false);
    }
  };

  getDates();
  fetchData();
}, []);

useEffect(() => {
  if (selectedDates) {
    setLoadingDates(true); // Inicia el estado de carga
    const fetchData = async () => {
      const filtered = await fetchProducts(selectedDates[0], selectedDates[1]);
      setProductos(filtered);
      setLoadingDates(false); // Finaliza el estado de carga
    };

    fetchData();
  }
  setLoadKeySelect(loadKeySelect + 1)
}, [selectedDates]); 


  useEffect(() => {
    setUserId(dataUser.data.id_user);

    const fetchdataUsers = async () => {
      const usuarios = await fetchUsers();
      setUsuariosOpc((prevOptions) => [
        ...usuarios
          .map((user) => ({
            id: user.id_user,
            name: user.names + " " + user.lastnames,
          }))
          .sort((a, b) => a.id - b.id),
      ]);
    }


  const fetchdataCities = async () => {
    const cities = await fetchCities();
    setOpcionesmunicipios(
      cities
        .map((cit) => ({
          id: cit.name,
          name: cit.name
        }))
    );
  }


    fetchdataUsers();
    fetchdataCities()
  }, []);

  useEffect(() => {
    let subTotal = 0;
    selectedProducts.forEach(({ id_product, quantity }) => {
      const product = productos.find((prod) => prod.id_product === id_product);
      if (product) {
        subTotal += parseFloat(product.price) * quantity;
      }
    });
    console.log({subTotal})
    setSubtotalReservation(subTotal);
    setFormData(prevState => ({
      ...prevState,
      subtotal_reservation: subTotal,
      details: selectedProducts
  }));
  }, [selectedProducts, productos]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value, name, type } = event.target;
    const fieldName = id || name;
    setFormData(prevState => ({
        ...prevState,
        [fieldName]: type === 'checkbox' ? (event.target as HTMLInputElement).checked : value,
    }));
    console.log({formData})
  };

  const handleDateChange = (dates: [string, string] | null) => {
    setSelectedDates(dates);
    sessionStorage.setItem("dates", JSON.stringify(dates));
  
    setFormData(prevState => ({
      ...prevState,
      start_date: dates && dates[0] ? dates[0] : "",
      end_date: dates && dates[1] ? dates[1] : "",
    }));
  };

  const calculateProductSubtotal = () => {
    let total = 0;
    selectedProducts.forEach(({ id_product, quantity }) => {
      const product = productos.find((prod) => prod.id_product === id_product);
      if (product) {
        total += parseFloat(product.price) * quantity;
      }
    });
    return total;
  };

  const [deposit,setDeposit] = useState<number>(0);


  const calculateTotal = () => {
    let subtotal = 0
    selectedProducts.forEach(({ id_product, quantity }) => {
      const product = productos.find((prod) => prod.id_product === id_product);
      if (product) {
        subtotal += parseFloat(product.price) * quantity;
      }
    });
    // Define el costo de transporte
    let envioCost = 0;
    if (formData.type_shipping === "Solo Recogida") {
      envioCost = 50000; 
    } else if (formData.type_shipping === "Solo Entrega") {
      envioCost = 50000; 
    } else if (formData.type_shipping === "Recogida y Entrega") {
      envioCost = 100000; 
    } else {
      envioCost = 0; 
    }

    const calculatedDeposit = subtotal * 0.10;
    setFormData(prevState => ({
      ...prevState,
      deposit: calculatedDeposit,
      shipping_cost: envioCost
    }));

    setDeposit(calculatedDeposit);

    setEnvioCost(envioCost);

    return subtotal + envioCost + calculatedDeposit; 
  };

  useEffect(() => {
    if (selectedProducts.length > 0) {
      const newTotal = calculateTotal();
      setTotal(newTotal); 
    }
  }, [typeShipping, selectedProducts]); 


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.id_user || !formData.address || !formData.city || !formData.neighborhood || !formData.start_date || !formData.end_date || !formData.type_payment || !formData.type_shipping || !formData.shipping_cost || !formData.deposit) {
      toast.error("Por favor completa todos los campos.")
      return;
    }

    if (selectedProducts.length === 0) {
      toast.error("Por favor selecciona al menos un producto.")
      return;
    }

    if (!userId) {
      toast.error("No se pudo obtener el ID del usuario.")
      return;
    }

    const filtrados = selectedProducts.filter((producto) => producto.quantity != 0);
    const details = filtrados.map((producto) => {
      console.log({producto})
      return {
        id_product: producto.id_product,
        quantity: producto.quantity,
      };
  });
  console.log({details})

  setFormData(prevState => ({
    ...prevState,
    details
  }));

  const dataPostReservation = {
    id_user: formData.id_user,
    start_date: formData.start_date,
    end_date: formData.end_date,
    address: formData.address,
    city: formData.city,
    neighborhood: formData.neighborhood,
    type_shipping: formData.type_shipping,
    type_payment: formData.type_payment,
    shipping_cost: formData.shipping_cost,
    deposit: formData.deposit,
    details
  }
    try {
      toast.promise(
        postReservationsDashboard(dataPostReservation),
        {
          loading: "Generando Reserva...",
          success: <b>Reserva generada exitosamente!</b>,
          error: <b>Error al intentar generar la reserva.</b>,
        }
      );
      handleClose();
    } catch (error) {
      toast.error("Error al crear la reserva.");
    }
  };
  

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      <form onSubmit={handleSubmit} className="p-6.5">
        <div className="mb-4">
          <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
            Fecha:
          </label>
          <div className="flex flex-row items-center gap-6 align-middle">
            <Fecha
              onDateChange={handleDateChange}
              customClasses="!rounded-xl"
            />
            {loadingDates ? (
              <div className="bottom-0 top-0">
                <Tag icon={<SyncOutlined spin />} color="#5750f1 ">
                  Filtrando
                </Tag>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <SelectGroupOne
            id="id_user"
            name="id_user"
            label="Cliente"
            placeholder="Selecciona el Cliente"
            customClasses="mb-3 w-full"
            // required
            value={formData.id_user.toString()}
            opciones={usuariosOpc}
            onChange={handleChange}
          />
          <InputGroup
            id="address"
            name="address"
            label="Dirección"
            value={formData.address}
            onChange={handleChange}
            required
            type={""}
            placeholder={""}
            customClasses="mb-3 w-full"
          />
        </div>
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          {/* <InputGroup
            id="city"
            name="city"
            label="Ciudad"
            value={formData.city}
            onChange={handleChange}
            required 
            type={""} 
            placeholder={""}
            customClasses="mb-3 w-full" 
          /> */}
          <SelectGroupOne
            label="Municipio"
            name="city"
            customClasses=" mb-3 w-full dark: border-dark-3 dark:text-white dark:focus:border-primary "
            required
            value={formData.city}
            opciones={opcionesMunicipios}
            onChange={handleChange}
            placeholder="Selecciona un Municipio"
          />
          <InputGroup
            id="neighborhood"
            name="neighborhood"
            label="Barrio"
            value={formData.neighborhood}
            onChange={handleChange}
            required
            type={""}
            placeholder={""}
            customClasses="mb-3 w-full"
          />
        </div>
        <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
          <SelectGroupOne
            label="Tipo de Envío"
            name="type_shipping"
            customClasses=" mb-3 w-full dark: border-dark-3 dark:text-white dark:focus:border-primary "
            required
            value={formData.type_shipping}
            opciones={[
              { id: "Recogida y Entrega", name: "Recogida y Entrega" },
              { id: "Solo Recogida", name: "Solo Recogida" },
              { id: "Solo Entrega", name: "Solo Entrega" },
              { id: "Sin envío", name: "Sin Envío" },
            ]}
            onChange={handleChange}
            placeholder="Selecciona un tipo de envío"
          />

          <SelectGroupOne
            label="Tipo de Pago"
            name="type_payment"
            customClasses=" mb-3 w-full dark: border-dark-3 dark:text-white dark:focus:border-primary "
            required
            value={formData.type_payment}
            opciones={[
              { id: "Efectivo", name: "Efectivo" },
              { id: "Transferencia", name: "Transferencia" },
            ]}
            onChange={handleChange}
            placeholder="Selecciona un tipo de envío"
          />
        </div>
        <div className="my-4">
          <Typography
            variant="h6"
            className="mb-3 block text-lg font-medium text-dark dark:text-white"
          >
            Selecciona los productos y sus cantidades:
          </Typography>
          {loading ? (
            <LoaderBasic />
          ) : productos.length === 0 ? (
            <Typography variant="h6" className="py-6 text-gray-500">
              No hay productos disponibles.
            </Typography>
          ) : (
            <div>
              <SelectPrueba
                products={productos}
                setSelectedProducts={setSelectedProducts}
              />
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-center">
          <TableRow>
            <TableCell
              style={{ paddingBottom: 0, paddingTop: 0 }}
              colSpan={10000}
              align="center"
            >
              <Collapse in={true} timeout="auto" unmountOnExit>
                <div className="flex justify-center w-full">
                  <div className="min-h-[400px] min-w-[600px] max-w-[1000px] rounded-xl bg-primary/[.2] p-4 shadow-lg">
                    <CardTable
                      customClasses="bg-primary/[.2]"
                      data={
                        <Table
                          size="small"
                          aria-label="costos"
                          className="w-full rounded-xl border-2 border-gray-400"
                        >
                          <TableHead>
                            <TableRow className="h-[30px] rounded-xl">
                              <TableCell className="h-[30px] w-1/3 py-6 text-lg font-bold dark:text-dark-6">
                                Descripción
                              </TableCell>
                              <TableCell className="h-[30px] w-1/3 py-6 text-right text-lg font-bold dark:text-dark-6">
                                Monto
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow className="h-[30px]">
                              <TableCell className="py-6 dark:bg-gray-dark dark:text-gray-400">
                                Subtotal de productos
                              </TableCell>
                              <TableCell
                                align="right"
                                className="py-6 dark:bg-gray-dark dark:text-gray-400"
                              >
                                {formatCurrency(calculateProductSubtotal())}
                              </TableCell>
                            </TableRow>
                            <TableRow className="h-[30px]">
                              <TableCell className="py-6 dark:bg-gray-dark dark:text-gray-400">
                                Deposito
                              </TableCell>
                              <TableCell
                                align="right"
                                className="py-6 dark:bg-gray-dark dark:text-gray-400"
                              >
                                ${deposit.toLocaleString("en-US")}
                              </TableCell>
                            </TableRow>
                            <TableRow className="h-[30px]">
                              <TableCell className="py-6 dark:bg-gray-dark dark:text-gray-400">
                                Envío
                              </TableCell>
                              <TableCell
                                align="right"
                                className="py-6 dark:bg-gray-dark dark:text-gray-400"
                              >
                                ${envioCost.toLocaleString("en-US")}
                              </TableCell>
                            </TableRow>
                            <TableRow className="h-[30px]">
                              <TableCell
                                className="py-6 dark:bg-gray-dark dark:text-gray-400"
                                colSpan={1}
                              >
                                <span className="text-2xl font-semibold text-gray-800 dark:text-white">
                                  Total:
                                </span>
                              </TableCell>
                              <TableCell
                                align="right"
                                className="py-6 dark:bg-gray-dark dark:text-gray-400"
                              >
                                <span className="text-xxl font-semibold text-gray-800 dark:text-white">
                                  ${total.toLocaleString("en-US")}
                                </span>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      }
                    />
                  </div>
                </div>
              </Collapse>
            </TableCell>
          </TableRow>
        </div>
        <button
          type="submit"
          className="mb-4 flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-primary bg-[6A0DAD] px-4 py-2 font-bold text-primary transition-all delay-100 duration-300 hover:scale-100 hover:bg-primary/90 hover:text-white dark:text-white"
        >
          Crear Reserva
        </button>
      </form>
    </div>
  );
};

export default CrearReserva;
