"use client";
import { useState, useEffect } from "react";
import InputGroup from "@/components/FormElements/InputGroup";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const CrearUsuario = () => {
    const [formData, setFormData] = useState({
        names: '',
        lastnames: '',
        dni: '',
        mail: '',
        password: '',
        phone_number: '',
        id_rol: 0,
    });

    const [rolesOpc, setRolesOpc] = useState<{ id_rol: number; name: string }[]>([]);

    const [existingUsers, setExistingUsers] = useState<{ dni: string; mail: string }[]>([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch('https://api-aguamarina-mysql-v2.onrender.com/api/v2/roles');
                if (!response.ok) {
                    throw new Error('Error al obtener los roles');
                }
                const rolesData = await response.json();
                setRolesOpc(rolesData.body);
            } catch (error) {
                console.error("Error al cargar los roles:", error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await fetch('https://api-aguamarina-mysql-v2.onrender.com/api/v2/users');
                if (!response.ok) {
                    throw new Error('Error al obtener los usuarios');
                }
                const usersData = await response.json();
                setExistingUsers(usersData.body.map((user: any) => ({ dni: user.dni, mail: user.mail })));
            } catch (error) {
                console.error("Error al cargar los usuarios:", error);
            }
        };

        fetchRoles();
        fetchUsers();
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value, name } = event.target;
        const fieldName = id || name;

        setFormData(prevState => ({
            ...prevState,
            [fieldName]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log(formData, "FormData");

        const existingUser = existingUsers.find(user => user.dni === formData.dni || user.mail === formData.mail);

        if (existingUser) {
            toast.error('El DNI o el correo electrónico ya están registrados.');
            return;
        }

        const confirmResult = await Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Quieres agregar al usuario ${formData.names}?`,
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
            return;
        }

        try {
            const dataPostUser = {
                names: formData.names,
                lastnames: formData.lastnames,
                dni: formData.dni,
                mail: formData.mail,
                password: formData.password,
                phone_number: formData.phone_number,
                id_rol: formData.id_rol,
            };

            const response = await fetch('https://api-aguamarina-mysql-v2.onrender.com/api/v2/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataPostUser),
            });

            if (!response.ok) {
                throw new Error('Error al crear el usuario');
            }

            const createdUser = await response.json();
            console.log("Usuario creado:", createdUser);

            setExistingUsers(prev => [...prev, { dni: createdUser.dni, mail: createdUser.mail }]);

            toast.success("Usuario creado con éxito");

            // Limpiar el formulario
            setFormData({
                names: '',
                lastnames: '',
                dni: '',
                mail: '',
                password: '',
                phone_number: '',
                id_rol: 0,
            });

        } catch (error) {
            console.error("Error al crear el usuario:", error);
            toast.error("Error al crear el usuario");
        }
    };

    return (
        <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card text-xl">
            <form onSubmit={handleSubmit}>
                <div className="p-6.5">
                    <div className="mb-3 flex flex-col gap-4.5 xl:flex-row">
                        <InputGroup
                            id="names"
                            name="names"
                            label="Nombres"
                            type="text"
                            placeholder="Ingresa los nombres completos"
                            customClasses="w-full"
                            required
                            value={formData.names}
                            onChange={handleChange}
                        />
                        <InputGroup
                            id="lastnames"
                            name="lastnames"
                            label="Apellidos"
                            type="text"
                            placeholder="Ingresa los apellidos completos"
                            customClasses="w-full"
                            required
                            value={formData.lastnames}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3 flex flex-col gap-4.5 xl:flex-row">
                        <InputGroup
                            id="dni"
                            name="dni"
                            label="Documento"
                            type="text"
                            placeholder="Ingresa el numero de documento"
                            customClasses="w-full"
                            required
                            value={formData.dni}
                            onChange={handleChange}
                        />
                        <InputGroup
                            id="mail"
                            name="mail"
                            label="Correo electrónico"
                            type="email"
                            placeholder="Ingresa el correo electrónico"
                            customClasses="w-full"
                            required
                            value={formData.mail}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3 flex flex-col gap-4.5 xl:flex-row">
                        <InputGroup
                            id="phone_number"
                            name="phone_number"
                            label="Número de Teléfono"
                            type="text"
                            placeholder="Ingresa el número de teléfono"
                            customClasses="w-full"
                            value={formData.phone_number}
                            onChange={handleChange}
                        />
                        <InputGroup
                            id="password"
                            name="password"
                            label="Contraseña"
                            type="password"
                            placeholder="Ingresa la contraseña"
                            customClasses="w-full"
                            required
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-3 flex flex-col gap-4.5 xl:flex-row">
                        <select
                            id="id_rol"
                            name="id_rol"
                            className="relative z-20 w-full appearance-none rounded-[7px] border border-stroke bg-transparent px-5.5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary cursor-pointer"
                            value={formData.id_rol}
                            onChange={handleChange}
                        >
                            <option value={0} disabled>Selecciona un rol</option>
                            {rolesOpc.map((role) => (
                                <option key={role.id_rol} value={role.id_rol}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="flex w-full justify-center rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90">
                        Crear Usuario
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CrearUsuario;
