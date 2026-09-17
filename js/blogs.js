/* blogs */
const BLOGS = [
    {
        id: 1,
        titulo: "5 técnicas para cuidar tus pinceles de acrílico",
        imagen: "img/productos/pinceles.jpg",
        fecha: "12 de agosto, 2026",
        resumen: "La pintura acrílica seca rápido y puede arruinar tus pinceles si no los limpias a tiempo. Te contamos cómo alargarles la vida.",
        contenido: [
            "La pintura acrílica es de las favoritas de estudiantes y artistas por su rapidez de secado, pero esa misma característica puede terminar dañando tus pinceles si no los cuidas correctamente.",
            "Lo primero es no dejar nunca un pincel apoyado sobre las cerdas dentro del agua: con el tiempo se deforman y pierden su punta. Lo ideal es lavarlo apenas termines de usarlo, con agua tibia y un jabón neutro, masajeando suavemente desde la base hacia la punta.",
            "Si la pintura ya se secó, puedes remojar el pincel en alcohol isopropílico o en un limpiador específico para acrílico durante unos minutos antes de lavarlo; nunca uses agua hirviendo ni fuerces las cerdas.",
            "Para guardarlos, sécalos con un paño suave, dales forma con los dedos y almacénalos en posición horizontal o con las cerdas hacia arriba. Así evitarás que se doblen o se abran con el uso diario.",
            "Siguiendo estos pasos, un buen set de pinceles como los que encuentras en nuestra tienda puede durarte muchísimos proyectos más."
        ]
    },
    {
        id: 2,
        titulo: "Cómo elegir el cuaderno ideal para volver a clases",
        imagen: "img/productos/cuaderno.jpg",
        fecha: "20 de agosto, 2026",
        resumen: "Entre tantas opciones de cuadrícula, tamaño y tapa, elegir el cuaderno correcto puede marcar la diferencia en tu organización del semestre.",
        contenido: [
            "Cada vuelta a clases trae la misma pregunta: ¿qué cuaderno elijo? La respuesta depende del uso que le vayas a dar, pero hay algunos criterios que sirven para cualquier estudiante.",
            "Si tomas apuntes con diagramas, tablas o dibujos técnicos, un cuadriculado de 5mm te dará más precisión. Si prefieres escribir rápido y con letra grande, el cuadriculado de 7mm o incluso una hoja rayada será más cómodo.",
            "La cantidad de hojas también importa: para una asignatura de un semestre, 100 hojas suelen ser suficientes, pero si tomas apuntes muy detallados, vale la pena optar por un cuaderno universitario más grueso.",
            "Por último, no subestimes la tapa dura: protege mejor tus apuntes dentro de la mochila y hace que el cuaderno dure todo el año sin deformarse.",
            "En Art Tools encontrarás distintos formatos de cuadrícula y tamaño para que armes tu set de vuelta a clases sin complicaciones."
        ]
    }
];

function renderListadoBlogs(){
    const contenedor = document.getElementById("lista-blogs");
    if(!contenedor) return;

    contenedor.innerHTML = BLOGS.map((b) => `
        <article class="blog-card">
            <img src="${b.imagen}" alt="${escapeHtml(b.titulo)}"/>
            <div class="blog-card-info">
                <span class="fecha-blog">${escapeHtml(b.fecha)}</span>
                <h2>${escapeHtml(b.titulo)}</h2>
                <p>${escapeHtml(b.resumen)}</p>
                <a class="btn-primario" href="blog-detalle.html?id=${b.id}">Leer más</a>
            </div>
        </article>
    `).join("");
}

function renderDetalleBlogs(){
    const contenedor = document.getElementById("blog-detalle-contenido");
    if(!contenedor) return;

    const id = parseInt(getQueryParam("id"),10);
    const blog = BLOGS.find((b) => b.id === id) || BLOGS[0];

    document.title = `Art Tools - ${blog.titulo}`;
    contenedor.innerHTML = `
        <img src="${blog.imagen}" alt="${escapeHtml(blog.titulo)}"/>
        <h2>${escapeHtml(blog.titulo)}</h2>
        <span class="fecha-blog">${escapeHtml(blog.fecha)}</span>
        ${blog.contenido.map((parrafo) => `<p>${escapeHtml(parrafo)}</p>`).join("")}
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    renderListadoBlogs();
    renderDetalleBlogs();
});