function redireccionar(url) {
    window.location = url
}



function guardarCategoria(){
    let nombre = document.getElementById('nombreCategoria').value;
    let descripcion = document.getElementById('descripcionCategoria').value;
    let correcto = true;

    if(nombre == "" || descripcion == "" ) {
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
    

    if(correcto) {
        categoriaslist = JSON.parse(localStorage.getItem('categorias')) ?? []


    var id
    categoriaslist.length != 0 ? id = categoriaslist[categoriaslist.length -1 ].id : id = 0

    if(document.getElementById('id').value){

        categoriaslist.forEach(categoria => {
            if(document.getElementById('id').value == categoria.id){

                categoria.nombre      = nombre, 
                categoria.descripcion      = descripcion
            }
        });

        document.getElementById('id').value = ''

    }else{

  
        var categoria = {
            id        : id + 1, 
            nombre      : document.getElementById('nombreCategoria').value, 
            descripcion      : document.getElementById('descripcionCategoria').value

            
        }


        categoriaslist.push(categoria)
        Swal.fire({
            position: "top",
            icon: "success",
            title: "Se ha registrado Correctamente",
            showConfirmButton: false,
            timer: 1500
          });
        window.location="../Categorias/verCategoria.html"

    }


    localStorage.setItem('categorias', JSON.stringify(categoriaslist))
    document.getElementById('form').reset();


    }
}

/*aca termina el agregar*/



//Aca termina el listar


function removeData(id){
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
            categoriaslist = JSON.parse(localStorage.getItem('categorias')) ?? []
            categoriaslist = categoriaslist.filter(function(categoria){ 
                return categoria.id != id; 
            });
            localStorage.setItem('categorias', JSON.stringify(categoriaslist))
          Swal.fire({
            title: "Eliminado!!",
            text: "Eliminado Correctamente.",
            icon: "success",
            color: "white",
            timer: 1500,
            timerProgressBar: true
          });
          listarCategorias()
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

function find(id){

    categoriaslist = JSON.parse(localStorage.getItem('categorias')) ?? []

    categoriaslist.forEach(function (categoria){
        if(categoria.id == id){
            document.getElementById('id').value = categoria.id
            document.getElementById('nombreCategoria').value=  categoria.name  
            document.getElementById('descripcionCategoria').value=   categoria.Descripcion

        }
    })
}

function editarP(id) {
    let categoriaslist = JSON.parse(localStorage.getItem('categorias')) || [];
    if (categoriaslist.length !== 0) {
        let categoria = categoriaslist.find(c => c.id == id);
        if (categoria) {
            categoria.nombre = document.getElementById('nombreCategoria').value;
            categoria.descripcion = document.getElementById('descripcionCategoria').value;
            localStorage.setItem('categorias', JSON.stringify(categoriaslist));
            setTimeout(() => {
                window.location.href = "../Categorias/verCategoria.html"
            }, 1);
        }
    }
}

