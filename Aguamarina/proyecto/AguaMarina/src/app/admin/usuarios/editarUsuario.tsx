"use client";
import { useState, useEffect } from "react";
import { putUser } from "@/api/fetchs/puts/put_usuarios";
import Swal from "sweetalert2";
import InputGroup from "@/components/FormElements/InputGroup";
import SelectGroupOne from "@/components/FormElements/SelectGroup/SelectGroupOne";
import { fetchRoles } from "@/api/fetchs/get_roles"; 

const EditarUsuario: React.FC<{ userId?: number; handleClose: () => void }> = ({ userId = 1, handleClose }) => {
    const [rolesOpc, setRolesOpc] = useState<{ id: number; name: string }[]>([]);
    const [formData, setFormData] = useState({
        id_user: 0,
        names: "",
        lastnames: "",
        dni: "",
        mail: "",
        phone_number: "",
        id_rol: 0,
        status: false,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://api-aguamarina-mysql-v2.onrender.com/api/v2/users/${userId}`);
                if (!response.ok) {
                    throw new Error(`No se pudo obtener el usuario. Status: ${response.status}`);
                }
                const responseData = await response.json();
                const user = responseData.body;

                setFormData({
                    id_user: user.id_user,
                    names: user.names,
                    lastnames: user.lastnames,
                    dni: user.dni,
                    mail: user.mail,
                    phone_number: user.phone_number,
                    id_rol: user.id_rol,
                    status: user.status,
                });

                const rolesResponse = await fetchRoles();
                setRolesOpc(rolesResponse.map((role) => ({
                    id: role.id_rol,
                    name: role.name
                })));

            } catch (error) {
                console.error("Error al cargar los datos del usuario:", error);
                Swal.fire("Error", "Hubo un problema al cargar los datos del usuario.", "error");
            }
        };

        fetchData();
    }, [userId]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
      
        const updatedUser = {
          id_user: formData.id_user,
          names: formData.names,
          lastnames: formData.lastnames,
          dni: formData.dni,
          mail: formData.mail,
          phone_number: formData.phone_number,
          id_rol: formData.id_rol,
          status: formData.status,
        };
      
        try {
          await putUser(userId, updatedUser);
          let timerInterval: number | NodeJS.Timeout;
            await Swal.fire({
            icon: "success",
            iconColor: "#000",
            color: "#000",
            title: "Usuario Actualizado",
            html: "Los datos del usuario se han actualizado correctamente. <b>3</b> segundos...",
            timerProgressBar: true,
            showConfirmButton: false,
            cancelButtonColor: "#000",
            cancelButtonText: "Cerrar",
            timer: 3000,
            background: "url(/images/grids/bg-morado-bordes.avif)",
            customClass: {
                popup: "rounded-3xl shadow shadow-6",
                container: "custom-background",
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
        });
      
          handleClose();
        } catch (error) {
          console.error("Error al actualizar el usuario:", error);
          Swal.fire("Error", "No se pudo actualizar el usuario.", "error");
        }
      };

    return (
        <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
            <form onSubmit={handleSubmit}>
                <div className="p-6.5">
                    <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                        <InputGroup
                            id="names"
                            name="names"
                            label="Nombre(s)"
                            placeholder="Ingresa el nombre del usuario"
                            customClasses="mb-3 w-full"
                            required
                            value={formData.names}
                            onChange={handleChange}
                        />
                        <InputGroup
                            id="lastnames"
                            name="lastnames"
                            label="Apellido(s)"
                            placeholder="Ingresa el apellido del usuario"
                            customClasses="mb-3 w-full"
                            required
                            value={formData.lastnames}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                        <InputGroup
                            id="dni"
                            name="dni"
                            label="Documento"
                            type="text"
                            placeholder="Ingresa el DNI del usuario"
                            customClasses="mb-3 w-full"
                            required
                            value={formData.dni}
                            onChange={handleChange}
                        />
                        <InputGroup
                            id="mail"
                            name="mail"
                            label="Correo electrónico"
                            type="email"
                            placeholder="Ingresa el correo electrónico del usuario"
                            customClasses="mb-3 w-full"
                            required
                            value={formData.mail}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-4.5 flex flex-col gap-4.5 xl:flex-row">
                        <InputGroup
                            id="phone_number"
                            name="phone_number"
                            label="Teléfono"
                            type="text"
                            placeholder="Ingresa el número de teléfono del usuario"
                            customClasses="mb-3 w-full"
                            value={formData.phone_number}
                            onChange={handleChange}
                        />
                        <SelectGroupOne
                            id="id_rol"
                            name="id_rol"
                            label="Rol"
                            placeholder="Selecciona el rol"
                            customClasses="mb-3 w-full"
                            required
                            value={formData.id_rol.toString() || "1"}
                            opciones={rolesOpc}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-primary bg-[6A0DAD] px-4 py-2 font-bold text-primary transition-all delay-100 duration-300 hover:scale-100 hover:bg-primary/90 hover:text-white dark:text-white">
                        Actualizar Usuario
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditarUsuario;
