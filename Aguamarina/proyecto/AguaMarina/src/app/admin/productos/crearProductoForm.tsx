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

function capitalizeFirstLetter(str: string): string {
    return str
      .split(' ') 
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
      .join(' ');
  }

const crearProducto: React.FC<{ handleClose: () => void }> = ({ handleClose }) => {
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
        if (!formData.name || !formData.unit_price || !formData.description || !formData.purchase_date || !formData.unit_price_public || !formData.total_quantity) {
          toast.error("Por favor complete todos los campos obligatorios.")
          return;
        }
        if (!formData.id_category || formData.id_category === '0') {
          toast.error("Por favor selecciona una categoría válida.")
          return;
        }
        if (isNaN(Number(formData.total_quantity)) || Number(formData.total_quantity) < 0) {
          toast.error("La cantidad debe ser un número mayor o igual a 0.")
          return;
        }
        if (isNaN(Number(formData.unit_price)) || Number(formData.unit_price) <= 0) {
          toast.error("El precio debe ser un número mayor a 0.")
          return;
        }
        if (images.length == 0) {
            
            toast.error("Debes subir al menos 1 imagen")
            return;
        }
      
        const confirmResult = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Quieres agregar este producto?",
            icon: 'warning',
            iconColor: "#000",
            showCancelButton: true,
            confirmButtonText: "Sí, agregar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#6A0DAD",
            cancelButtonColor: "#000",
            reverseButtons: true,
            background: "url(/images/grids/bg-morado-bordes.avif)",
            customClass: {
              popup: "rounded-3xl shadow shadow-6",
              container: "custom-background",
              cancelButton: "rounded-xl",
              confirmButton: "rounded-xl",
            },
        });
    
        if (!confirmResult.isConfirmed) {
            // Usuario canceló la acción
            return;
        }
      
        // Si todas las validaciones son correctas, proceder con la creación del producto y la compra
        try {
          const dataPostProducts = {
            name: capitalizeFirstLetter(formData.name),
            total_quantity: 0,
            price: formData.unit_price_public,
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
          toast.success('Producto creado correctamente')
      
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
          toast.error("Ocurrió un error al crear el producto.");
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
                            customClasses="mb-3 w-full"
                            // required
                            value={formData.name}
                            onChange={handleChange}
                        />
                        
                        <SelectGroupOne 
                            id="id_category"
                            name="id_category"
                            label="Categoría"
                            placeholder="Selecciona una categoría"
                            customClasses="mb-3 w-full "
                            // required
                            value={formData.id_category}
                            opciones={opcionesCategorias}
                            onChange={handleChange}
                        />
                    </div>
                    
                    
                    <div className="mb-3 flex flex-col gap-4.5 xl:flex-row">
                        <InputGroup
                            id="total_quantity"
                            name="total_quantity"
                            label="Cantidad inicial"
                            type="number"
                            placeholder="Ingresa la cantidad inicial del producto"
                            customClasses="mb-2 w-full"
                            // required
                            value={formData.total_quantity}
                            onChange={handleChange}
                        />
                        
                        <DatePickerOne  
                            customClasses="mb-3 w-full "
                            id="purchase_date"
                            name="purchase_date"
                            label="Fecha de Compra"
                            // required
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
                            // required
                            value={formData.unit_price}
                            onChange={handleChange}
                        />

                        <InputGroup
                            id="unit_price_public"
                            name="unit_price_public"
                            label="Valor de alquiler al público"
                            type="number"
                            placeholder="Ingresa el valor de alquiler del producto"
                            customClasses="mb-3 w-full"
                            // required
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
                                rows={4}
                                maxLength={300}
                                style={{
                                    overflow: "auto",
                                    scrollbarWidth: "none",
                                }}
                                placeholder="Escribe la descripción del producto"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full resize-none pb-6 rounded-[5px] border-[1px] border-stroke bg-transparent px-3 py-2 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                                required
                            ></textarea>
                            <div className="absolute bottom-2 right-5 text-lg text-dark-6 dark:text-dark-4">
                                {formData.description.length} / 300
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

                    <button type="submit" className="mb-2 flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-primary bg-[6A0DAD] px-4 py-2 font-bold text-primary transition-all delay-100 duration-300 hover:scale-100 hover:bg-primary/90 hover:text-white dark:text-white">
                        Crear producto
                    </button>
                </div>
            </form>
        </div>
    );
};

export default crearProducto;
