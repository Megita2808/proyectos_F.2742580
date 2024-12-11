function listarReservas() {
    var tablaReservas = document.getElementById('tablaReservas');
    tablaReservas.innerHTML = ''
    console.log("nada")

    listaReservas = JSON.parse(localStorage.getItem('reservas')) ?? []
    
    listaReservas.forEach(function (reserva) {
        tablaReservas.innerHTML += `
            <tr style="font-family: 'Montserrat', sans-serif;">
                <td>${reserva.id}</td>
                <td>${reserva.productos}</td>
                <td>${reserva.cantidad}</td>
                <td>${reserva.direccion}</td>
                <td>${reserva.precio}</td>
                <td>${reserva.nombrecliente}</td>
                <td>${reserva.fechaentrega}</td>
                <td>${reserva.fecharecogida}</td>
                <td>${reserva.estado}</td>
                <td>
                    <a class="btn btn-sm btn-success" onclick="find(${reserva.id})">
                        <i class="fa fa-edit"></i>
                    </a>
                </td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="removeData(${reserva.id})">
                        <i class="fa fa-trash"></i>
                    </button>
                </td>
            </tr>`
    });
}



function guardar(){
    let productos = document.getElementById('nombreProductos').value;
    let cantidad = document.getElementById('cantidad').value;
    let direccion = document.getElementById('direccion').value;
    let precio = document.getElementById('precio').value;
    let nombrecliente = document.getElementById('nombrecliente').value;
    let fechaentrega= document.getElementById('fechaentrega').value;
    let fecharecogida = document.getElementById('fecharecogida').value;
    let estado = document.getElementById('estado').value;
    let correcto = true;

    if(productos == "" || cantidad == "" || direccion == "" || precio == "" || nombrecliente == "" || fechaentrega == "" || fecharecogida == "" || estado == "" ) {
        Swal.fire({
            position: "center",
            icon: "error",
            title: "Rellena todos los campos necesarios",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
        });
        correcto = false;
    }
    else if(cantidad < 0) {
        Swal.fire({
            position: "center", 
            icon: "error",
            title: "La cantidad no pueden ser menor a 0",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
        });
        correcto = false;
    }
    else if(precio <= 499) {
        Swal.fire({
            position: "center",
            icon: "error",
            title: "El precio del producto tiene que ser superior a $500",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          });
          correcto = false;
    }


    if(correcto) {
        reservaslist = JSON.parse(localStorage.getItem('reservas')) ?? []


    var id

    
    reservaslist.length != 0 ? id = reservaslist[reservaslist.length -1 ].id : id = 0

    if(document.getElementById('id').value){

        Swal.fire({
            title: "Quieres guardar los cambios?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Guardar",
            denyButtonText: `No guardar`,
            cancelButtonText: "Cancelar"
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                reservaslist.forEach(reserva => {
                    if(document.getElementById('id').value == reserva.id){
                        reserva.productos      = productos, 
                        reserva.cantidad       = cantidad, 
                        reserva.direccion   = direccion, 
                        reserva.precio     = precio,
                        reserva.nombrecliente      = nombrecliente,
                        reserva.fechaentrega      = fechaentrega,
                        reserva.fecharecogida      = fecharecogida,
                        reserva.estado      = estado
                    }
                });
                Swal.fire({
                    position: "top",
                    icon: "success",
                    title: "Se han guardado los cambios correctamente",
                    showConfirmButton: false,
                    timer: 1500
                  });
                  localStorage.removeItem("aEditar")
                setTimeout(function(){
                    window.location="./admin_reservas.html"
                }, 1500) 
            } else if (result.isDenied) {
                Swal.fire({
                    position: "top",
                    icon: "error",
                    title: "Se han descartado los cambios",
                    showConfirmButton: false,
                    timer: 1500
                  });
                  localStorage.removeItem("aEditar")
                  setTimeout(function(){
                    window.location="./admin_reservas.html"
                }, 1500) 
            }
          });

        

        document.getElementById('id').value = ''

    }else{

  
        var reserva = {
            id        : id + 1, 
            productos : document.getElementById('nombreProductos').value,
            cantidad : document.getElementById('cantidad').value,
            direccion : document.getElementById('direccion').value,
            precio : document.getElementById('precio').value,
            nombrecliente : document.getElementById('nombrecliente').value,
            fechaentrega : document.getElementById('fechaentrega').value,
            fecharecogida : document.getElementById('fecharecogida').value,
            estado : document.getElementById('estado').value
            
        }


        reservaslist.push(reserva)
        Swal.fire({
            position: "top",
            icon: "success",
            title: "Se ha registrado Correctamente",
            showConfirmButton: false,
            timer: 1500
          });
        setTimeout(function(){
            window.location="./admin_reservas.html"
        }, 1500) 
        
        document.getElementById('form').reset();
    }


    localStorage.setItem('reservas', JSON.stringify(reservaslist))
    


    }

}
// Aqui termina para guardar un producto



// aqui inicia para meter las cosas en una tabla y poder mostrar
 

// aqui termina



// aqui inicia para editar editar
function find(id){
    window.location = "/admin.dash/Reservas/agregarReserva.html"
    reservaslist = JSON.parse(localStorage.getItem('reservas')) ?? []

    reservaslist.forEach(function (reserva){
        if(reserva.id == id){
            let aEditar = {
                id        : reserva.id, 
                productos : reserva.productos,
                cantidad : reserva.cantidad,
                direccion : reserva.direccion,
                precio : reserva.precio,
                nombrecliente : reserva.nombrecliente,
                fechaentrega : reserva.fechaentrega,
                fecharecogida : reserva.fecharecogida,
                estado : reserva.estado
            }

            console.log("llega")
            localStorage.setItem('aEditar', JSON.stringify(aEditar))
            window.location = "/admin.dash/Reservas/editarReserva.html"


        }

    })
}

function removeData(id){
    Swal.fire({
        title: "Estás Seguro?",
        text: "¿Desea eliminar este registro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        color: "white",
        iconColor: "red"
      }).then((result) => {
        if (result.isConfirmed) {
            reservaslist = JSON.parse(localStorage.getItem('reservas')) ?? []
            reservaslist = reservaslist.filter(function(reserva){ 
                return reserva.id != id; 
            });
            localStorage.setItem('reservas', JSON.stringify(reservaslist))
          Swal.fire({
            title: "Eliminado!!",
            text: "Eliminado Correctamente.",
            icon: "success",
            color: "white",
            timer: 1500,
            timerProgressBar: true
          });
          listarReservas()
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



function abrirEditar(id) {
    listaEditar = JSON.parse(localStorage.getItem('reservas')) ?? []

    listaEditar.forEach(function(reserva) {
        if (producto.id == id) {
            console.log(id)
            let contenedor = document.getElementById('containerForm')
            contenedor.innerHTML = ``
            contenedor.innerHTML += `
            <form  id="form">
                    <h2 class="text-start">Registrar Reserva</h2>
                    <br>
        
                    <input type="hidden" name="id" id="id">
        
                    <div class="row">
                        <div class="col">
                            <label for="" class="label">Nombre de los Productos:</label><br>
                            <input type="text" placeholder="Nombre de los productos" class="form-control" id="nombreProductos">
                        </div>
        
                        <div class="col">
                            <label for="">Cantidad:</label>
                            <input type="number" id="cantidad" class="form-control" placeholder="Cantidad" value="1" min="1">
                            </select>
                        </div>
                    </div>
                    <br><br>
                    <div class="row">
                        <div class="col">
                            <label for="">Direccion:</label><br>
                            <input type="text" placeholder="Direccion" class="form-control" id="direccion">
                        </div>
                        <div class="col">
                            <label for="">Precio</label><br>
                            <input type="number" placeholder="Precio" class="form-control" id="precio" value="500" min="500">
                        </div>
                        <div class="col">
                            <label for="">Nombre del cliente</label><br>
                            <input type="text" placeholder="Nombre del cliente" class="form-control" id="nombrecliente">
                        </div>
                    </div>
                    <br><br>
                    <div class="row">
                        <div class="col">
                            <label for="">Fecha de Entrega:</label><br>
                            <input type="date" placeholder="Fecha de entrega" class="form-control" id="fechaentrega">
                        </div>
                        <div class="col">
                            <label for="">Fecha de Recogida:</label><br>
                            <input type="date" placeholder="Fecha de recogida" class="form-control" id="fecharecogida">
                        </div>
                        <div class="col">
                            <label for="estado">Estado:</label><br>
                            <select class="form-control" id="estado">
                                <option value="Activo" selected>Activo</option>
                                <option value="Inactivo">Proceso</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                        </div>
                    </div>
                    
                    <br><br>
        
                    <button class="btn btn-success" type="button" onclick="guardar()"><strong>Actualizar</strong></button>

            </form>
            `
    
        }
    })


}

/*
const imagen = document.getElementById('imagen')
imagen.addEventListener('change', () => {
    

    let img = new FileReader();

    img.readAsDataURL(imagen.files[0])

    img.addEventListener('load', () => {
        let imgValue = document.getElementById('imgValue').value
        /*let partes = imgValue.split('\\');
        let nombreImg = partes[partes.length -1];
        imgValue.innerHTML = nombreImg 
        console.log(nombreImg)
        let url = img.result;
        
        let image = new Image()
        document.body.appendChild(image)
        console.log(url)
    })
})
*/

function redireccionar(url) {
    window.location = url
}