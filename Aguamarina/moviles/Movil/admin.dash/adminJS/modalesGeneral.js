// Modal agregar
const btnAbrirModalAgregar = document.querySelector("#btn-abrir-modal-agregar");
const btnCerrarModalAgregar = document.querySelector('#btn-cerrar-modal-agregar');
const modalAgregar = document.querySelector("#modal-agregar");

btnAbrirModalAgregar.addEventListener("click", () => {
    modalAgregar.showModal();
});

btnCerrarModalAgregar.addEventListener("click", () => {
    modalAgregar.close();
});

// Modal editar
const btnAbrirModalesEditar = document.querySelectorAll(".btn-abrir-modal-editar");
const btnCerrarModalEditar = document.querySelector('#btn-cerrar-modal-editar');
const modalEditar = document.querySelector("#modal-editar");

btnAbrirModalesEditar.forEach(btn => {
    btn.addEventListener("click", () => {
        modalEditar.showModal();
    });
});

function cerrarModalEditar() {
    document.getElementById('modal-editar').close();
}

// Modal eliminar
const btnAbrirModalesEliminar = document.querySelectorAll(".btn-abrir-modal-eliminar");
const btnCerrarModalEliminar = document.querySelector('#btn-cerrar-modal-eliminar');
const modalEliminar = document.querySelector("#modal-eliminar");

btnAbrirModalesEliminar.forEach(btn => {
    btn.addEventListener("click", () => {
        modalEliminar.showModal();
    });
});

function cerrarModalEliminar() {
    document.getElementById("modal-eliminar").close()
}