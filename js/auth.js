/* auth: maneja sesion del usuario, protege vista admin */
const CLAVE_SESION = "at_sesion";

function obtenerSesion(){
    const guardado = localStorage.getItem(CLAVE_SESION);
    if(!guardado) return null;
    try{
        return JSON.parse(guardado);
    }catch (e){
        return null;
    }
}

function iniciarSesion(usuario){
    const sesion = {
        run: usuario.run,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        tipoUsuario: usuario.tipoUsuario
    };
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
}

function cerrarSesion(){
    localStorage.removeItem(CLAVE_SESION);
    window.location.href = calcularRuta("index.html");
}

function calcularRuta(destino){
    const enAdmin = window.location.pathname.includes("/admin/");
    return enAdmin ? "../" + destino : destino;
}

function renderAuthArea(){
    const contenedor = document.getElementById("auth-area");
    if(!contenedor) return;

    const sesion = obtenerSesion();

    if(!sesion){
        contenedor.innerHTML = `
            <a href="${calcularRuta("login.html")}">Iniciar sesión</a>
            <span>|</span>
            <a href="${calcularRuta("registro.html")}">Registrarse</a>
        `;
        return;
    }

    const esStaff = sesion.tipoUsuario === "administrador" || sesion.tipoUsuario === "vendedor";

    contenedor.innerHTML = `
        <span>Hola, ${escapeHtml(sesion.nombre)}</span>
        ${esStaff ? `<a class="admin-link" href="${calcularRuta("admin/index.html")}">Panel admin</a>` : ""}
        <button type="button" class="btn-link" id="btn-cerrar-sesion">Cerrar sesión</button>
    `;

    const btnSalir = document.getElementById("btn-cerrar-sesion");
    if(btnSalir){
        btnSalir.addEventListener("click", () => {
            cerrarSesion();
        });
    }
}

function protegerAdmin(rolesPermitidos){
    const sesion = obtenerSesion();
    const main = document.querySelector(".admin-main");

    if(!sesion || !rolesPermitidos.includes(sesion.tipoUsuario)){
        if(main){
            main.innerHTML = `
                <div class="restringido">
                    <h2>Acceso restringido</h2>
                    <p>Necesitas iniciar sesión con una cuenta de administrador o vendedor para ver esta página.</p>
                    <br>
                    <a class="btn-primario" href="${sesion ? "index.html" : "../login.html"}">
                        ${sesion ? "Volver al panel" : "Ir a iniciar sesión"}
                    </a>
                </div>
            `;
        }

        const sidebar = document.querySelector(".admin-sidebar");
        if(sidebar) sidebar.classList.add("oculto");
        return null;
    }

    const badge = document.getElementById("rol-badge");
    if(badge) badge.textContent = sesion.tipoUsuario;

    const nombreEl = document.getElementById("admin-nombre-usuario");
    if(nombreEl) nombreEl.textContent = `${sesion.nombre} ${sesion.apellidos || ""}`.trim();

    if(sesion.tipoUsuario === "vendedor"){
        document.querySelectorAll("[data-solo-admin]").forEach((el) => el.classList.add("oculto"));
    }
    return sesion;
}

document.addEventListener("DOMContentLoaded", () => {
    renderAuthArea()
    const btnAdminSalir = document.getElementById("btn-cerrar-sesion-admin");
    if(btnAdminSalir) btnAdminSalir.addEventListener("click", cerrarSesion);
});