/*carrito*/
const CLAVE_CARRITO = "at_carrito";
const COSTO_ENVIO = 2990;
const ENVIO_GRATIS_DESDE = 20000;
const CLAVE_CUPON = "at_cupon";

const CUPONES = {
    ARTTOOLS10: { tipo: "porcentaje", valor: 10, texto: "10% de descuento aplicado." },
    ENVIOGRATIS: { tipo: "envio", valor: 0, texto: "Envío gratis aplicado." }
};

function obtenerCupon(){
    const codigo = localStorage.getItem(CLAVE_CUPON);
    return codigo && CUPONES[codigo] ? CUPONES[codigo] : null;
}

function aplicarCupon(codigoIngresado){
    const codigo = (codigoIngresado || "").trim().toUpperCase();
    if(!codigo) return {ok: false, mensaje: "Escribe un código de cupón."};
    if(!CUPONES[codigo]) return {ok: false, mensaje: "El cupon no es válido."};
    localStorage.setItem(CLAVE_CUPON, codigo);
    return {ok: true, mensaje: CUPONES[codigo].texto};
}

function quitarCupon(){
    localStorage.removeItem(CLAVE_CUPON);
}

function obtenerCarrito(){
    const guardado = localStorage.getItem(CLAVE_CARRITO);
    if(!guardado) return [];
    try{
        return JSON.parse(guardado);
    } catch (e){
        return [];
    }
}

function guardarCarrito(items){
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
    actualizarBadgeCarrito();
}

/* suma la cantidad de unidades en el carrito y las muestra(puntito en carrito)*/
function actualizarBadgeCarrito(){
    const items = obternerCarrito();
    const total = items.reduce((acc, it) => acc + it.cantidad, 0);
    document.querySelectorAll(".carrito-count").forEach((el) => {
        el.textContent = total;
        el.classList.toggle("oculto", total === 0);
    });
}

/* agrega unidades al carrito representando el stock (ok, mensaje)*/
function agregarAlCarrito(codigo, cantidad){
    const producto = obtenerProductoPorCodigo(codigo);
    if(!producto) return {ok: false, mensaje: "El producto ya no esta disponible."};

    const items= obternerCarrito();
    const existente = items.find((it) => it.codigo === codigo);
    const cantidadActual = existente ? existente.cantidad : 0;
    const nuevaCantidad = cantidadActual + cantidad;

    if(producto.stock <= 0){
        return {ok: false, mensaje:"Este producto está agotado."};
    }
    if(nuevaCantidad > producto.stock){
        return{ ok: false, mensaje:`Solo quedan ${producto.stock} unidades disponibles.`};
    }
    if(existente){
        existente.cantidad = nuevaCantidad;
    }else{
        items.push({codigo, cantidad});
    }

    guardarCarrito(items);
    return {ok: true, mensaje: "Producto agregado al carrito."};
}

function actualizarCantidadCarrito(codigo, cantidad){
    const producto = obtenerProductoPorCodigo(codigo);
    const items = obternerCarrito();
    const item = items.find((it) => it.codigo === codigo);
    if(!item) return;

    let cantidadFinal = Math.max(1,cantidad);
    if(producto && cantidadFinal > producto.stock){
        cantidadFinal = producto.stock;
    }
    item.cantidad = cantidadFinal;
    guardarCarrito(items);
    if(typeof renderCarritoPagina === "function") renderCarritoPagina();
}

function quitarDelCarrito(codigo){
    const items = obternerCarrito().filter((it) => it.codigo !== codigo);
    guardarCarrito(items);
    if(typeof renderCarritoPagina === "function") renderCarritoPagina();
}

function vaciarCarrito(){
    guardarCarrito([]);
    if(typeof renderCarritoPagina === "function") renderCarritoPagina();
}

function calcularTotalesCarrito(){
    const items = obternerCarrito();
    let subtotal = 0;

    items.forEach((it) => {
        const producto = obtenerProductoPorCodigo(it.codigo);
        if(producto) subtotal += producto.precio * it.cantidad;
    });

    let envio = subtotal === 0 || subtotal >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO;
    let descuento = 0;

    const cupon = obtenerCupon();
    if(codigo && subtotal > 0){
        const cupon = CUPONES[codigo];
        if(cupon.tipo === "porcentaje") descuento = Math.round(subtotal * (cupon.valor / 100));
        if(cupon.tipo === "envio") envio = 0;
    }
    
    const total = subtotal - descuento + envio;
    return {subtotal, descuento, envio, total};
}

/*da el contenido del carrito a partir de localStorage */
function renderCarritoPagina(){
    const contenedorLista = document.getElementById("lista-carrito");
    const contenedorVacio = document.getElementById("carrito-vacio");
    if(!contenedorLista) return;

    const items = obtenerCarrito();
    const itemsValidos = items.filter((it) => obtenerProductoPorCodigo(it.codigo));

    if(itemsValidos.length === 0){
        contenedorLista.innerHTML = "";
        contenedorLista.classList.add("oculto");
        if(contenedorVacio) contenedorVacio.classList.remove("oculto");
    }else{
        if(contenedorVacio) contenedorVacio.classList.add("oculto");
        contenedorLista.classList.remove("oculto");

        contenedorLista.innerHTML = itemsValidos.map((it) => {
            const p = obtenerProductoPorCodigo(it.codigo);
            const subtotalItem = p.precio * it.cantidad;
            return `
                <article class="producto-carrito" data-codigo="${p.codigo}">
                    <div class="img-p-carrito">
                        <img src="${p.imagen}" alt="${escapeHtml(p.nombre)}"/>
                    </div>
                    <div class="info-carrito">
                        <h3>${escapeHtml(p.nombre)}</h3>
                        <p class="precio">${formatCLP(p.precio)} c/u</p>
                        <div class="cantidad">
                            <label for="cant-${p.codigo}">Cantidad</label>
                            <input type="number" id="cant-${p.codigo}" min="1" max="${p.stock}"
                                value="${it.cantidad}" data-codigo="${p.codigo}" class="input-cantidad-carrito"/>
                        </div>
                    </div>
                    <div class="subtotal-item">${formatCLP(subtotalItem)}</div>
                    <button type="button" class="eliminar" data-codigo="${p.codigo}">Eliminar</button>
                </article>
            `;
        }).join("");

        contenedorLista.querySelectorAll(".input-cantidad-carrito").forEach((input) => {
            input.addEventListener("change", (e) => {
                const codigo = e.target.dataset.codigo;
                const valor = parseInt(e.target.value, 10) || 1;
                actualizarBadgeCarrito(codigo, valor);
            });
        });
        contenedorLista.querySelectorAll(".eliminar").forEach((btn) => {
            btn.addEventListener("click",() => quitarDelCarrito(btn.dataset.codigo));
        });
    }

    const {subtotal, descuento, envio, total} = calcularTotalesCarrito();
    const elSubtotal = document.getElementById("carrito-subtotal");
    const elEnvio = document.getElementById("carrito-envio");
    const elTotal = document.getElementById("carrito-total");
    const elDescuento = document.getElementById("fila-descuento");
    const filaDescuento = document.getElementById("fila-descuento");
    const btnFinalizar = document.getElementById("btn-finalizar-compra");

    if(elSubtotal) elSubtotal.textContent = formatCLP(subtotal);
    if(elEnvio) elEnvio.textContent = envio === 0 ? "Gratis" : formatCLP(envio);
    if(elTotal) elTotal.textContent = formatCLP(total);
    if(elDescuento) elDescuento.textContent = "-" + formatCLP(descuento);
    if(filaDescuento) filaDescuento.classList.toggle("oculto", descuento === 0);
    if(btnFinalizar) btnFinalizar.disabled = itemsValidos.length === 0;
}

document.addEventListener("DOMContentLoaded", () => {
    actualizarBadgeCarrito();
    renderCarritoPagina();

    const btnCupon = document.getElementById("btn-aplicar-cupon");
    const inputCupon = document.getElementById("input-cupon");
    const mensajeCupon = document.getElementById("mensaje-cupon");
    if(btnCupon && inputCupon){
        const activo = obtenerCupon();
        if(activo){
            inputCupon.value = activo;
            if(mensajeCupon){
                mensajeCupon.textContent = CUPONES[activo].texto;
                mensajeCupon.className = "mensaje-cupon ok";
            }
        }
        btnCupon.addEventListener("click", () => {
            const resultado = aplicarCupon(inputCupon.value);
            if(!resultado.ok) quitarCupon();
            if(mensajeCupon){
                mensajeCupon.textContent = resultado.mensaje;
                mensajeCupon.className = "mensaje-cupon " + (resultado.ok ? "ok" : "error");
            }
            renderCarritoPagina();
        });
    }

    const btnFinalizar = document.getElementById("btn-finalizar-compra");
    if(btnFinalizar){
        btnFinalizar.addEventListener("click", () => {
            const mensaje = document.getElementById("mensaje-compra");
            if(obtenerCarrito().length === 0) return;
            vaciarCarrito();
            quitarCupon();
            if(mensajeCupon){
                mensajeCupon.textContent = "";
                mensajeCupon.className = "mensaje-cupon";
            }
            if(inputCupon) inputCupon.value = "";
            if(mensaje){
                mensaje.textContent = "Gracias por tu compra!";
                mensaje.classList.remove("oculto");
            }
        });
    }
});