/* admin-producto: mantenedor de productos del panel administrador
   - admin/productos.html -> listado + búsqueda + eliminar
   - admin/producto-form.html -> alta y edición con validaciones*/
const IMG_PLACEHOLDER = "../img/productos/placeholder.svg";

function initListadoProductos(sesion){
    const tbody = document.getElementById("tbody-productos");
    if(!tbody) return;

    const buscador = document.getElementById("tbody-productos");
    const esAdmin = sesion.tipoUsuario === "administrador";

    function pintar(filtro = ""){
        const productos = obtenerProductos().filter((p) =>
            p.nombre.toLowerCase().includes(filtro.toLocaleLowerCase())||
            p.codigo.toLowerCase().includes(filtro.toLowerCase)
        );

        if(productos.length === 0){
            tbody.innerHTML = `<tr><td colspan="7" class="tabla-vacia">No se encontraron productos.</td></tr>`;
            return;
        }

        tbody.innerHTML = productos.map((p) => {
            const stockBajo = p.stockCritico != null && p.stock <= p.stockCritico;
            return `
                <tr>
                    <td><img class="miniatura" src="${p.imagen || IMG_PLACEHOLDER}" alt="${escapeHtml(p.nombre)}"
                        onerror="this.src='${IMG_PLACEHOLDER}'"/></td>
                    <td>${escapeHtml(p.codigo)}</td>
                    <td>${escapeHtml(p.nombre)}</td>
                    <td>${escapeHtml(nombreCategoria(p.categoria))}</td>
                    <td>${formatCLP(p.precio)}</td>
                    <td class="${stockBajo ? "stock-bajo" : ""}">${p.stock}${stockBajo ? " ⚠" : ""}</td>
                    <td>
                        ${esAdmin ? `
                            <div class="fila-acciones">
                                <a class="accion-editar" href="producto-form.html?codigo=${encodeURIComponent(p.codigo)}">Editar</a>
                                <button class="accion-eliminar" data-codigo="${p.codigo}">Eliminar</button>
                            </div>
                        ` : `<span style="color:#999;">Solo lectura</span>`}
                    </td>
                </tr>
            `;
        }).join("");

        if(esAdmin){
            tbody.querySelectorAll(".accion-eliminar").forEach((btn) => {
                btn.addEventListener("click", () => {
                    if(confirm("¿Eliminar este producto? esta accion no se puede deshacer.")){
                        eliminarProducto(btn.dataset.codigo);
                        pintar(buscador ? buscador.value : "");
                    }
                });
            });
        }
    }

    if(buscador){
        buscador.addEventListener("input", () => pintar(buscador.value));
    }

    const btnNuevo = document.getElementById("btn-nuevo-producto");
    if(btnNuevo && !esAdmin) btnNuevo.classList.add("oculto");
    pintar();
}

function initFormularioProducto(){
    const form = document.getElementById("form-pruducto");
    if(!form) return;

    const campos = {
        codigo: document.getElementById("codigo"),
        nombre: document.getElementById("nombre"),
        descripcion: document.getElementById("descripcion"),
        precio: document.getElementById("precio"),
        stock: document.getElementById("stock"),
        stockCritico: document.getElementById("stock-critico"),
        categoria: document.getElementById("categoria"),
        imagen: document.getElementById("imagen")
    };

    CATEGORIAS.forEach((c) => {

    });
}