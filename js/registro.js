/* valida el resgistro de un usauario */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-registro");
    if (!form) return;

    const campos = {
        run: document.getElementById("run"),
        nombre: document.getElementById("nombre"),
        apellidos: document.getElementById("apellidos"),
        correo: document.getElementById("correo"),
        clave: document.getElementById("clave"),
        confirmarClave: document.getElementById("confirmar-clave"),
        telefono: document.getElementById("telefono"),
        fechaNacimiento: document.getElementById("fecha-nacimiento"),
        region: document.getElementById("region"),
        comuna: document.getElementById("comuna"),
        direccion: document.getElementById("direccion")
    };

    enlazarRegionComuna(campos.region, campos.comuna);

    const validadores = {
        run: () => {
            const v = campos.run.value.trim();
            if (!v) return "El RUN es obligatorio.";
            if (!/^[0-9kK]{7,9}$/.test(v)) return "El RUN debe tener entre 7 y 9 caracteres, sin puntos ni guion.";
            if (!validarRun(v)) return "El RUN ingresado no es válido.";
            return "";
        },
        nombre: () => {
            const v = campos.nombre.value.trim();
            if (!v) return "El nombre es obligatorio.";
            if (v.length > 50) return "Máximo 50 caracteres.";
            return "";
        },
        apellidos: () => {
            const v = campos.apellidos.value.trim();
            if (!v) return "Los apellidos son obligatorios.";
            if (v.length > 100) return "Máximo 100 caracteres.";
            return "";
        },
        correo: () => {
            const v = campos.correo.value.trim();
            if (!v) return "El correo es obligatorio.";
            if (v.length > 100) return "Máximo 100 caracteres.";
            if (!validarDominioCorreo(v)) return "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.";
            return "";
        },
        clave: () => {
            const v = campos.clave.value;
            if (!v) return "La contraseña es obligatoria.";
            if (v.length < 4 || v.length > 10) return "Debe tener entre 4 y 10 caracteres.";
            return "";
        },
        confirmarClave: () => {
            if (!campos.confirmarClave.value) return "Confirma tu contraseña.";
            if (campos.confirmarClave.value !== campos.clave.value) return "Las contraseñas no coinciden.";
            return "";
        },
        telefono: () => {
            const v = campos.telefono.value.trim();
            if (!v) return "";
            if (!/^[0-9+\s]{8,15}$/.test(v)) return "Ingresa un teléfono válido.";
            return "";
        },
        region: () => (campos.region.value ? "" : "Selecciona una región."),
        comuna: () => (campos.comuna.value ? "" : "Selecciona una comuna."),
        direccion: () => {
            const v = campos.direccion.value.trim();
            if (!v) return "La dirección es obligatoria.";
            if (v.length > 300) return "Máximo 300 caracteres.";
            return "";
        }
    };

    function validarCampo(nombreCampo) {
        const mensajeEl = document.getElementById("error-" + nombreCampo);
        const error = validadores[nombreCampo]();
        if (error) {
            marcarError(campos[nombreCampo], mensajeEl, error);
        } else {
            limpiarError(campos[nombreCampo], mensajeEl);
        }
        return !error;
    }

    Object.keys(validadores).forEach((nombreCampo) => {
        const el = campos[nombreCampo];
        if (!el) return;
        el.addEventListener("blur", () => validarCampo(nombreCampo));
        el.addEventListener("input", () => {
            if (el.classList.contains("campo-error")) validarCampo(nombreCampo);
        });
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let formValido = true;
        let primerCampoInvalido = null;
        Object.keys(validadores).forEach((nombreCampo) => {
            const ok = validarCampo(nombreCampo);
            if (!ok && !primerCampoInvalido) primerCampoInvalido = campos[nombreCampo];
            formValido = formValido && ok;
        });

        const alerta = document.getElementById("alerta-registro");

        if (!formValido) {
            if (primerCampoInvalido) primerCampoInvalido.focus();
            alerta.textContent = "Revisa los campos marcados en rojo antes de continuar.";
            alerta.className = "alerta alerta-error";
            alerta.classList.remove("oculto");
            return;
        }

        const runLimpio = campos.run.value.trim().toUpperCase();
        const resultado = crearUsuario({
            run: runLimpio,
            nombre: campos.nombre.value.trim(),
            apellidos: campos.apellidos.value.trim(),
            correo: campos.correo.value.trim().toLowerCase(),
            clave: campos.clave.value,
            telefono: campos.telefono.value.trim(),
            fechaNacimiento: campos.fechaNacimiento.value,
            tipoUsuario: "cliente",
            region: campos.region.value,
            comuna: campos.comuna.value,
            direccion: campos.direccion.value.trim()
        });

        if (!resultado.ok) {
            alerta.textContent = resultado.error;
            alerta.className = "alerta alerta-error";
            alerta.classList.remove("oculto");
            return;
        }

        alerta.textContent = "¡Cuenta creada con éxito! Redirigiendo a inicio de sesión...";
        alerta.className = "alerta alerta-exito";
        alerta.classList.remove("oculto");
        form.reset();
        setTimeout(() => { window.location.href = "login.html"; }, 1500);
    });
});