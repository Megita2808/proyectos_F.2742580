var openModalBtn = document.getElementById("openModalBtn");

// Obtiene el modal y el botón para cerrar el modal
var modal = document.getElementById("myModal");
var closeModalBtn = document.getElementById("closeModalBtn");

// Abre el modal cuando se hace clic en el botón de abrir
openModalBtn.addEventListener("click", function () {
    modal.style.display = "block";
});

// Cierra el modal cuando se hace clic en el botón de cierre
closeModalBtn.addEventListener("click", function () {
    modal.style.display = "none";
});

// Cierra el modal si se hace clic fuera de él
window.addEventListener("click", function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});