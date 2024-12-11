import React, { useEffect, useState, useRef } from "react";
import { Collapse, Typography, Select, Form, Input, Button, Col, Row } from "antd";
import { fetchCities } from "@/api/fetchs/get_ciudades";
import { Ciudad } from "@/types/admin/Ciudad";
import { Direccion } from "@/types/admin/Direccion";
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { fetchAddressesByUser } from "@/api/fetchs/get_direcciones"; 
import { postAddresses } from "@/api/fetchs/posts/post_direccion";
import { putAddresses } from "@/api/fetchs/puts/put_addresses";
import { deleteAddresses } from "@/api/fetchs/deletes/delete_addresses";
import MapIcon from '@mui/icons-material/Map';
import Swal from "sweetalert2";
import { Autocomplete } from "@react-google-maps/api";
import { autocomplete, mapPropsVariants } from "@nextui-org/react";
import SelectGroupOne from "../FormElements/SelectGroup/SelectGroupOne";

const { Title } = Typography;
const { Option } = Select;

const ListaDir: React.FC<{ id_user: number | string, handleClose?: any }> = ({ id_user, handleClose }) => {
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

 /*  const [isButtonDisabled, setIsButtonDisabled] = useState(false); */
 const [opcionesMunicipios, setOpcionesmunicipios] = useState<{ id: number; name: string }[]>([]);

  const [formData, setFormData] = useState({
    id_user,
    name: "",
    address: "",
    id_city: "",
    neighborhood: "",
    reference: "",
  });

  const [map, setMap] = useState<google.maps.Map | null>(null); // Para almacenar el mapa
  const [marker, setMarker] = useState<google.maps.Marker | null>(null); // Para almacenar el marcador
  const mapRef = useRef<HTMLDivElement | null>(null); // Referencia al contenedor del mapa
  

  useEffect(() => {
    const fetchData = async () => {
        const cities = await fetchCities();
        setOpcionesmunicipios(() => [
          ...cities
            .map((cit) => ({
              id: cit.id_city,
              name: cit.name,
            }))
            .sort((a, b) => a.id - b.id),
        ]);
          
          
          
    };
    fetchData();
}, []);
  // Definir los límites aproximados del Valle de Aburrá (polígono simplificado)
  const valleDeAburraBounds = [
    { lat: 6.126, lng: -75.605 }, 
    { lat: 6.250, lng: -75.500 },
    { lat: 6.350, lng: -75.400 },
    { lat: 6.300, lng: -75.700 },
    // Añadir más coordenadas para crear un polígono cerrado
  ];

  // Función que valida si la ubicación está dentro del Valle de Aburrá
  const isWithinValleDeAburra = (location: google.maps.LatLng) => {
    const polygon = new google.maps.Polygon({
      paths: valleDeAburraBounds,
    });
    return google.maps.geometry.poly.containsLocation(location, polygon);
  };

  // Función para manejar los cambios en el formulario
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value, name, type } = event.target;
    const fieldName = id || name;

    setFormData(prevState => ({
      ...prevState,
      [fieldName]: type === 'checkbox' ? (event.target as HTMLInputElement).checked : value,
    }));
  };

  // Función para obtener las ciudades
  const fetchCiudades = async () => {
    try {
      const ciudadesLista = await fetchCities();
      setCiudades(ciudadesLista);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  // Función para obtener las direcciones del usuario
  const fetchDirecciones = async () => {
    try {
      if (!id_user) {
        console.error("No user ID provided.");
        return;
      }
      const direccionesLista = await fetchAddressesByUser(id_user);
      setDirecciones(direccionesLista);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  // Efecto para cargar las ciudades y direcciones al montar el componente
  useEffect(() => {
    fetchCiudades();
    fetchDirecciones();
  }, [id_user]);

  // Efecto para inicializar el mapa solo cuando el div con el ref "mapRef" esté disponible
  useEffect(() => {
    if (mapRef.current && window.google) {
      const initialMap = new google.maps.Map(mapRef.current, {
        center: { lat: 6.2442, lng: -75.5812},
        zoom: 14,
      });
      setMap(initialMap);

      const initialMarker = new google.maps.Marker({
        map: initialMap,
      });
      setMarker(initialMarker);
    }
  }, [showCreateForm]);

  // Función para obtener la geolocalización y mostrar el marcador en el mapa
  const geocodeAddress = (address: string) => {
    if (!address || !map || !marker) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, async (results, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        map.setCenter(location);
        marker.setPosition(location);

        // Validar si la ubicación está dentro del Valle de Aburrá
        if (!isWithinValleDeAburra(location)) {
          await Swal.fire({
            icon: "warning",
            iconColor: "#fefefe",
            color: "#fefefe",
            title: "Lo sentimos",
            text: "Estás fuera de nuestro rango de entrega",
            showConfirmButton: false,
            timer: 5000,
            background: "url(/images/grids/bg-modal-dark.jpeg)",
            customClass: {
              popup: 'rounded-3xl shadow shadow-6',
            }
          })
            setFormData({
              id_user: id_user,
              name: "",
              address: "",
              id_city: "",
              neighborhood: "",
              reference: "",
            });

/*             setIsButtonDisabled(true); */
        }
      } else {
/*         setIsButtonDisabled(false); */
      }
    });
  };

  const handleCreateAddress = async (values: any) => {
    console.log({formData})
    if(!formData.name) {
      let timerInterval: number | NodeJS.Timeout;
      Swal.fire({
        icon: "warning",
        iconColor: "#000",
        color: "#000",
        title: 'Error',
        html:"Debes agregar un nombre <b>2</b> segundos...",
        timerProgressBar: true,
        showConfirmButton: false,
        cancelButtonColor: "#000",
        cancelButtonText: 'Cerrar',
        timer: 2000,
        background: "url(/images/grids/bg-morado-bordes.avif)",
        customClass: {
          popup: "rounded-3xl shadow shadow-6",
          container: 'custom-background',
        },
        didOpen: () => {
          const htmlContainer = Swal.getHtmlContainer();
          if (htmlContainer) {
            const b = htmlContainer.querySelector("b");
            if (b) {
              let remainingTime = 2;
              timerInterval = setInterval(() => {
                remainingTime -= 1;
                b.textContent = remainingTime.toString();
                if (remainingTime <= 0) {
                  clearInterval(timerInterval);
                }
              }, 1000);
            }
          }
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
       
      });
      return
    } 

    if(!formData.address) {
      let timerInterval: number | NodeJS.Timeout;
      Swal.fire({
        icon: "warning",
        iconColor: "#000",
        color: "#000",
        title: 'Error',
        html:"Debes agregar una dirección <b>2</b> segundos...",
        timerProgressBar: true,
        showConfirmButton: false,
        cancelButtonColor: "#000",
        cancelButtonText: 'Cerrar',
        timer: 2000,
        background: "url(/images/grids/bg-morado-bordes.avif)",
        customClass: {
          popup: "rounded-3xl shadow shadow-6",
          container: 'custom-background',
        },
        didOpen: () => {
          const htmlContainer = Swal.getHtmlContainer();
          if (htmlContainer) {
            const b = htmlContainer.querySelector("b");
            if (b) {
              let remainingTime = 2;
              timerInterval = setInterval(() => {
                remainingTime -= 1;
                b.textContent = remainingTime.toString();
                if (remainingTime <= 0) {
                  clearInterval(timerInterval);
                }
              }, 1000);
            }
          }
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
       
      });
      return
    } 
    if(!formData.neighborhood) {
      let timerInterval: number | NodeJS.Timeout;
      Swal.fire({
        icon: "warning",
        iconColor: "#000",
        color: "#000",
        title: 'Error',
        html:"Debes agregar un barrio <b>2</b> segundos...",
        timerProgressBar: true,
        showConfirmButton: false,
        cancelButtonColor: "#000",
        cancelButtonText: 'Cerrar',
        timer: 2000,
        background: "url(/images/grids/bg-morado-bordes.avif)",
        customClass: {
          popup: "rounded-3xl shadow shadow-6",
          container: 'custom-background',
        },
        didOpen: () => {
          const htmlContainer = Swal.getHtmlContainer();
          if (htmlContainer) {
            const b = htmlContainer.querySelector("b");
            if (b) {
              let remainingTime = 2;
              timerInterval = setInterval(() => {
                remainingTime -= 1;
                b.textContent = remainingTime.toString();
                if (remainingTime <= 0) {
                  clearInterval(timerInterval);
                }
              }, 1000);
            }
          }
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
       
      });
      return
    } 

    try {
      const createdAddress = await postAddresses(formData);
      let timerInterval: number | NodeJS.Timeout;
      await Swal.fire({
        icon: "success",
        iconColor: "#000",
        color: "#000",
        title: 'Dirección creada',
        html: "Dirección exitosamente en <b>3</b> segundos...",
        timerProgressBar: true,
        showConfirmButton: false,
        cancelButtonColor: "#000",
        cancelButtonText: 'Cerrar',
        timer: 3000,
        background: "url(/images/grids/bg-morado-bordes.avif)",
        customClass: {
          popup: "rounded-3xl shadow shadow-6",
          container: 'custom-background',
        },
        didOpen: () => {
          const htmlContainer = Swal.getHtmlContainer();
          if (htmlContainer) {
            const b = htmlContainer.querySelector("b");
            if (b) {
              let remainingTime = 3;
              timerInterval = setInterval(() => {
                remainingTime -= 1;
                b.textContent = remainingTime.toString();
                if (remainingTime <= 0) {
                  clearInterval(timerInterval);
                }
              }, 1000);
            }
          }
        },
        willClose: () => {
          clearInterval(timerInterval);
          window.location.reload();

        },
      });
    } catch (error) {
      console.error("Error al crear dirección:", error);
    }
  };

  const handleUpdateAddress = async (id_address : string | number , values : any) => {
    try {
      const response = await Swal.fire({
        title: '¿Estas seguro?',
        text: "Estas seguro de estos cambios?",
        iconColor: "#000",
        color: "#000",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: "#000",
        confirmButtonColor: "#6A0DAD",
        confirmButtonText: 'Comfirmar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        background: "url(/images/grids/bg-morado-bordes.avif)",
        customClass: {
          popup: "rounded-3xl shadow shadow-6",
          container: 'custom-background',
          cancelButton: "rounded-xl",
          confirmButton: "rounded-xl",
        },
      }).then((res) => res.isConfirmed);

      if (response) {
        const updatedAddress = await putAddresses(id_address, values);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error al actualizar dirección:", error);
    }
  };

  const handleRemoveAddress = async (id_address : string | number) => {
    try {
      // fetchDirecciones();
        const response = await Swal.fire({
          title: '¿Estas seguro?',
          text: "Seguro que deseas eliminar esta dirección",
          iconColor: "#000",
          color: "#000",
          icon: 'warning',
          showCancelButton: true,
          cancelButtonColor: "#000",
          confirmButtonColor: "#6A0DAD",
          confirmButtonText: 'Comfirmar',
          cancelButtonText: 'Cancelar',
          reverseButtons: true,
          background: "url(/images/grids/bg-morado-bordes.avif)",
          customClass: {
            popup: "rounded-3xl shadow shadow-6",
            container: 'custom-background',
            cancelButton: "rounded-xl",
            confirmButton: "rounded-xl",
          },
        }).then((res) => res.isConfirmed);

        if (response) {
          const deleteAddress = await deleteAddresses(id_address);
          window.location.reload();
        }
    } catch (error) {
      console.error("Error al eliminar dirección:", error);
    }
    
  };

  const collapseItems = direcciones.map((direccion, index) => ({
    key: direccion.id_address.toString(),
    label: (
      <div className="flex justify-between px-2">
        <div className="text-lg  dark:text-white rounded-lg ">
          {direccion.name || `Dirección ${index + 1}`}
        </div>
        <div className="flex items-center">
          <button
            className="text-red-600 hover:text-red-800 p-2 rounded-lg transition duration-300"
            onClick={() => handleRemoveAddress(direccion.id_address)}
          >
            <ClearOutlinedIcon />
          </button>
        </div>
      </div>
    ),
    children: (
      <div className="wow fadeInUp relative mx-auto max-w-[1200px] overflow-hidden rounded-lg px-8 py-14 dark:bg-dark-2 sm:px-12 md:px-[60px]" data-wow-delay=".15s">
        <Form
          layout="vertical"
          initialValues={{
            name: direccion.name || "",
            address: direccion.address || "",
            id_city: direccion.id_city || "",
            neighborhood: direccion.neighborhood || "",
            reference: direccion.reference || "",
          }}
          onFinish={(values) => handleUpdateAddress(direccion.id_address, values)}
        >
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item
                label={
                    <span className="mb-3 block text-lg font-medium text-dark dark:text-white">
                      Nombre de Dirección:
                      <span className="text-red">*</span>
                    </span>
                  }
                  name="name"
                  // rules={[{ required: true, message: "Por favor ingresa un nombre para identificar la dirección" }]}
                >
                <input
                  required
                  placeholder="Ingresa un nombre para la dirección"
                  className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 
                  focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={8}>
              <Form.Item
                
                label={
                    <span className="mb-3 block text-lg font-medium text-dark dark:text-white">
                      Dirección:
                      <span className="text-red">*</span>
                    </span>
                  }
                  name="address"
                  // rules={[{ required: true, message: "Por favor ingresa la dirección" }]}
                >
                <input
                  required
                  placeholder="Ingresa tu dirección"
                  className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition 
                  placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary "
                  onBlur={() => geocodeAddress(formData.address)}
                />
              </Form.Item>
            </Col>
    
            <Col xs={24} sm={8}>
              <Form.Item
                label={
                    <span className="mb-3 block text-lg font-medium text-dark dark:text-white">
                      Municipio:
                      <span className="text-red">*</span>
                    </span>
                  }
                  
                >
                
                <SelectGroupOne 
                    name="id_city"
                    customClasses=" mb-3 w-full dark: border-dark-3 dark:text-white dark:focus:border-primary "
                    required
                    value={formData.id_city}
                    opciones={opcionesMunicipios}
                    onChange={handleChange}
                />
              </Form.Item>
            </Col>
          </Row>
    
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                    <span className="mb-3 block text-lg font-medium text-dark dark:text-white">
                      Barrio:
                      <span className="text-red">*</span>
                    </span>
                  }
                  name="neighborhood"
                  // rules={[{ required: true, message: "Por favor ingresa el barrio" }]}

                  >
                <input
                  placeholder="Ingresa tu barrio"
                  required
                  className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition 
                  placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary "
                />
              </Form.Item>
            </Col>
    
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <span className="mb-3 block text-lg font-medium text-dark dark:text-white">
                    Punto de Referencia:
                  </span>
                }
                name="reference">
                
                <input
                  placeholder="Ingresa un punto de referencia"
                  className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition 
                  placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary "
                />
              </Form.Item>
            </Col>
          </Row>
    
          

          <div className="mt-4 flex flex-row justify-between">
            {/* <Button
              className="text-[#5750f1] text-lg"
              type="link"
              href={`https://www.google.com/maps?q=${encodeURIComponent(direccion.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              icon={<MapIcon />}
            >
              Dirígete a la dirección
            </Button> */}

            <Button
              className="relative bottom-4 mt-5 right-4 flex cursor-pointer items-center justify-center rounded-md border border-primary bg-primary px-4 py-3 text-m text-white transition duration-300 ease-in-out hover:bg-primary/90"
              type="link"
              href={`https://www.google.com/maps?q=${encodeURIComponent(direccion.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              icon={<MapIcon />}
            > Dirígete a la dirección
            </Button>
            <Form.Item>
              <button
                  className="flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-primary bg-[6A0DAD] px-4 py-2 font-bold text-primary transition-all delay-100 duration-300 hover:scale-100 hover:bg-primary/90 hover:text-white dark:text-white"
                  type="submit"
                >
                Actualizar dirección
              </button>
            </Form.Item>
          </div>
        </Form>
      </div>
    ),
  }));

  return (
    <div className="p-4 bg-white dark:bg-dark-3 rounded-md shadow-md ">
      <Title level={4} className="text-center mb-4 dark:text-white">Lista de Direcciones</Title>
      <Collapse items={collapseItems} />

      {/* <Button
        type="primary"
        className="mb-4"
        onClick={() => setShowCreateForm(!showCreateForm)}
      >
        Crear Dirección
      </Button> */}

      <button
        onClick={() => setShowCreateForm(!showCreateForm)}
        className="mb-5 flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-primary bg-[6A0DAD] px-4 py-2 font-bold text-primary transition-all delay-100 duration-300 hover:scale-100 hover:bg-primary/90 hover:text-white dark:text-white"
        >
        Crear nueva dirección +
        </button>
      {/* [__________________Crear Dirección__________________________________________________________________________________________________________________________________________________] */}
      {showCreateForm && (
          <Form
            layout="vertical"
            className="wow fadeInUp relative mx-auto max-w-[1200px] overflow-hidden rounded-lg px-8 py-14 dark:bg-dark-2 sm:px-12 md:px-[60px]" data-wow-delay=".15s"
            onFinish={handleCreateAddress}
          >
            <Row gutter={16}>
              <Col xs={24} sm={8}>
                {/* <Form.Item
                  label="Nombre de Dirección"
                  name="name"
                  rules={[{ required: true, message: "Por favor ingresa un nombre para identificar la dirección" }]}>
                  <Input
                    placeholder="Ingresa un nombre para la dirección"
                    className="dark:bg-dark-3 dark:text-dark-8"
                    onChange={handleChange}
                    value={formData.name}
                  />
                </Form.Item> */}
                <Form.Item
                  label={
                      <span className="mb-3 block text-lg font-medium text-dark dark:text-white">
                        Nombre de Dirección:
                        <span className="text-red">*</span>
                      </span>
                    }
                    name="name"
                    // rules={[{ required: true, message: "Por favor ingresa un nombre para identificar la dirección" }]}
                  >
                  <input
                    // required
                    placeholder="Ingresa un nombre para la dirección"
                    className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition 
                    placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                    onChange={handleChange}
                    value={formData.name}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={8}>
                {/* <Form.Item
                  label="Dirección"
                  name="address"
                  id="address"
                  rules={[{ required: true, message: "Por favor ingresa la dirección" }]}>
                  <Input
                    placeholder="Ingresa tu dirección"
                    className="dark:bg-dark-3 dark:text-dark-8"
                    onChange={handleChange}
                    value={formData.address}
                    onBlur={(e) => geocodeAddress(e.target.value)}
                  />
                </Form.Item> */}
                <Form.Item
                label={
                    <span className="mb-3 block text-lg font-medium text-dark dark:text-white">
                      Dirección:
                      <span className="text-red">*</span>
                    </span>
                  }
                  name="address"
                  // rules={[{ required: true, message: "Por favor ingresa la dirección" }]}
                >
                <input
                  // required
                  placeholder="Ingresa tu dirección"
                  className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition 
                  placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary "
                  onChange={handleChange}
                  value={formData.address}
                  onBlur={(e) => geocodeAddress(e.target.value)}
                />
              </Form.Item>
              </Col>

              <Col xs={24} sm={8}>
                {/* <Form.Item
                  label="Municipio"
                  name="id_city"
                  rules={[{ required: true, message: "Por favor selecciona un municipio" }]}>
                  <Select
                    placeholder="Selecciona un municipio"
                    className="dark:bg-dark-3 dark:text-dark-8"
                    onChange={(value: string) => handleChange({ target: { name: 'id_city', value } } as React.ChangeEvent<HTMLSelectElement>)}
                    value={formData.id_city}
                  >
                    {ciudades.map((city) => (
                      <Option key={city.id_city} value={city.id_city}>
                        {city.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item> */}
                <Form.Item
                label={
                    <span className="mb-3 block text-lg font-medium text-dark dark:text-white">
                      Municipio:
                      <span className="text-red">*</span>
                    </span>
                  }
                >
                <SelectGroupOne 
                    name="id_city"
                    customClasses=" mb-3 w-full dark: border-dark-3 dark:text-white dark:focus:border-primary "
                    value={formData.id_city}
                    opciones={opcionesMunicipios}
                    onChange={handleChange}
                />
                 
              </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                {/* <Form.Item
                  label="Barrio"
                  name="neighborhood"
                  rules={[{ required: true, message: "Por favor ingresa el barrio" }]}>
                  <Input
                    placeholder="Ingresa tu barrio"
                    className="dark:bg-dark-3 dark:text-dark-8"
                    onChange={handleChange}
                    value={formData.neighborhood}
                  />
                </Form.Item> */}
                <Form.Item
                label={
                    <span className="mb-3 block text-lg font-medium text-dark dark:text-white">
                      Barrio:
                      <span className="text-lg text-red">*</span>
                    </span>
                  }
                  name="neighborhood"
                  // rules={[{ required: true, message: "Por favor ingresa el barrio" }]}

                  >
                <input
                  placeholder="Ingresa tu barrio"
                  // required
                  className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition 
                  placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary "
                  onChange={handleChange}
                  value={formData.neighborhood}
                />
              </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                {/* <Form.Item
                  label="Punto de Referencia"
                  name="reference">
                  <Input
                    placeholder="Ingresa un punto de referencia"
                    className="dark:bg-dark-3 dark:text-dark-8"
                    onChange={handleChange}
                    value={formData.reference}
                  />
                </Form.Item> */}

                <Form.Item
                label={
                  <span className="mb-3 block text-lg font-medium text-dark dark:text-white">
                    Punto de Referencia:
                    <span className="text-red">*</span>
                  </span>
                }
                name="reference">
                
                <input
                  placeholder="Ingresa un punto de referencia"
                  className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition 
                  placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary "
                  onChange={handleChange}
                  value={formData.reference}
                />
              </Form.Item>
              </Col>
            </Row>

            {/* Mapa de Google Maps */}
            <div className="mt-4 flex flex-row justify-end">

              <Form.Item>
                <button
                    className="flex  bottom-4 right-4 cursor-pointer items-center rounded-md border border-primary bg-primary px-4 py-3 text-m text-white transition duration-300 ease-in-out hover:bg-primary/90"
                    type="submit"
                  >
                  Crear dirección
                </button>
              </Form.Item>
            </div>
            <Col>
              <div id="map" ref={mapRef} style={{ width: "100%", height: "400px", marginTop: "20px" }} />
            </Col>
          </Form>
      )}
    </div>
  );
};

export default ListaDir;
