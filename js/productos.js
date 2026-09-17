/* productos*/
function targetaProductoHTML(p) {
    const agotado = p.stock <= 0;
    return`
        <article class = "producto-card" data-codigo = "${p.codigo}">
            <a href="producto.html?codigo=${encodeURIComponent(p.codigo)}">
                <img src="${p.imagen}" alt="${escapeHtml(p.nombre)}"/>
                <p class="categoria-tag">${escapeHtml(nombreCategoria(p.categoria))}</p>
                <h3>${escapeHtml(p.nombre)}</h3>
            </a>
            <p class="precio">${formatCLP(p.precio)}</p>
            ${agotado ? '<p class="stock-agotado">Sin stock</p>' : ""}
            <button type="button" class="btn-agregar" data-codigo="${p.codigo}" ${agotado ? "disabled" : ""}>
                ${agotado ? "Agotado" : "Agregar al carrito"}
            </button>
        </article>
    `;
}

function activarBotonesAgregar(contenedor){
    contenedor.querySelectorAll(".btn-agregar").forEach((btn) => {
        btn.addEventListener("click", () => {
            const resultado = agregarAlCarrito(btn.dataset.codigo, 1);
            const original = btn.textContent;
            btn.textContent = resultado.ok ? "¡Agregado!" : "Sin stock suficiente";
            setTimeout(() => {btn.textContent = original;}, 1200);
        });
    });
}

function renderDestacados() {
    const contenedor = document.getElementById("grid-destacados");
    if(!contenedor) return;
    const destacados = obtenerProductos().filter((p) => p.destacado);
    contenedor.innerHTML = destacados.map(tarjetaProductoHTML).join("");
    activarBotonesAgregar(contenedor);
}

function renderListadoProductos(){
    const contenedor = document.getElementById("grid-productos");
    if(!contenedor) return;

    const chips = document.querySelectorAll(".chip-categoria");
    const categoriaUrl = getQueryParam("categoria");
    let categoriaActiva = categoriaUrl || "todas";

    function pintar(){
        const todos = obtenerProductos();
        const filtrados = categoriaActiva === "todas"
            ? todos
            : todos.filter((p) => p.categoria ===categoriaActiva);
        if(filtrados.length === 0){
            contenedor.innerHTML = '<p class ="sin-resultados">No hay productos en esta categoria por el momento.</p>';
            return;
        }

        contenedor.innerHTML = filtrados.map(targetaProductoHTML).join("");
        activarBotonesAgregar(contenedor);
    }

    chips.forEach((chip) => {
        if(chip.dataset.categoria === categoriaActiva) chip.classList.add("activo");
        else chip.classList.remove("activo");

        chip.addEventListener("click", () => {
            chips.forEach((c) => c.classList.remove("activo"));
            chip.classList.add("activo");
            categoriaActiva = chip.dataset.categoria;
            pintar();
        });
    });

    pintar();
}

document.addEventListener("DOMcontentLoaded", () => {
    renderDestacados();
    renderListadoProductos();
});