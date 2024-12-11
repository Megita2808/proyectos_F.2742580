"use client"
import { useState, useEffect } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import { fetchCategories } from "@/api/fetchs/get_categorias"; 
import { putCategories } from "@/api/fetchs/puts/put_categories";
import toast, { Toaster } from 'react-hot-toast';


interface EditCategoriaFormProps {
  id_category: number; 
}

const EditCategoriaForm = ({ id_category }: EditCategoriaFormProps) => {
  const [formData, setFormData] = useState({ name: "" });

  useEffect(() => {

    const fetchCategoria = async () => {
      try {
        const response = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/categories/${id_category}`);
        const category = await response.json();
        setFormData({ name: category.body.name }); 
      } catch (error) {
        console.error("Error al cargar la categoría:", error);
      }
    };

    fetchCategoria();
  }, [id_category]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFormData({ name: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    toast.promise(
      putCategories(id_category, formData.name),
      {
        loading: 'Actualizando categoría...', 
        success: <b>Categoría actualizada correctamente!</b>,
        error: <b>Error al actualizar la categoría.</b>, 
      }
    );
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

          <button type="submit" className="mb-2 flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-primary bg-[6A0DAD] px-4 py-2 font-bold text-primary transition-all delay-100 duration-300 hover:scale-100 hover:bg-primary/90 hover:text-white dark:text-white">
            Actualizar categoría
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCategoriaForm;
