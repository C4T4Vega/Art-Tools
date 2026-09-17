/*admin usuarios: mantiene a usuarios en panel admin(exclusivo admin) */
function initListadoUsuarios(sesion){
    const tbody = document.getElementById("tbody-usuarios");
    if(!tbody)return;

    const buscador = document.getElementById("buscador-usuarios");

    function pintar(filtro = "") {
        const usuarios = obtenerUsuarios().filter((u) =>
            u.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
            u.apellidos.toLowerCase().includes(filtro.toLowerCase()) ||
            u.correo.toLowerCase().includes(filtro.toLowerCase()) ||
            u.run.includes(filtro)
        );

        if(usuarios.length === 0){
            tbody.innerHTML = `<tr><td colspan="6" class="tabla-vacia">No se encontraron usuarios.</td></tr>`;
            return;
        }

        tbody.innerHTML = usuarios.map((u) =>
        `
            <tr>
                <td>${escapeHtml(u.run)}</td>
                <td>${escapeHtml(u.nombre)} ${escapeHtml(u.apellidos)}</td>
                <td>${escapeHtml(u.correo)}</td>
                <td><span class="badge-rol ${u.tipoUsuario}">${escapeHtml(u.tipoUsuario)}</span></td>
                <td>${escapeHtml(u.region || "-")}</td>
                <td>
                    <div class="fila-acciones">
                        <a class="accion-editar" href="usuario-form.html?correo=${encodeURIComponent(u.correo)}">Editar</a>
                        <button class="accion-eliminar" data-correo="${u.correo}" ${u.correo === sesion.correo ? "disabled title='No puedes eliminar tu propia cuenta'" : ""}>Eliminar</button>
                    </div>
                </td>
            </tr>
        `).join("");

        tbody.querySelectorAll(".accion-eliminar").forEach((btn) => {
            btn.addEventListener("click", () => {
                if(btn.disabled)return;
                if(confirm("¿Eliminar usuario? Esta acción no se puede deshacer.")){
                    eliminarUsuario(btn.dataset.correo);
                    pintar(buscador ? buscador.value : "");
                }
            });
        });
    }
    
    if(buscador) buscador.addEventListener("input", () => pintar(buscador.value));
    pintar();
}

function initFormularioUsuario(){
    const form = document.getElementById("form-usuario");
    if(!form) return;

    const campos = {
        run: document.getElementById("run"),
        nombre: document.getElementById("nombre"),
        apellidos: document.getElementById("apellidos"),
        correo: document.getElementById("correo"),
        fechaNacimiento: document.getElementById("fecha-nacimiento"),
        tipoUsuario: document.getElementById("tipo-usuario"),
        region: document.getElementById("region"),
        comuna: document.getElementById("comuna"),
        direccion: document.getElementById("direccion"),
        clave: document.getElementById("clave"),
        confirmarClave: document.getElementById("confirmar-clave"),
    }

    enlazarRegionComuna(campos.region, campos.comuna);

    const correoOriginal  = getQueryParam("correo");
    const modoEdicion = !!correoOriginal;
    document.getElementById("titulo-form-usuario").textContent = modoEdicion ? "Editar Usuario" : "Nuevo usuario";

    let usuarioExistente = null;
    if(modoEdicion){
        usuarioExistente = obtenerUsuarioPorCorreo(correoOriginal);
        if(!usuarioExistente){
            document.getElementById("admin-form-panel").innerHTML = "<p>Usuario no encontrado.</p>";
            return;
        }
        campos.run.value = usuarioExistente.run;
        campos.run.setAttribute("readonly", "true");
        campos.nombre.value = usuarioExistente.nombre;
        campos.apellidos.value = usuarioExistente.apellidos;
        campos.correo.value = usuarioExistente.correo;
        campos.fechaNacimiento.value = usuarioExistente.fechaNacimiento || "";
        campos.tipoUsuario.value = usuarioExistente.tipoUsuario;
        campos.region.value = usuarioExistente.region || "";
        poblarSelectComunas(campos.comuna, usuarioExistente.region || "");
        campos.comuna.value = usuarioExistente.comuna || "";
        campos.direccion.value = usuarioExistente.direccion || "";
        document.getElementById("nota-clave").classList.remove("oculto");
    }

    const validadores = {
        run: () => {
            const v = campos.run.value.trim();
            if(!v) return "El RUN es obligatorio.";
            if(!/^[0-9kK]{7,9}$/.test(v)) return "Debe tener entre 7 a 9 caracteres(sin puntos ni guiones).";
            if(!validarRun(v)) return "El Run ingresado no es valido.";
            if(!modoEdicion && obtenerUsuarioPorRun(v.toUpperCase())) return "Ya existe un usuario con ese RUN.";
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
            if ((!modoEdicion || v.toLowerCase() !== correoOriginal.toLowerCase()) && obtenerUsuarioPorCorreo(v)) {
                return "Ya existe un usuario con ese correo.";
            }
            return "";
        },
        tipoUsuario: () => (campos.tipoUsuario.value ? "" : "Selecciona un tipo de usuario."),
        region: () => (campos.region.value ? "" : "Selecciona una región."),
        comuna: () => (campos.comuna.value ? "" : "Selecciona una comuna."),
        direccion: () => {
            const v = campos.direccion.value.trim();
            if (!v) return "La dirección es obligatoria.";
            if (v.length > 300) return "Máximo 300 caracteres.";
            return "";
        },
        clave: () => {
            const v = campos.clave.value;
            if (!v) return modoEdicion ? "" : "La contraseña es obligatoria.";
            if (v.length < 4 || v.length > 10) return "Debe tener entre 4 y 10 caracteres.";
            return "";
        },
        confirmarClave: () => {
            if (!campos.clave.value && modoEdicion) return "";
            if (campos.confirmarClave.value !== campos.clave.value) return "Las contraseñas no coinciden.";
            return "";
        }
    };

    function validarCampo(nombreCampo){
        const mensajeEl = document.getElementById("error-" + nombreCampo);
        const error = validadores[nombreCampo]();
        if(error) marcarError(campos[nombreCampo], mensajeEl,error);
        else limpiarError(campos[nombreCampo], mensajeEl);
        return !error;
    }

    Object.keys(validadores).forEach((nombreCampo) => {
        const el = campos[nombreCampo];
        el.addEventListener("blur", () => validarCampo(nombreCampo));
        el.addEventListener("input", () => {
            if(el.classList.contains("campo-error")) validarCampo(nombreCampo);
        });
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let valido = true;
        let primerInvalido = null;
        Object.keys(validadores).forEach((nombreCampo) => {
            const ok = validarCampo(nombreCampo);
            if(!ok && !primerInvalido) primerInvalido = campos[nombreCampo];
            valido = valido && ok;
        });

        const alerta = document.getElementById("alerta-usuario");
        if(!valido) {
            if(primerInvalido) primerInvalido.focus();
            alerta.textContent = "Revisa los campos marcados en rojo.";
            alerta.className = "alerta alerta-error";
            alerta.classList.remove("oculto");
            return;
        }

        const usuarioFinal = {
            run: campos.run.value.trim().toUpperCase(),
            nombre: campos.nombre.value.trim(),
            apellidos: campos.apellidos.value.trim(),
            correo: campos.correo.value.trim().toLowerCase(),
            clave: campos.clave.value ? campos.clave.value : usuarioExistente.clave,
            fechaNacimiento: campos.fechaNacimiento.value,
            tipoUsuario: campos.tipoUsuario.value,
            region: campos.region.value,
            comuna: campos.comuna.value,
            direccion: campos.direccion.value.trim()
        };

        if(modoEdicion){
            actualizarUsuario(correoOriginal, usuarioFinal);
        }else{
            const resultado = crearUsuario(usuarioFinal);
            if(!resultado.ok){
                alerta.textContent = resultado.error;
                alerta.className = "alerta alerta-error";
                alerta.classList.remove("oculto");
                return;
            }
        }

        window.location.href = "usuarios.html";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const sesion = protegerAdmin(["administrador"]);
    if(!sesion) return;

    if(document.getElementById("tbody-usuarios")) initListadoUsuarios(sesion);
    if(document.getElementById("form-usuario")) initFormularioUsuario();
});