/* detalle producto */
document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("detalle-producto-info");
    if(!contenedor) return;

    const codigo = getQueryParam("codigo");
    const producto = codigo ? obtenerProductoPorCodigo(codigo) : null;

    if(!producto){
        contenedor.closest("section").innerHTML = `
            <div class="producto-info">
                <h2>Producto no encontrado</h2>
                <p class="descripcion">El producto que buscas ya no está disponible.</p>
                <a class="btn-primario" href="productos.html">Ver todos los productos</a>
            </div>
        `;
        return; 
    }   

    document.title = `Art Tools - ${producto.nombre}`;

    document.getElementById("img-producto").src = producto.imagen;
    document.getElementById("img-producto").alt = producto.nombre;
    document.getElementById("categoria-producto").textContent = nombreCategoria(producto.categoria);
    document.getElementById("nombre-producto").textContent = producto.nombre;
    document.getElementById("precio-producto").textContent = formatCLP(producto.precio);
    /* En el panel lateral va un resumen; la descripción completa va más abajo */
    const descripcion = producto.descripcion || "";
    const resumen = descripcion.length > 140 ? descripcion.slice(0, 140).trim() + "..." : descripcion;
    document.getElementById("descripcion-producto-corta").textContent = resumen;
    document.getElementById("descripcion-producto-larga").textContent = descripcion;

    const inputCantidad = document.getElementById("cantidad");
    const stockInfo = document.getElementById("stock-info");
    const btnAgregar = document.getElementById("btn-agregar-detalle");
    const mensajeCarrito = document.getElementById("mensaje-carrito");

    if(producto.stock <= 0){
        stockInfo.textContent = "Sin stock disponible";
        stockInfo.classList.add("critico");
        inputCantidad.disabled = true;
        btnAgregar.disabled = true;
        btnAgregar.textContent = "Agotado";
    }else{
        inputCantidad.max = producto.stock;
        if(producto.stockCritico && producto.stock <= producto.stockCritico){
            stockInfo.textContent =`¡Quedan pocas unidades! Stock: ${producto.stock}`;
            stockInfo.classList.add("critico");
        }else{
            stockInfo.textContent = `Stock disponible: ${producto.stock}`;
        }
    }

    btnAgregar.addEventListener("click", () => {
        const cantidad = Math.max(1, parseInt(inputCantidad.value, 10) || 1);
        const resultado = agregarAlCarrito(producto.codigo, cantidad);
        mensajeCarrito.textContent = resultado.mensaje;
        mensajeCarrito.style.color = resultado.ok ? "#2d5a1e" : "#c0392b";
    });

    /* productos relacionados */
    const relacionadosCont = document.getElementById("grid-relacionados");
    if(relacionadosCont){
        const relacionados = obtenerProductos()
            .filter((p) => p.categoria === producto.categoria && p.codigo !== producto.codigo)
            .slice(0, 4);

        if(relacionados.length === 0){
            relacionadosCont.closest(".relacionados").classList.add("oculto");
        }else{
            relacionadosCont.innerHTML = relacionados.map((p) =>`
                <a href="producto.html?codigo=${encodeURIComponent(p.codigo)}" class="producto-card">
                    <img src="${p.imagen}" alt="${escapeHtml(p.nombre)}"/>
                    <h3>${escapeHtml(p.nombre)}</h3>
                    <p class="precio">${formatCLP(p.precio)}</p>
                </a>
            `).join("");
        }
    }
});
