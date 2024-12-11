function agregarAlCarrito(id){
    let listaProductos = JSON.parse(localStorage.getItem('productos'))
    let productoNuevo = ""
    listaProductos.forEach(producto => {
        if(producto.id == id) {
            productoNuevo = producto 
        }
    });
    let cantidadNuevo = document.getElementById('cantidadAgregar').value
    let correcto = true


    let prodAgregar = {
        id : productoNuevo.id,
        nombre : productoNuevo.nombre,
        descripcion : productoNuevo.descripcion,
        precio : productoNuevo.precio,
        cantidad : cantidadNuevo,
        precioTotal : productoNuevo.precio * cantidadNuevo,
        imagen : productoNuevo.imagen
    }


    if(cantidadNuevo > productoNuevo.cantidadDisponible) {
        Swal.fire({
            position: "center",
            icon: "error",
            title: "No puedes agregar mas de lo que tenemos disponible para ti",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
        });
        correcto = false
        
    }
    
    if(correcto) {
        let listaCarrito = JSON.parse(localStorage.getItem('carrito')) ?? []
        listaCarrito.push(prodAgregar)
        localStorage.setItem('carrito', JSON.stringify(listaCarrito))
        Swal.fire({
            position: "top",
            icon: "success",
            title: "Se ha agregado Correctamente",
            showConfirmButton: false,
            timer: 1500
          });
    }
    
    
}

function listarCarrito() {
    let tablaCarrito = document.getElementById('tablaCarrito')
    tablaCarrito.innerHTML = ``
    let productosCarrito = JSON.parse(localStorage.getItem('carrito')) ?? []
    let lista = ""
    productosCarrito.forEach(function(producto){
        lista += `
            <tr>
                    <td>${producto.nombre}</td>
                    <td >${producto.descripcion}</td>
                    <td >${producto.precio}</td>
                    <td><input type="number" value="${producto.cantidad}" class="w-25"></td>
                    <td >${producto.precioTotal}</td>
                    <td><img src= "${producto.imagen}" width="40"></img></td>
                    
                    <td>
                      <button class="btn btn-sm btn-success">
                        <i class="fa fa-edit"></i>
                      </button>
                    </td>
                    <td class="col-md-2">
                      <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${producto.id})">
                        <i class="fa fa-trash"></i>
                      </button>
                    </td>
                </tr>
        `
    })

    tablaCarrito.innerHTML = lista
    let total = document.getElementById('total')
    let suma = 0
    total.innerHTML = ""
    productosCarrito.forEach(function(producto){
        suma += producto.precioTotal
    })
    total.innerHTML = suma
}

function vaciarCarrito() {
    Swal.fire({
        title: "¿Estás Seguro?",
        text: "¿Desea vaciar el carrito?",
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
            localStorage.removeItem('carrito')
          Swal.fire({
            title: "Eliminado!!",
            text: "Eliminado Correctamente.",
            icon: "success",
            color: "white",
            timer: 1500,
            timerProgressBar: true
          });
          listarCarrito()
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

function eliminarProducto(id) {
    let listaCarrito = JSON.parse(localStorage.getItem('carrito'))
    let carrito = []
    


    Swal.fire({
        title: "¿Estás Seguro?",
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
            listaCarrito.forEach(function(producto) {
                if(producto.id != id) {
                    carrito.push(producto)
                }
            })
            localStorage.setItem('carrito', JSON.stringify(carrito))
          Swal.fire({
            title: "Eliminado!!",
            text: "Eliminado Correctamente.",
            icon: "success",
            color: "white",
            timer: 1500,
            timerProgressBar: true
          });
          listarCarrito()
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