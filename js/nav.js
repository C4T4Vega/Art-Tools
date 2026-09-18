/* nav: menú responsive (hamburguesa) y botón "Volver" */

/* Abre y cierra el menú en móvil y tablet */
function initMenuResponsive() {
    const boton = document.getElementById("btn-menu");
    const menu = document.getElementById("content-menu");
    if (!boton || !menu) return;

    boton.addEventListener("click", () => {
        const abierto = menu.classList.toggle("abierto");
        boton.setAttribute("aria-expanded", abierto ? "true" : "false");
        boton.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
    });

    /* Al elegir una opción el menú se cierra solo */
    menu.querySelectorAll("a").forEach((enlace) => {
        enlace.addEventListener("click", () => {
            menu.classList.remove("abierto");
            boton.setAttribute("aria-expanded", "false");
        });
    });

    /* Si la pantalla se agranda, se limpia el estado móvil */
    window.addEventListener("resize", () => {
        if (window.innerWidth > 1023) {
            menu.classList.remove("abierto");
            boton.setAttribute("aria-expanded", "false");
        }
    });
}

/* El botón "Volver" regresa a la página anterior del historial.
   Si el usuario llegó directo por URL (sin historial dentro del sitio),
   usa el enlace del href como destino de respaldo. */
function initBotonVolver() {
    document.querySelectorAll("[data-volver]").forEach((el) => {
        el.addEventListener("click", (e) => {
            const mismaPagina = document.referrer &&
                new URL(document.referrer, window.location.href).origin === window.location.origin;

            if (window.history.length > 1 && mismaPagina) {
                e.preventDefault();
                window.history.back();
            }
            /* Si no hay historial propio, el enlace funciona normalmente */
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initMenuResponsive();
    initBotonVolver();
});
