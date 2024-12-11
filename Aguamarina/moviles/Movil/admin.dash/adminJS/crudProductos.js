function listarProductos() {
    var tablaProductos = document.getElementById('tablaProductos');
    tablaProductos.innerHTML = ''
    console.log("nada")

    listaProductos = JSON.parse(localStorage.getItem('productos')) ?? []
    
    listaProductos.forEach(function (producto ) {
        tablaProductos.innerHTML += `
            <tr style="font-family: 'Montserrat', sans-serif;">
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.cantidadTotal}</td>
                <td>${producto.cantidadDisponible}</td>
                <td>${producto.precio}</td>
                <td>${producto.categoria}</td>
                <td>${producto.descripcion}</td>
                <td>${producto.estado}</td>
                <td class='text-center'><img src="${producto.imagen}" style='width: 30px;'></img> </td>
                <td>
                    <a class="btn btn-sm btn-success" onclick="find(${producto.id})">
                        <i class="fa fa-edit"></i>
                    </a>
                </td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="removeData(${producto.id})">
                        <i class="fa fa-trash"></i>
                    </button>
                </td>
            </tr>`
    });
}



function guardar(){
    let nombre = document.getElementById('nombreProducto').value;
    let categoria = document.getElementById('categoria').value;
    let cantidadTotal = document.getElementById('cantidadTotal').value;
    let cantidadDisponible = document.getElementById('cantidadDisponible').value;
    let precio = document.getElementById('precio').value;
    let estado = document.getElementById('estado').value;
    let imagen = document.getElementById('imagen').value;
    let descripcion = document.getElementById('descripcion').value;
    
    console.log(cantidadTotal)
    console.log(cantidadDisponible)
    let correcto = true;

    if(nombre == "" || cantidadTotal == "" || cantidadDisponible == "" || precio == "" || categoria == "" || descripcion == "") {
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
    else if(cantidadTotal < 0 || cantidadDisponible < 0) {
        Swal.fire({
            position: "center",
            icon: "error",
            title: "Las cantidades no pueden ser menores a 0",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
        });
        correcto = false;
    }
    else if(cantidadTotal < cantidadDisponible) {
        Swal.fire({
            position: "center",
            icon: "error",
            title: "La cantidad disponible no puede ser mayor a la total",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
        });
        correcto = false;
    }
    else if(precio <= 0) {
        Swal.fire({
            position: "center",
            icon: "error",
            title: "El precio del producto tiene que ser superior a $0",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          });
          correcto = false;
    }
    else if(descripcion.length > 500) {
        Swal.fire({
            position: "center",
            icon: "error",
            title: "La descripción excede el límite de caracteres: " + descripcion.length + '/500',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
          });
          correcto = false;
    }


    if(correcto) {
        productoslist = JSON.parse(localStorage.getItem('productos')) ?? []


    var id

    
    productoslist.length != 0 ? id = productoslist[productoslist.length -1 ].id : id = 0

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
                productoslist.forEach(producto => {
                    if(document.getElementById('id').value == producto.id){
                        producto.nombre      = nombre, 
                        producto.cantidadTotal       = cantidadTotal, 
                        producto.cantidadDisponible   = cantidadDisponible, 
                        producto.precio     = precio,
                        producto.categoria      = categoria,
                        producto.descripcion      = descripcion,
                        producto.estado      = estado,
                        producto.imagen      = imagen
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
                    window.location="./verProductos.html"
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
                    window.location="./verProductos.html"
                }, 1500) 
            }
          });

        

        document.getElementById('id').value = ''

    }else{

  
        var producto = {
            id        : id + 1, 
            nombre      : document.getElementById('nombreProducto').value, 
            cantidadTotal       : document.getElementById('cantidadTotal').value, 
            cantidadDisponible   : document.getElementById('cantidadDisponible').value, 
            precio     : document.getElementById('precio').value,
            categoria      : document.getElementById('categoria').value,
            descripcion      : document.getElementById('descripcion').value,
            estado      : document.getElementById('estado').value,
            imagen      : document.getElementById('imagen').value
            
        }


        productoslist.push(producto)
        Swal.fire({
            position: "top",
            icon: "success",
            title: "Se ha registrado Correctamente",
            showConfirmButton: false,
            timer: 1500
          });
        setTimeout(function(){
            window.location="./verProductos.html"
        }, 1500) 
        
        document.getElementById('form').reset();
    }


    localStorage.setItem('productos', JSON.stringify(productoslist))
    


    }

}
// Aqui termina para guardar un producto



// aqui inicia para meter las cosas en una tabla y poder mostrar
 

// aqui termina



// aqui inicia para editar editar
function find(id){
    window.location = "../Productos/agregarProductos.html"
    productoslist = JSON.parse(localStorage.getItem('productos')) ?? []

    productoslist.forEach(function (producto){
        if(producto.id == id){
            let aEditar = {
                id        : producto.id, 
                nombre      : producto.nombre, 
                cantidadTotal       : producto.cantidadTotal, 
                cantidadDisponible   : producto.cantidadDisponible, 
                precio     : producto.precio,
                categoria      : producto.categoria,
                descripcion      : producto.descripcion,
                estado      : producto.estado,
                imagen      : producto.imagen
            }

            console.log("llega")
            localStorage.setItem('aEditar', JSON.stringify(aEditar))
            window.location = "./editarProductos.html"


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
            productoslist = JSON.parse(localStorage.getItem('productos')) ?? []
            productoslist = productoslist.filter(function(producto){ 
                return producto.id != id; 
            });
            localStorage.setItem('productos', JSON.stringify(productoslist))
          Swal.fire({
            title: "Eliminado!!",
            text: "Eliminado Correctamente.",
            icon: "success",
            color: "white",
            timer: 1500,
            timerProgressBar: true
          });
          listarProductos()
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
    listaEditar = JSON.parse(localStorage.getItem('productos')) ?? []

    listaEditar.forEach(function(producto) {
        if (producto.id == id) {
            console.log(id)
            let contenedor = document.getElementById('containerForm')
            contenedor.innerHTML = ``
            contenedor.innerHTML += `
            <form  id="form">
                <h2 class="text-center">Registrar Producto</h2>
                <br>

                <input type="hidden" name="id" id="">

                <div class="row">
                    <div class="col">
                        <label for="" class="label">Nombre del producto:</label><br>
                        <input type="text" placeholder="Nombre del producto" class="form-control" id="nombreProducto" value="">
                    </div>

                    <div class="col">
                        <label for="categoria">Categoria:</label>
                        <select name="categoria" id="categoria" class="form-control">
                            <option value=""selected>Seleccione una Categoria</option>
                            <option value="1">Opc 1</option>
                            <option value="2">Opc 2</option>
                            <option value="3">Opc 3</option>
                        </select>
                    </div>
                </div>
                <br><br>
                <div class="row">
                    <div class="col">
                        <label for="">Cantidad Total:</label><br>
                        <input type="number" placeholder="Cantidad Total" class="form-control" id="cantidadTotal">
                    </div>
                    <div class="col">
                        <label for="">Cantidad Disponible:</label><br>
                        <input type="number" placeholder="Cantidad Disponible" class="form-control" id="cantidadDisponible">
                    </div>
                    <div class="col">
                        <label for="">Precio Unitario:</label><br>
                        <input type="number" placeholder="Precio Unitario" class="form-control" id="precio">
                    </div>
                </div>
                <br><br>
                <div class="row">
                    <div class="col">
                        <label for="estado">Estado:</label><br>
                        <select class="form-control" id="estado">
                            <option value="Activo" selected>Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                    </div>
                    <div class="col">
                        <label for="imagen">Imagen:</label><br>
                        <label for="imagen" class="btn btn-danger">Selecciona un archivo</label><br>
                        <input type="file"  id="imagen" style="display: none;">
                    </div>
                    <div class="col">
                        <label for="descripcion">Descripción:</label><br>
                        <textarea placeholder="Descripcion" id="descripcion" cols="30" rows="1" class="form-control"></textarea>
                    </div>
                </div>
                
                <br><br>

                <button class="btn btn-success" type="button" onclick="guardar()"><strong>Registrar</strong></button>

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