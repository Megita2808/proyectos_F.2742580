function listarCatalogo() {
    let listaCatalogo = JSON.parse(localStorage.getItem('productos')) ?? []
    let catalogo = document.getElementById('cartasCatalogo')
    let cartas = ""
    listaCatalogo.forEach(function(producto) {
      if(producto.estado === "Activo") {
        cartas += `<div class="card rounded-pill rounded-top" style="width: 18rem;">
        <div class='text-center'><img src="${producto.imagen}" class="card-img-top text-center" alt="${producto.nombre}" style ='width: 150px'></div>
        <div class="card-body mb-5">
          <h3 class="card-title">${producto.nombre}</h3>
          <p class="card-text">${producto.descripcion}</p>
          <p class="card-text">Precio: $${producto.precio}</p>
          <p class="card-text">Disponibilidad: ${producto.cantidadDisponible}/${producto.cantidadTotal}</p>
          <p class="card-text">Cantidad Disponible: </p>
          <label for="quantity">Cantidad:</label>
          <input type="number" id="cantidadAgregar" min="1" value="1" max="${producto.cantidadDisponible}" class="w-25">
          <div class="text-center">
            <button class="btn btn-primary mt-2 btn-sm" onclick="agregarAlCarrito(${producto.id})">Agregar al Carrito</button>
          </div>
        </div>
      </div>`
      }
        
    });
    catalogo.innerHTML = cartas
}

