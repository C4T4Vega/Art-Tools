/* Productos data: catalogo, arreglo semilla(crear y mostrar) 
    funciones leer/escribir(localStorage)(sin efecto real)*/
const CLAVE_PRODUCTOS = "at_productos";

const CATEGORIAS = [
    {slug: "escolar", nombre: "Escolar"},
    {slug: "oficina", nombre: "Oficina"},
    {slug: "papeleria", nombre: "Papelería"},
    {slug: "tecnicas", nombre: "Técnicas varias"},
];

function nombreCategoria(slug){
    const cat = CATEGORIAS.find((c) => c.slug === slug);
    return cat ? cat.nombre : slug;
}

/* semilla(estilo) */
const PRODUCTOS_SEMILLA= [
    {codigo: "OFI-001",
    nombre: "Corchetera negra B4 Torre",
    descripcion:  "Corchetera negra B4 Torre, ideal para trabajos escolares, oficina y para lo que necesites organizar. Su diseño permite unir documentos de manera sencilla y resistente.",
    precio: 5690,
    stock: 40,
    stockCritico: 5,
    categoria: "oficina",
    imagen: "img/productos/corchetera.jpg",
    destacado: true
    },
    {
        codigo: "ESC-001",
        nombre: "Cuaderno Universitario Torre 7mm 100hjs",
        descripcion: "Cuaderno universitario de 100 hojas, cuadriculado 7mm, ideal para el colegio o la universidad.",
        precio: 1900,
        stock: 65,
        stockCritico: 10,
        categoria: "escolar",
        imagen: "img/productos/cuaderno.jpg",
        destacado: true
    },
    {
        codigo: "ESC-002",
        nombre: "Cuaderno Universitario Torre 5mm 100hjs",
        descripcion: "Cuaderno universitario de 100 hojas, cuadriculado 5mm, formato compacto.",
        precio: 1900,
        stock: 50,
        stockCritico: 10,
        categoria: "escolar",
        imagen: "img/productos/cuaderno.jpg"
    },
    {
        codigo: "PAP-001",
        nombre: "Libreta negra tapa dura 100 hjs rayadas",
        descripcion: "Libreta de tapa dura, 100 hojas rayadas, perfecta para apuntes y bocetos rápidos.",
        precio: 1900,
        stock: 38,
        stockCritico: 5,
        categoria: "papeleria",
        imagen: "img/productos/libreta.jpg"
    },
    {
        codigo: "PAP-002",
        nombre: "Libreta tapa dura 80 hjs cuadriculada",
        descripcion: "Libreta de tapa dura, 80 hojas cuadriculadas, tamaño de bolsillo.",
        precio: 1750,
        stock: 4,
        stockCritico: 5,
        categoria: "papeleria",
        imagen: "img/productos/libreta.jpg"
    },
    {
        codigo: "TEC-001",
        nombre: "Set 5 Pinceles para Acrílico Artel",
        descripcion: "Set de 5 pinceles de distintos grosores, especiales para pintura acrílica.",
        precio: 6500,
        stock: 22,
        stockCritico: 5,
        categoria: "tecnicas",
        imagen: "img/productos/pinceles.jpg",
        destacado: true
    },
    {
        codigo: "TEC-002",
        nombre: "Set De 24 Pinturas Acrílicas En Tubos Artel",
        descripcion: "Set de 24 pinturas acrílicas en tubo, colores surtidos, ideales para telas y superficies rígidas.",
        precio: 8490,
        stock: 17,
        stockCritico: 3,
        categoria: "tecnicas",
        imagen: "img/productos/pintura.jpg",
        destacado: true
    },
    {
        codigo: "TEC-003",
        nombre: "Set De 12 Pinturas Acrílicas En Tubos Artel",
        descripcion: "Set de 12 pinturas acrílicas en tubo, colores surtidos, formato económico.",
        precio: 4990,
        stock: 0,
        stockCritico: 3,
        categoria: "tecnicas",
        imagen: "img/productos/pintura.jpg"
    }
];

/* obtiene codigp actual desde localStorage */
function obtenerProductos(){
    const guardado = localStorage.getItem(CLAVE_PRODUCTOS);
    if(!guardado){
        localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(PRODUCTOS_SEMILLA));
        return [...PRODUCTOS_SEMILLA];
    }
    try{
        return JSON.parse(guardado);
    }catch (e){
        localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(PRODUCTOS_SEMILLA));
        return [...PRODUCTOS_SEMILLA];
    }
}

/* guarda el catalogo en localStorage */
function guardarProductos(lista){
    localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(lista));
}

function obtenerProductoPorCatalogo(codigo){
    return obtenerProductos().find((p) => p.codigo === codigo) || null;
}

/* Agrega producto(false si ya existe) */
function crearProducto(producto){
    const lista = obtenerProductos();
    if(lista.some((p) => p.codigo.toLowerCase() === producto.codigo.toLowerCase())){
        return false;
    }
    lista.push(producto);
    guardarProductos(lista);
    return true;
}

/* edita por codigo actual */
function actualizarProducto(codigoOriginal, datosNuevos){
    const lista = obtenerProductos();
    const idx = lista.findIndex((p) => p.codigo === codigoOriginal);
    if(idx === -1) return false;
    lista[idx] = datosNuevos;
    guardarProductos(lista);
    return true;
}

function eliminatProducto(codigo){
    const lista = obtenerProductos().filter((p) => p.codigo !== codigo);
    guardarProductos(lista);
}