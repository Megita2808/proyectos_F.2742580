"use client"
import { useState, useEffect } from "react";
import SelectGroupOne from "@/components/FormElements/SelectGroup/SelectGroupOne";
import InputGroup from "@/components/FormElements/InputGroup";
import SwitcherThree from "@/components/FormElements/Switchers/SwitcherThree";
import { fetchCategories } from "@/api/fetchs/get_categorias";
import SliderObjects from "@/components/SliderObjects/SliderObjects";
import ImageInput from "@/components/ImageInput/ImageInput";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import { postProducts } from "@/api/fetchs/posts/post_producto";
import { postImagenes } from "@/api/fetchs/posts/post_imagenes";
import cambiar_estado_productos from "@/api/functions/changeStatus_Productos";
import SwitcherProductsForm from "@/components/FormElements/Switchers/SwitcherProductsForm";
import { postPurchases } from "@/api/fetchs/posts/post_compra";
import { checkToken } from "@/api/validations/check_cookie";
import Swal from "sweetalert2";
import toast, { Toaster } from 'react-hot-toast';

interface ImageData {
    uid: string;
    name: string;
    status: string;
    url: string;
}

const editarProducto: React.FC<{ handleClose: () => void }> = ({ handleClose }) => {
    const [images, setImages] = useState<ImageData[]>([]);
    const [clearImages, setClearImages] = useState(false);
    const [opcionesCategorias, setOpcionesCategorias] = useState<{ id: number; name: string }[]>([]);
    const [dataUser, setDataUser] = useState({id_user : 1});

    useEffect(() => {
        const getCategorias = async () => {
            const categories = await fetchCategories();
            setOpcionesCategorias(categories.map((cat) => ({
                id: cat.id_category,
                name: cat.name
            })).sort((a, b) => a.id - b.id));
        };
        const getDataUser = async () => {
            const {data} = await checkToken();
            setDataUser(data);
        }
        getCategorias();
        getDataUser();
    }, []);


    const [formData, setFormData] = useState({
        name: '',
        id_category: '0',
        total_quantity: '',
        unit_price: '',
        unit_price_public: '',
        description: '',
        purchase_date: '',
        // status: true,
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value, name, type } = event.target;
        const fieldName = id || name;
    
        setFormData(prevState => ({
            ...prevState,
            [fieldName]: type === 'checkbox' ? (event.target as HTMLInputElement).checked : value,
        }));
    };

    const handleDateChange = (date: Date | null) => {
        setFormData(prevState => ({
            ...prevState,
            purchase_date: date ? date.toISOString() : "",
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log(formData, "FormData");
        console.log(images, "imagenes");
      
        // Validaciones
        if (!formData.name || !formData.unit_price || !formData.description || !formData.purchase_date) {
          Swal.fire({
            icon: "error",
            title: "Faltan campos obligatorios",
            text: "Por favor complete todos los campos obligatorios.",
            iconColor: "#ff4747",
            background: "#f8d7da",
            color: "#721c24",
          });
          return;
        }
        if (images.length == 0) {
            
            toast.error("No hay imagenes")

              return;
        }
      
        if (isNaN(Number(formData.unit_price)) || Number(formData.unit_price) <= 0) {
          Swal.fire({
            icon: "error",
            title: "Precio inválido",
            text: "El precio debe ser un número mayor a 0.",
            iconColor: "#ff4747",
            background: "#f8d7da",
            color: "#721c24",
          });
          return;
        }
      
        if (isNaN(Number(formData.total_quantity)) || Number(formData.total_quantity) < 0) {
          Swal.fire({
            icon: "error",
            title: "Cantidad inválida",
            text: "La cantidad debe ser un número mayor o igual a 0.",
            iconColor: "#ff4747",
            background: "#f8d7da",
            color: "#721c24",
          });
          return;
        }
      
        if (!formData.id_category || formData.id_category === '0') {
          Swal.fire({
            icon: "error",
            title: "Categoría no seleccionada",
            text: "Por favor selecciona una categoría válida.",
            iconColor: "#ff4747",
            background: "#f8d7da",
            color: "#721c24",
          });
          return;
        }
      
        if (!images.length) {
          Swal.fire({
            icon: "error",
            title: "Imagenes faltantes",
            text: "Por favor sube al menos una imagen del producto.",
            iconColor: "#ff4747",
            background: "#f8d7da",
            color: "#721c24",
          });
          return;
        }
      

        try {
          const dataPostProducts = {
            name: formData.name,
            total_quantity: 0,
            price: formData.unit_price,
            description: formData.description,
            id_category: formData.id_category,
            // status: formData.status
          };
      
          const createdProduct = await postProducts(dataPostProducts);
          const createdImages = await postImagenes(createdProduct, images);
      
          const dataPostPurchase = {
            id_product: createdProduct.id_product,
            id_user: dataUser.id_user,
            purchase_date: formData.purchase_date,
            quantity: formData.total_quantity,
            unit_price: formData.unit_price,
          };
          const createdPurchase = await postPurchases(dataPostPurchase);
      
          setImages([]);
          setClearImages(true);
          console.log("Producto creado:", createdProduct);
          console.log("Imagenes creadas:", createdImages);
          console.log("Compra creada:", createdPurchase);
      
          const quantity = createdPurchase.quantity;
          const nameProduct = createdProduct.name;
          console.log({ createdProduct });
      
          handleClose();
          await Swal.fire({
            icon: "success",
            iconColor: "#111928",
            color: "#111928",
            title: "Producto creado!!",
            text: `Se ha generado la compra de (${quantity}) unidades de '${nameProduct}'`,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            position: 'top-end',
            background: "url(/images/grids/bg-morado-bordes.avif)",
            customClass: {
              popup: 'rounded-3xl shadow shadow-6',
            }
          });
      
          setFormData({
            name: '',
            id_category: '0',
            total_quantity: '',
            unit_price: '',
            unit_price_public: '',
            description: '',
            purchase_date: '',
            // status: true,
          });
      
        } catch (error) {
          console.error("Error al crear el producto:", error);
        }
      };      

    return (
        <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card text-xl">
            <form onSubmit={handleSubmit}>
                <div className="p-6.5">
                    <div className="mb-3 flex flex-col gap-4.5 xl:flex-row">
                        <InputGroup
                            id="name"
                            name="name"
                            label="Nombre del producto"
                            type="text"
                            placeholder="Ingresa el nombre completo del producto"
                            customClasses="w-full"
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />
                        
                        <SelectGroupOne 
                            id="id_category"
                            name="id_category"
                            label="Categoría"
                            placeholder="Selecciona una categoría"
                            customClasses="mb-3 w-full xl:w-1/2"
                            required
                            value={formData.id_category}
                            opciones={opcionesCategorias}
                            onChange={handleChange}
                        />
                    </div>
                    
                    
                    <div className="mb-3 flex gap-4.5 flex-row">
                        <InputGroup
                            id="total_quantity"
                            name="total_quantity"
                            label="Cantidad inicial"
                            type="number"
                            placeholder="Ingresa la cantidad inicial del producto"
                            customClasses="mb-3 w-full"
                            required
                            value={formData.total_quantity}
                            onChange={handleChange}
                        />
                        
                        <DatePickerOne  
                            customClasses="mb-3 w-full lg:w-1/2"
                            id="purchase_date"
                            name="purchase_date"
                            label="Fecha de compra"
                            required
                            value={formData.purchase_date}
                            onChange={handleDateChange}
                        />
                        
                       
                    </div>

                    <div className="mb-3 flex flex-col gap-4.5 xl:flex-row">
                        <InputGroup
                            id="unit_price"
                            name="unit_price"
                            label="Valor unitario de compra"
                            type="number"
                            placeholder="Ingresa el costo de compra por unidad"
                            customClasses="mb-3 w-full"
                            required
                            value={formData.unit_price}
                            onChange={handleChange}
                        />

                        <InputGroup
                            id="unit_price_public"
                            name="unit_price_public"
                            label="Valor unitario al público"
                            type="number"
                            placeholder="Ingresa la cantidad inicial del producto"
                            customClasses="mb-3 w-full"
                            required
                            value={formData.unit_price_public}
                            onChange={handleChange}
                        />
                    </div>
                    

                    <div className="mb-3">
                        <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
                            Descripción:
                            <span className="text-red">*</span>
                        </label>
                        <div className="relative">
                        <div className="relative">
                            <textarea
                                id="description"
                                name="description"
                                rows={5}
                                maxLength={1500}
                                style={{
                                    overflow: "auto",
                                    scrollbarWidth: "none",
                                }}
                                placeholder="Escribe la descripción del producto"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full resize-none pb-6 rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                                required
                            ></textarea>
                            <div className="absolute bottom-2 right-5 text-lg text-dark-6 dark:text-dark-4">
                                {formData.description.length} / 1500
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
                            Imágenes:
                            <span className="text-red">*</span>
                        </label>
                        <ImageInput setImages={setImages} clearImages={clearImages} />
                    </div>
                    
                    {/* <div className="mb-6">
                        <label className="mb-3 block text-lg font-medium text-dark dark:text-white">
                            Estado:
                        </label>
                        <SwitcherProductsForm id="status" name="status" checked={formData.status} onChange={handleChange}/>
                    </div> */}

                    <button type="submit" className="flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90">
                        Crear producto
                    </button>
                </div> 
            </form>
            <Toaster
                position="bottom-right"
                reverseOrder={false}
            />
        </div>
    );
};

export default editarProducto;