let btn_ingresar = document.getElementById("iniciar")
btn_ingresar.addEventListener('click',function ingresar(evento){
    let cedula = document.getElementById("loginCedula").value;
    let contrasena = document.getElementById("loginContrasena").value;
    let recordarme = document.getElementById("loginRecordarme").checked;

    if (cedula === "" || contrasena === "") {
        evento.preventDefault()
        Swal.fire({
            title: "Datos incompletos",
            text: "Por favor, completa todos los campos.",
            icon: "error",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
        });
    }

    if (contrasena.length < 6) {
        evento.preventDefault()
        Swal.fire({
            title: "Revisaste tus datos",
            text: "La contraseña debe tener al menos 6 caracteres.",
            icon: "warning",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
        });
    }

    let usuariosRegistrados = JSON.parse(localStorage.getItem("usuarios")) || [];
    let usuarioEncontrado = usuariosRegistrados.some(function (usuario) {
        return usuario.cedula === cedula && usuario.contrasena === contrasena;
    });

    if (usuarioEncontrado) {
        if (cedula === "1010101010") { 
            Swal.fire({
                title: "Ingreso exitoso!",
                text: "Gracias por preferir AguaMarina.",
                imageUrl: "/vistasCliente/imagenes/Logo_color_-_Negativo_Mesa_de_trabajo_1.png",
                imageWidth: 300,
                imageHeight: 100,
                imageAlt: "Custom image",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didClose: () => {
                    window.location.href = "../../admin.dash/index/index.html";
                }
            });
        } else {
            Swal.fire({
                title: "Ingreso exitoso!",
                text: "Gracias por preferir AguaMarina.",
                imageUrl: "/vistasCliente/imagenes/Logo_color_-_Negativo_Mesa_de_trabajo_1.png",
                imageWidth: 300,
                imageHeight: 100,
                imageAlt: "Custom image",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                didClose: () => {
                    window.location.href = "../../admin.dash/Personas/admin_personas.html";
                }
            });
        }   
    } else {
        Swal.fire({
            title: "Revisaste tus datos?",
            text: "Credenciales incorrectas. Por favor, verifica tu usuario y contraseña.",
            icon: "error",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
        });
    }
})