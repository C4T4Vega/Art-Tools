/* dashboard de admin: muestra resumen */
document.addEventListener("DOMContentLoaded", () => {
    const sesion = protegerAdmin(["administrador", "vendedor"]);
    if(!sesion) return;

    const saludo = document.getElementById("saludo-admin");
    if(saludo) saludo.textContent = `¡Hola, ${sesion.nombre}!`;

    const productos = obtenerProductos();
    const stockCritico = productos.filter((p) => p.stockCritico != null && p.stock <= p.stockCritico);

    const elTotalProductos = document.getElementById("card-total-productos");
    const elStockCritico = document.getElementById("card-stock-critico");
    const elTotalUsuarios = document.getElementById("card-total-usuarios");
    const cardUsuarios = document.getElementById("card-usuarios-cont");

    if(elTotalProductos) elTotalProductos.textContent = productos.length;
    if(elStockCritico) elStockCritico.textContent = stockCritico.length;

    if(sesion.tipoUsuario === "administrador"){
        if(elTotalUsuarios) elTotalUsuarios.textContent = obtenerUsuarios().length;
    }else if (cardUsuarios){
        cardUsuarios.classList.add("oculto");
    }

    const listaAlertas = document.getElementById("lista-stock-critico");
    if(listaAlertas){
        if(stockCritico.length === 0){
            listaAlertas.innerHTML = "<li>No hay productos con stock crítico por el momento.</li>";
        }else{
            listaAlertas.innerHTML = stockCritico.map((p) => `
                <li>${escapeHtml(p.nombre)} — quedan <strong>${p.stock}</strong> unidades (código ${escapeHtml(p.codigo)})</li>
            `).join("");
        }
    }
});