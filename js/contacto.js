/*contacto: verificacion y envio de formulario en contacto*/
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-contacto");
    if(!form) return;

    const nombre = document.getElementById("nombre");
    const correo = document.getElementById("correo");
    const comentario = document.getElementById("comentario");
    const alerta = document.getElementById("alerta-contacto");
    const contadorComentario = document.getElementById("contador-comentario");

    function validarNombre(){
        const v = nombre.value.trim();
        const mensajeEl = document.getElementById("error-nombre");
        if(!v) return marcarError(nombre, mensajeEl, "El nombre es obligatorio."), false;
        if(v.length > 100) return marcarError(nombre, mensajeEl, "El máximo es de 100 caracteres."), false;
        limpiarError(nombre, mensajeEl);
        return true;
    }

    function validarCorreo() {
        const v = correo.value.trim();
        const mensajeEl = document.getElementById("error-correo");
        if (!v) { limpiarError(correo, mensajeEl); return true; } // opcional
        if (v.length > 100) return marcarError(correo, mensajeEl, "Máximo 100 caracteres."), false;
        if (!validarDominioCorreo(v)) return marcarError(correo, mensajeEl, "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com."), false;
        limpiarError(correo, mensajeEl);
        return true;
    }

    function validarComentario(){
        const v = comentario.value.trim();
        const mensajeEl = document.getElementById("error-comentario");
        if(!v) return marcarError(comentario, mensajeEl, "El comentario es obligatorio."), false;
        if(v.length > 500) return marcarError(comentario, mensajeEl, "Máximo de 500 caracteres."), false;
        limpiarError(comentario, mensajeEl);
        return true;
    }

    if(contadorComentario){
        comentario.addEventListener("input", () => {
            contadorComentario.textContent = `${comentario.value.length} / 500`;
        });
    }

    nombre.addEventListener("blur", validarNombre);
    correo.addEventListener("blur", validarCorreo);
    comentario.addEventListener("blur", validarComentario);

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const ok = [validarNombre(), validarCorreo(), validarComentario()].every(Boolean);

        if(!ok){
            alerta.textContent = "Revisa los campos marcados en rojo.";
            alerta.className = "alerta alerta-error";
            alerta.classList.remove("oculto");
            return;
        }

        alerta.textContent = `¡Gracias ${nombre.value.trim()}! Recibimos tu mensaje y te responderemos a la brevedad.`;
        alerta.className = "alerta alerta-exito";
        alerta.classList.remove("oculto");
        form.reset();
        if(contadorComentario) contadorComentario.textContent = "0 / 500";
    });
});
