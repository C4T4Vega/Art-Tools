/* Funciones utilitarias*/
/* Formato de precios*/
function formatCLP(valor){
    const numero = Math.round(Number(valor) || 0);
    return "$" + numero.toLocaleString("es-CL");
}

/* lee parametros de query string url actual*/
function getQueryParam(nombre){
    const params = new URLSearchParams(window.location.search);
    return params.get(nombre);
}

/*Escapa texto antes de insertar como html para no romper layout con caract especiales*/
function escapeHtml(texto){
    const div = document.createElement("div");
    div.textContent = texto ?? "";
    return div.innerHTML;
}

/* valida correo y verifica dominio */
function validarDominioCorreo(correo){
    const regex = /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
    return regex.test((correo || "").trim());
}

 /* validacion generica de correo(sin dominio) */
 function validarFormatoCorreo(correo){
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test((correo || "").trim())
}

/* validacion de rut(algoritmo modulo 11) */
function validarRun(run){
    if(!run) return false;
    const limpio = run.trim().toUpperCase().replace(/[^0-9K]/g, "");

    if(limpio.length < 7 || limpio.length > 9) return false;

    const cuerpo = limpio.slice(0,-1);
    const dv = limpio.slice(-1);

    if(!/^\d+$/.test(cuerpo)) return false;

    let suma = 0;
    let multiplo = 2;
    for(let i = cuerpo.length - 1; i >= 0; i--){
        suma += parseInt(cuerpo[i],10) * multiplo;
        multiplo = multiplo < 7? multiplo + 1 : 2;
    }

    const resto = 11 - (suma % 11);
    let dvEsperado;
    if(resto === 11) dvEsperado = "0";
    else if (resto === 10) dvEsperado = "K";
    else dvEsperado = String(resto);

    return dvEsperado === dv;
}

/*Mensaje de error en campos y agrega la clase visual de error */
function marcarError(inputEl, mensajeEl, mensaje) {
    if(inputEl) inputEl.classList.add("campo-error");
    if(mensajeEl) mensajeEl.textContent = mensaje;
}

/* Limpia estado de error del campo */
function limpiarError(inputEl, mensajeEl){
    if(inputEl) inputEl.classList.remove("campo-error");
    if(mensajeEl) mensajeEl.textContent = "";
}