import { useState, useEffect } from "react";
import { fetchProductById, fetchProducts } from "@/api/fetchs/get_productos"; // Usamos fetchProducts
import { fetchCategories } from "@/api/fetchs/get_categorias";
import Swal from "sweetalert2";
import ImageInput from "@/components/ImageInput/ImageInput";
import SelectGroupOne from "@/components/FormElements/SelectGroup/SelectGroupOne";
import InputGroup from "@/components/FormElements/InputGroup";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import { updateProduct } from "@/api/fetchs/puts/put_producto";
import LoaderBasic from "@/components/Loaders/LoaderBasic";
import toast, {Toaster} from 'react-hot-toast'


interface FormData {
    id_product: number;
    name: string;
    total_quantity: number;
    unit_price: string;
    id_category: number;
    description: string;
    images: string[];
  }

// Tu componente de edición de producto
const EditarProducto: React.FC<{ productId?: number; handleClose: () => void }> = ({ productId = 1, handleClose }) => {
    const [productosOpc, setProductosOpc] = useState<{ id: number; name: string }[]>([]);
    const [categoriasOpc, setCategoriasOpc] = useState<{ id: number; name: string }[]>([]);
    const [images, setImages] = useState<any[]>([]);
    const [clearImages, setClearImages] = useState(false);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState<FormData>({
        id_product: 0,
        name: "",
        total_quantity: 0,
        unit_price: "",
        id_category: 0,
        description: "",
        images: [],
      });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener los datos del producto específico por ID
                const producto = await fetchProductById(productId);  
                const imagenes = producto.images;
                const urls = imagenes.map((img, index) => {
                    return {
                        uid: `${index}`,
                        name: `image_${index}.png`,
                        status: 'done',
                        url: img,
                    };
                });
                setImages(urls);
                const categorias = await fetchCategories();
                setCategoriasOpc(categorias.map((cat) => ({
                    id: cat.id_category,
                    name: cat.name,
                })));

                // Llenar el formulario con los datos del producto
                setFormData({
                    id_product: producto.id_product,
                    name: producto.name,
                    total_quantity: producto.total_quantity,
                    unit_price: producto.price,
                    id_category: producto.id_category,
                    description: producto.description,
                    images: producto.images,
                });

                // Obtener todos los productos para llenar las opciones del select
                const productos = await fetchProducts(); // Usamos fetchProducts para obtener todos los productos
                console.log('Respuesta de la API (productos):', productos);  // Verificar la respuesta

                // Verificar si productos es un arreglo antes de usar .map()
                if (Array.isArray(productos)) {
                    setProductosOpc(productos.map((prod) => ({
                        id: prod.id_product,
                        name: prod.name,
                    })));
                } else {
                    console.error("La respuesta de la API no es un arreglo", productos);
                }
            } catch (error) {
                console.error("Error al cargar datos del producto:", error);
            }
            setLoading(false)
        };

        fetchData();
    }, [productId]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value, name } = event.target;
        const fieldName = id || name;
        setFormData(prevState => ({
            ...prevState,
            [fieldName]: value,
        }));
        console.log({formData})
    };


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const updatedProduct = {
                name: formData.name,
                total_quantity: formData.total_quantity,
                price: formData.unit_price,
                id_category: formData.id_category,
                description: formData.description,
                // image: formData.image,
            };
            console.log({updatedProduct})

            toast.promise(
                updateProduct(productId, updatedProduct)
                  .then((response) => {
                    console.log('Respuesta exitosa:', response); // Imprime la respuesta exitosa
                    return response; // Asegúrate de devolver la respuesta para que `toast.promise` la maneje como éxito
                  })
                  .catch((error) => {
                    console.error('Error en la actualización:', error); // Imprime el error
                    throw error; // Lanza el error para que `toast.promise` lo maneje como fallo
                  }),
                {
                  loading: 'Actualizando...',
                  success: (data) => {
                    console.log('Datos del éxito:', data); // Puedes ver los datos del éxito en la consola
                    return <b>Producto Actualizado!</b>;
                  },
                  error: (err) => {
                    console.error('Error al actualizar:', err); // Puedes ver el error en la consola
                    return <b>Error al intentar actualizar el Producto.</b>;
                  },
                }
              );   
              handleClose();


            
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
        }
    };

    return (
        <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
            {loading ? (
                <LoaderBasic />
            ): (
                <form onSubmit={handleSubmit}>
                <div className="p-6.5">
                    <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                        <InputGroup
                            id="name"
                            name="name"
                            label="Nombre del Producto"
                            placeholder="Ingresa el nombre del producto"
                            customClasses="mb-3 w-full"
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <SelectGroupOne 
                            id="id_category" 
                            name="id_category" 
                            label="Categoría"
                            placeholder="Selecciona la categoría"
                            customClasses="mb-3 w-full"
                            required
                            value={formData.id_category} 
                            opciones={categoriasOpc}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3 flex gap-4.5 flex-row">
                        <InputGroup
                            id="total_quantity"
                            name="total_quantity"
                            label="Cantidad de Productos"
                            type="number"
                            placeholder="Ingresa la cantidad de productos"
                            customClasses="mb-3 w-full"
                            required
                            value={formData.total_quantity}
                            onChange={handleChange}
                            disabled 
                        />
                        <InputGroup
                            id="unit_price"
                            name="unit_price"
                            label="Valor unitario"
                            type="number"
                            placeholder="Ingresa el valor por unidad"
                            customClasses="mb-3 w-full"
                            required
                            value={formData.unit_price}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-3 flex gap-4.5 flex-row">
                        <InputGroup
                            id="description"
                            name="description"
                            label="Descripción"
                            placeholder="Ingresa una descripción del producto"
                            customClasses="mb-3 w-full"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <ImageInput setImages={setImages} clearImages={clearImages} defaultFileList={images}/>

                    <button type="submit" className="mb-2 flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-primary bg-[6A0DAD] px-4 py-2 font-bold text-primary transition-all delay-100 duration-300 hover:scale-100 hover:bg-primary/90 hover:text-white dark:text-white">
                        Actualizar producto
                    </button>
                </div>
            </form>
            )}
            <Toaster position="bottom-right" />
        </div>
    );
};

export default EditarProducto;
