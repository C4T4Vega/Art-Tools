/* login: verificacion y envio del formulario */
document.addEventListener("DOMContentLoaded", () =>{
    const form = document.getElementById("form-login");
    if(!form) return;

    const correo = document.getElementById("correo");
    const clave = document.getElementById("clave");
    const alerta = document.getElementById("alerta-login");

    function validarCorreo(){
        const v = correo.value.trim();
        const mensajeEl = document.getElementById("error-correo");
        if(!v) return marcarError(correo, mensajeEl, "El correo es obligatorio."), false;
        if (v.length > 100) return marcarError(correo, mensajeEl, "Máximo 100 caracteres"), false;
        if (!validarDominioCorreo(v)) return marcarError(correo, mensajeEl, "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com."), false;
        limpiarError(correo, mensajeEl);
        return true;
    }

    function validarClave(){
        const v = clave.value;
        const mensajeEl = document.getElementById("error-clave");
        if(!v) return marcarError(clave, mensajeEl, "La contraseña es obligatoria."), false;
        if(v.length < 4 || v.length > 10) return marcarError(clave, mensajeEl, "Debe tener entre 4 y 10 caracteres"), false;
        limpiarError(clave, mensajeEl);
        return true;
    }

    correo.addEventListener("blur", validarCorreo);
    clave.addEventListener("blur", validarClave);

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const correoValido = validarCorreo();
        const claveValida = validarClave();

        if(!correoValido || !claveValida){
            alerta.textContent = "Revisa los campos marcados en rojo.";
            alerta.className = "alerta alerta-error";
            alerta.classList.remove("oculto");
            return;
        }

        const usuario = obtenerUsuarioPorCorreo(correo.value.trim());

        if(!usuario || usuario.clave !== clave.value){
            alerta.textContent = "Correo o contraseña incorrectos.";
            alerta.className = "alerta alerta-error";
            alerta.classList.remove("oculto");
            return;
        }

        iniciarSesion(usuario);

        alerta.textContent = `¡Bienvenido/a, ${usuario.nombre}! Redirigiendo...`;
        alerta.className = "alerta alerta-exito";
        alerta.classList.remove("oculto");

        const esStaff = usuario.tipoUsuario === "administrador" || usuario.tipoUsuario === "vendedor";
        setTimeout(() => {
            window.location.href = esStaff ? "admin/index.html" : "index.html";
        }, 900);
    });
});
