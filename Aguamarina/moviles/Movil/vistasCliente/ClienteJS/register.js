function registrar() {
    let cedula = document.getElementById("cedula").value;
    let nombre = document.getElementById("nombre").value;
    let correo = document.getElementById("correo").value;
    let contrasena = document.getElementById("contrasena").value;
    let confirmarContrasena = document.getElementById("ccontrasena").value;
    let direccion = document.getElementById("direccion").value;
    let telefono = document.getElementById("telefono").value;
    let recordarme = document.getElementById("recordarme").checked;

    if (contrasena !== confirmarContrasena) {
        Swal.fire({
            title: "Datos erroneos",
            text: "Las contraseñas no coinciden",
            icon: "error",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
        });
        return;
    }

    if (cedula === "" || nombre === "" || correo === "" || contrasena === "" || confirmarContrasena === "" || direccion === "" || telefono === "") {
        Swal.fire({
            title: "Datos incompletos",
            text: "Por favor, completa todos los campos.",
            icon: "error",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
        });
        return;
    }

    if (contrasena.length < 6) {
        Swal.fire({
            title: "Revisaste tus datos",
            text: "La contraseña debe tener al menos 6 caracteres.",
            icon: "warning",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
        });
        return;
    }

    let correoValido = /\S+@\S+\.\S+/;
    if (!correoValido.test(correo)) {
        Swal.fire({
            title: "Revisaste tus datos",
            text: "Por favor, ingresa un correo electrónico válido.",
            icon: "warning",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
        });
        return;
    }
    

    let usuario = {
        cedula: cedula,
        nombre: nombre,
        correo: correo,
        contrasena: contrasena,
        direccion: direccion,
        telefono: telefono,
        recordarme: recordarme
    };

    let usuariosRegistrados = JSON.parse(localStorage.getItem("usuarios")) || [];
    usuariosRegistrados.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(usuariosRegistrados));

  
    document.getElementById("registrationForm").reset();
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
            window.location.href = "/vistasCliente/Login/login.html";
        }
    });
} 




/*listar las personas*/
function listarUsuarios() {
    var tablaUsuarios = document.getElementById('tablaUsuarios');
    console.log("llega")
    tablaUsuarios.innerHTML = ''


    listaUsuarios = JSON.parse(localStorage.getItem('usuarios')) ?? []
    

    listaUsuarios.forEach(function (usuario) {
        let pass = ""
        for (let i = 1; i <= usuario.contrasena.length; i++) {
            pass += "*"
        }
        console.log(usuario);
        tablaUsuarios.innerHTML += `
            <tr style="font-family: 'Montserrat', sans-serif;">
                <td>${usuario.cedula}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.correo}</td>
                <td>${usuario.telefono}</td>
                <td>${usuario.direccion}</td>
                <td>${pass}</td>


                
                <td>
                    <a class="btn btn-sm btn-success"  onclick="abrirEditar(${usuario.id})">
                        <i class="fa fa-edit"></i>
                    </a>
                </td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="removerUsuarios(${usuario.id})">
                        <i class="fa fa-trash"></i>
                    </button>
                </td>
            </tr>`
    });
}

/* Aqui comienza el eliminar de personas */


function removerUsuarios(id){
    Swal.fire({
        title: "Estás Seguro?",
        text: "¿Desea eliminar este registro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirmar",
        color: "white",
        iconColor: "red"
      }).then((result) => {
        if (result.isConfirmed) {
            listaUsuarios = JSON.parse(localStorage.getItem('usuarios')) ?? []
            listaUsuarios = listaUsuarios.filter(function(usuario){ 
                return usuario.id != id; 
            });
            localStorage.setItem('usuarios', JSON.stringify(listaUsuarios))
          Swal.fire({
            title: "Eliminado!!",
            text: "Eliminado Correctamente.",
            icon: "success",
            color: "white",
            timer: 1500,
            timerProgressBar: true
          });
          listarUsuarios()
        } else {
            Swal.fire({
                position: "center",
                icon: "info",
                title: "Cancelado",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true
              });
        }
      });
 
}

function redireccionar(url) {
    window.location = url
}