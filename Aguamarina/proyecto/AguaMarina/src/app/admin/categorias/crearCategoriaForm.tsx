"use client"
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import InputGroup from "@/components/FormElements/InputGroup";
import { postCategories } from "@/api/fetchs/posts/post_categoria";
import { fetchCategories } from "@/api/fetchs/get_categorias";
import toast from 'react-hot-toast'; 

const normalizeName = (name: string) => {
    const normalized = name.trim().toLowerCase();
    return normalized.endsWith("s") && normalized.length > 1
        ? normalized.slice(0, -1)
        : normalized;
};

const crearCategoria = () => {

    const [formData, setFormData] = useState({
        name: ''
    });
    const [categories, setCategories] = useState<string[]>([]); 
    const [error, setError] = useState("");

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const existingCategories = await fetchCategories();
                setCategories(
                    existingCategories.map((category: any) => normalizeName(category.name))
                ); 
            } catch (error) {
                console.error("Error al cargar las categorías:", error);
            }
        };
        loadCategories();
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value, name, type } = event.target;
        const fieldName = id || name;

        setFormData(prevState => ({
            ...prevState,
            [fieldName]: type === 'checkbox' ? (event.target as HTMLInputElement).checked : value,
        }));
        setError("");
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log(formData, "FormData");

        const normalizedName = normalizeName(formData.name);

        if (categories.includes(normalizedName)) {
            await Swal.fire({
                icon: "error",
                iconColor: "#000",
                title: "Categoría existente",
                text: "Ya existe una categoría con ese nombre.",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#000",
                background: "url(/images/grids/bg-morado-bordes.avif)",
                customClass: {
                    popup: "rounded-3xl shadow shadow-6",
                    container: "custom-background",
                    confirmButton: "rounded-xl",
                },
            });
            setFormData({ name: "" }); 
            return;
        }

        const result = await Swal.fire({
            text: `¿Estás seguro de que deseas agregar la categoría? "${formData.name}"?`,
            icon: "question",
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


        if (!result.isConfirmed) {
            return;
        }


        toast.promise(
            postCategories({ name: formData.name.trim() }), 
            {
                loading: 'Creando categoría...', 
                success: <b>Categoría creada correctamente!</b>, 
                error: <b>Error al crear la categoría.</b>, 
            }
        )
        .then((createdCategory) => {
            setCategories((prev) => [...prev, normalizeName(createdCategory.name)]);

            setFormData({ name: "" }); 
        })
        .catch((error) => {
            console.error("Error al crear la categoría:", error);
            setError("Hubo un problema al crear la categoría. Intenta nuevamente.");
        });
    };

    return (
        <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card text-xl">
            <form onSubmit={handleSubmit}>
                <div className="p-6.5">
                    <div className="mb-3 flex flex-col gap-4.5 xl:flex-row">
                        <InputGroup
                            id="name"
                            name="name"
                            label="Nombre de la categoría"
                            type="text"
                            placeholder="Ingresa el nombre completo de la categoría"
                            customClasses="w-full"
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div> 
                    {error && <p className="text-red-500">{error}</p>}
                    <button type="submit" className="mb-2 flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-primary bg-[6A0DAD] px-4 py-2 font-bold text-primary transition-all delay-100 duration-300 hover:scale-100 hover:bg-primary/90 hover:text-white dark:text-white">
                        Crear categoría
                    </button>
                </div>
            </form>
        </div>
    );
};

export default crearCategoria;
