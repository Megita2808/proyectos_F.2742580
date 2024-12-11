"use client"
import { useState, useEffect } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { postCities } from "@/api/fetchs/posts/post_municipio";
import { fetchCities } from "@/api/fetchs/get_ciudades";
import toast from 'react-hot-toast'; 

const crearMunicipio = () => {

    const [formData, setFormData] = useState({
        name: ''
    });
    const [cities, setCities] = useState<string[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadCities = async () => {
          try {
            const existingCities = await fetchCities();
            setCities(existingCities.map((city: any) => city.name));
          } catch (error) {
            console.error("Error al cargar los municipios:", error);
          }
        };
        loadCities();
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

        if (cities.includes(formData.name.trim())) {
            setError("Ya existe un municipio con ese nombre.");
            return;
        }

        toast.promise(
            postCities({ name: formData.name.trim() }), 
            {
                loading: 'Creando municipio...', 
                success: <b>Municipio creado correctamente!</b>, 
                error: <b>Error al crear el municipio.</b>, 
            }
        )
        .then((createdCity) => {
            setCities((prev) => [...prev, createdCity.name]);

            setFormData({ name: "" });
        })
        .catch((error) => {
            console.error("Error al crear el municipio:", error);
            setError("Hubo un problema al crear el municipio. Intenta nuevamente.");
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
                            label="Nombre del Municipio"
                            type="text"
                            placeholder="Ingresa el nombre completo del municipio"
                            customClasses="w-full"
                            required
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div> 
                    {error && <p className="text-red-500">{error}</p>}
                    <button type="submit" className="flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90">
                        Crear municipio
                    </button>
                </div>
            </form>
        </div>
    );
};

export default crearMunicipio;
