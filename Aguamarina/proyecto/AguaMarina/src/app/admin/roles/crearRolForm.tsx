"use client"
import { useState, useEffect } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import Swal from "sweetalert2";
import toast, { Toaster } from 'react-hot-toast';
import TransferBasic from "@/components/Transfer/TransferBasic";
import { postRol } from "@/api/fetchs/posts/post_rol";

interface ImageData {
    uid: string;
    name: string;
    status: string;
    url: string;
}

interface FormData {
  name : string,
  description : string,
  permissions : any[]
}

const CrearRolForm: React.FC<{ handleClose: () => void }> = ({ handleClose }) => {
    const [selectedPermissions, setSelectedPermissions] = useState<any[]>([]);
    const [keyTransfer, setKeyTransfer] = useState(0);
    const [formData, setFormData] = useState<FormData>({
      name: '',
      description: '',
      permissions: [],
  });

    useEffect(() => {
  
      const setPermissions = async () => {
        const permissionsIds = await Promise.all(
          selectedPermissions.map((per: any) => per.key)
        );
        setFormData((prevState) => ({
          ...prevState,
          permissions: permissionsIds,
        }));
      };
  
      if (selectedPermissions.length > 0) {
        setPermissions(); // Ejecuta la función solo si hay permisos seleccionados
      }
    }, [selectedPermissions]);


    

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value, name, type } = event.target;
        const fieldName = id || name;
        console.log({formData})
    
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
      
        // Validaciones
      
        // if (!images.length) {
        //   Swal.fire({
        //     icon: "error",
        //     title: "Imagenes faltantes",
        //     text: "Por favor sube al menos una imagen del producto.",
        //     iconColor: "#ff4747",
        //     background: "#f8d7da",
        //     color: "#721c24",
        //   });
        //   return;
        // }
      
        // Si todas las validaciones son correctas, proceder con la creación del producto y la compra
        try {
          const dataPostRol = {
            name: formData.name,
            description: formData.description,
            permissions: formData.permissions,
          };
      
          const createdRol = await postRol(dataPostRol);
          const nameRol = createdRol.name;
      
          handleClose();
          setKeyTransfer(keyTransfer + 1)
          // await Swal.fire({
          //   icon: "success",
          //   iconColor: "#111928",
          //   color: "#111928",
          //   title: "Rol Creado!!",
          //   text: `Se ha cerado el rol de '${nameRol}'`,
          //   showConfirmButton: false,
          //   timer: 3000,
          //   timerProgressBar: true,
          //   position: 'top-end',
          //   background: "url(/images/grids/bg-morado-bordes.avif)",
          //   customClass: {
          //     popup: 'rounded-3xl shadow shadow-6',
          //   }
          // });
          toast.success(`Rol (${nameRol}) fue creado correctamente`)
      
          setFormData({
            name: '',
            description: '',
            permissions: [],
          });
      
        } catch (error) {
          console.error("Error al crear el rol:", error);
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
                            label="Nombre del Rol"
                            type="text"
                            placeholder="Ingresa un nombre personalizado para el rol"
                            customClasses="mb-3 w-full"
                            required
                            value={formData.name}
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
                                placeholder="Describe la función principal que cumplirá el rol"
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
                            Permisos:
                            <span className="text-red">*</span>
                        </label>
                        <TransferBasic key={keyTransfer} setSelectedPermissions={setSelectedPermissions}/>
                    </div>

                    <button type="submit" className="flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-primary bg-[6A0DAD] px-4 py-2 font-bold text-primary transition-all delay-100 duration-300 hover:scale-100 hover:bg-primary/90 hover:text-white dark:text-white">
                        Crear Rol
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

export default CrearRolForm;
