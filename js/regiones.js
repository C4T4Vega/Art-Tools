/* Regiones y comunas */
const REGIONES = [
    { region: "Arica y Parinacota", comunas: ["Arica", "Putre", "Camarones", "General Lagos"] },
    { region: "Tarapacá", comunas: ["Iquique", "Alto Hospicio", "Pozo Almonte", "Pica"] },
    { region: "Antofagasta", comunas: ["Antofagasta", "Calama", "Tocopilla", "Mejillones"] },
    { region: "Atacama", comunas: ["Copiapó", "Vallenar", "Chañaral", "Caldera"] },
    { region: "Coquimbo", comunas: ["La Serena", "Coquimbo", "Ovalle", "Illapel"] },
    { region: "Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "San Antonio"] },
    { region: "Región Metropolitana de Santiago", comunas: ["Santiago", "Providencia", "Las Condes", "Ñuñoa", "Maipú", "Puente Alto"] },
    { region: "Libertador General Bernardo O'Higgins", comunas: ["Rancagua", "San Fernando", "Rengo", "Santa Cruz"] },
    { region: "Maule", comunas: ["Talca", "Curicó", "Linares", "Cauquenes"] },
    { region: "Ñuble", comunas: ["Chillán", "Chillán Viejo", "San Carlos", "Bulnes"] },
    { region: "Biobío", comunas: ["Concepción", "Talcahuano", "Los Ángeles", "Coronel"] },
    { region: "La Araucanía", comunas: ["Temuco", "Villarrica", "Angol", "Pucón"] },
    { region: "Los Ríos", comunas: ["Valdivia", "La Unión", "Río Bueno", "Panguipulli"] },
    { region: "Los Lagos", comunas: ["Puerto Montt", "Osorno", "Castro", "Puerto Varas"] },
    { region: "Aysén del General Carlos Ibáñez del Campo", comunas: ["Coyhaique", "Puerto Aysén", "Chile Chico"] },
    { region: "Magallanes y de la Antártica Chilena", comunas: ["Punta Arenas", "Puerto Natales", "Porvenir"] }
];

function poblarSelectRegiones(selectEl){
    selectEl.innerHTML = '<option value="">-- Seleccione la región --</option>';
    REGIONES.forEach((r) => {
        const opt = document.createElement("option");
        opt.value = r.region;
        opt.textContent = r.region;
        selectEl.appendChild(opt);
    });
}

function poblarSelectComunas(selectComunaEl, nombreRegion){
    const region = REGIONES.find((r) => r.region === nombreRegion);
    selectComunaEl.innerHTML = '<option value="">-- Seleccione la comuna --</option>';
    if(!region) return;
    region.comunas.forEach((c) => {
        const opt= document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        selectComunaEl.appendChild(opt);
    });
}

function enlazarRegionComuna(selectRegionEl, selectComunaEl){
    poblarSelectRegiones(selectRegionEl);
    selectComunaEl.innerHTML = '<option value="">-- Primero seleccione la region --</option>';

    selectRegionEl.addEventListener("change", () => {
        poblarSelectComunas(selectComunaEl, selectRegionEl.value)
    });
}