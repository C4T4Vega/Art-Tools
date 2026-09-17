/* admin-producto: mantenedor de productos del panel administrador
   - admin/productos.html -> listado + búsqueda + eliminar
   - admin/producto-form.html -> alta y edición con validaciones*/
const IMG_PLACEHOLDER = "../img/productos/placeholder.jpg";

function initListadoProductos(sesion){
    const tbody = document.getElementById("tbody-productos");
    if(!tbody) return;

    const buscador = document.getElementById("buscador-productos");
    const esAdmin = sesion.tipoUsuario === "administrador";

    function pintar(filtro = ""){
        const productos = obtenerProductos().filter((p) =>
            p.nombre.toLowerCase().includes(filtro.toLowerCase)||
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
    const form = document.getElementById("form-producto");
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
        const opt = document.createElement("option");
        opt.value = c.slug;
        opt.textContent = c.nombre;
        campos.categoria.appendChild(opt);
    });

    const preview = document.getElementById("imagen-preview");
    function actualizarPreview(){
        preview.src = campos.imagen.value.trim()|| IMG_PLACEHOLDER;
    }
    campos.imagen.addEventListener("input", actualizarPreview);

    const codigoOriginal = getQueryParam("codigo");
    const modoEdicion = !!codigoOriginal;
    document.getElementById("titulo-form-producto").textContent = modoEdicion ? "Editar producto" : "Nuevo producto";

    if(modoEdicion){
        const producto = obtenerProductoPorCodigo(codigoOriginal);
        if(!producto){
            document.getElementById("admin-form-panel").innerHTML = "<p>Producto no encontrado.</p>";
            return;
        }
        campos.codigo.value = producto.codigo;
        campos.codigo.setAttribute("readonly", "true");
        campos.nombre.value = producto.nombre;
        campos.descripcion.value = producto.descripcion || "";
        campos.precio.value = producto.precio;
        campos.stock.value = producto.stock;
        campos.stockCritico.value = producto.stockCritico ?? "";
        campos.categoria.value = producto.categoria;
        campos.imagen.value = producto.imagen || "";
        actualizarPreview();
    }

    const validadores = {
        codigo: () => {
            const v = campos.codigo.value.trim();
            if(!v) return "El código es obligatorio.";
            if(v.length < 3)return "Mínimo 3 caracteres";
            if(!modoEdicion && obtenerProductoPorCodigo(v)) return "Ya existe un producto con ese código.";
            return "";
        },
        nombre: () => {
            const v = campos.nombre.value.trim();
            if (!v) return "El nombre es obligatorio.";
            if (v.length > 100) return "Máximo 100 caracteres.";
            return "";
        },
        descripcion: () => {
            const v = campos.descripcion.value.trim();
            if (v.length > 500) return "Máximo 500 caracteres.";
            return "";
        },
        precio: () => {
            const v = campos.precio.value;
            if (v === "") return "El precio es obligatorio.";
            const n = parseFloat(v);
            if (isNaN(n) || n < 0) return "El precio debe ser 0 o mayor.";
            return "";
        },
        stock: () => {
            const v = campos.stock.value;
            if (v === "") return "El stock es obligatorio.";
            if (!/^\d+$/.test(v)) return "El stock debe ser un número entero (0 o mayor).";
            return "";
        },
        stockCritico: () => {
            const v = campos.stockCritico.value;
            if (v === "") return "";
            if (!/^\d+$/.test(v)) return "El stock crítico debe ser un número entero (0 o mayor).";
            return "";
        },
        categoria: () => (campos.categoria.value ? "" : "Selecciona una categoría.")
    };

    function validarCampo(nombreCampo){
        const mensajeEl = document.getElementById("error-" + nombreCampo);
        const error = validadores[nombreCampo]();
        if(error) marcarError(campos[nombreCampo], mensajeEl, error);
        else limpiarError(campos[nombreCampo], mensajeEl);
        return !error;
    }

    Object.keys(validadores).forEach((nombreCampo) => {
        const el = campos[nombreCampo];
        el.addEventListener("blur", () => validarCampo(nombreCampo));
        el.addEventListener("input", () => {
            if (el.classList.contains("campo-error")) validarCampo(nombreCampo);
        });
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let valido = true;
        let primerInvalido = null;
        Object.keys(validadores).forEach((nombreCampo) => {
            const ok = validarCampo(nombreCampo);
            if (!ok && !primerInvalido) primerInvalido = campos[nombreCampo];
            valido = valido && ok;
        });

        const alerta = document.getElementById("alerta-producto");
        if(!valido){
            if(primerInvalido) primerInvalido.focus();
            alerta.textContent = "Revisa los campos marcados en rojo.";
            alerta.className =  "alerta alerta-error";
            alerta.classList.remove("oculto");
            return;
        }

        const productoFinal = {
            codigo: campos.codigo.value.trim(),
            nombre: campos.nombre.value.trim(),
            descripcion: campos.descripcion.value.trim(),
            precio: parseFloat(campos.precio.value),
            stock: parseInt(campos.stock.value, 10),
            stockCritico: campos.stockCritico.value === "" ? null : parseInt(campos.stockCritico.value, 10),
            categoria: campos.categoria.value,
            imagen: campos.imagen.value.trim() || IMG_PLACEHOLDER.replace("../","")
        };

        const ok = modoEdicion
            ? actualizarProducto(codigoOriginal, productoFinal)
            : crearProducto(productoFinal);
        
        if(!ok){
            alerta.textContent = "Ya hay un producto que tiene ese codigo";
            alerta.className = "alerta alerta-error";
            alerta.classList.remove("oculto");
            return;
        }

        window.location.href = "productos.html";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const sesion = protegerAdmin(["administrador", "vendedor"]);
    if(!sesion) return;

    if ( document.getElementById("tbody-producto")) initListadoProductos(sesion);

    if(document.getElementById("form-producto")){
        if(sesion.tipoUsuario !== "administrador"){
            document.getElementById("admin-form-panel").innerHTML =
            '<p>Tu rol de vendedor solo permite visualizar productos, no crear ni editar.</p>';
        }else{
            initFormularioProducto();
        }
    }
});