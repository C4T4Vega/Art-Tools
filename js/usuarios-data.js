/* Mantiene usuarios(cliente-vendedor-admin), guarda en localStorage*/
const CLAVE_USUARIOS = "at_usuarios";

const USUARIOS_SEMILLA = [
    {
        run: "111111111",
        nombre: "Admin",
        apellidos: "Art Tools",
        correo: "admin@duoc.cl",
        clave: "admin123",
        fechaNacimiento: "1990-01-01",
        tipoUsuario: "administrador",
        region: "Región Metropolitana de Santiago",
        comuna: "Santiago",
        direccion: "Av. Siempre Viva 123"
    },
    {
        run: "222222222",
        nombre: "Vendedor",
        apellidos: "Demo",
        correo: "vendedor@duoc.cl",
        clave: "vendedor123",
        fechaNacimiento: "1995-05-05",
        tipoUsuario: "vendedor",
        region: "Región Metropolitana de Santiago",
        comuna: "Maipú",
        direccion: "Calle Falsa 456"
    }
];

function obtenerUsuarios() {
    const guardado = localStorage.getItem(CLAVE_USUARIOS);
    if (!guardado) {
        localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(USUARIOS_SEMILLA));
        return [...USUARIOS_SEMILLA];
    }
    try {
        return JSON.parse(guardado);
    } catch (e) {
        localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(USUARIOS_SEMILLA));
        return [...USUARIOS_SEMILLA];
    }
}

function guardarUsuarios(lista) {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(lista));
}

function obtenerUsuarioPorCorreo(correo) {
    return obtenerUsuarios().find(
        (u) => u.correo.toLowerCase() === (correo || "").toLowerCase()
    ) || null;
}

function obtenerUsuarioPorRun(run) {
    return obtenerUsuarios().find((u) => u.run === run) || null;
}

/** Crea un nuevo usuario. Devuelve un objeto { ok, error } */
function crearUsuario(usuario) {
    const lista = obtenerUsuarios();
    if (lista.some((u) => u.correo.toLowerCase() === usuario.correo.toLowerCase())) {
        return { ok: false, error: "Ya existe una cuenta registrada con ese correo." };
    }
    if (lista.some((u) => u.run === usuario.run)) {
        return { ok: false, error: "Ya existe una cuenta registrada con ese RUN." };
    }
    lista.push(usuario);
    guardarUsuarios(lista);
    return { ok: true };
}

function actualizarUsuario(correoOriginal, datosNuevos) {
    const lista = obtenerUsuarios();
    const idx = lista.findIndex((u) => u.correo === correoOriginal);
    if (idx === -1) return false;
    lista[idx] = datosNuevos;
    guardarUsuarios(lista);
    return true;
}

function eliminarUsuario(correo) {
    const lista = obtenerUsuarios().filter((u) => u.correo !== correo);
    guardarUsuarios(lista);
}
