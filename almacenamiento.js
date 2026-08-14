function generarId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
function obtenerPerfiles() {
    const datos = localStorage.getItem("pokebattle_perfiles");
    return datos ? JSON.parse(datos) : [];
}
function guardarPerfiles(perfiles) {
    localStorage.setItem("pokebattle_perfiles", JSON.stringify(perfiles));
}
function crearPerfil(nombre) {
    const perfiles = obtenerPerfiles();
    const nuevoPerfil = { id: generarId(), nombre: nombre };
    perfiles.push(nuevoPerfil);
    guardarPerfiles(perfiles);
    return nuevoPerfil;
}
function obtenerEquipos() {
    const datos = localStorage.getItem("pokebattle_equipos");
    return datos ? JSON.parse(datos) : [];
}
function guardarEquipos(equipos) {
    localStorage.setItem("pokebattle_equipos", JSON.stringify(equipos));
}
function obtenerEquiposDePerfil(perfilId) {
    return obtenerEquipos().filter(function (equipo) {
        return equipo.perfilId === perfilId;
    });
}
function crearEquipo(perfilId, nombre) {
    const equipos = obtenerEquipos();
    const nuevoEquipo = { id: generarId(), perfilId: perfilId, nombre: nombre, pokemones: [] };
    equipos.push(nuevoEquipo);
    guardarEquipos(equipos);
    return nuevoEquipo;
}
function agregarPokemonAEquipo(equipoId, pokemon) {
    const equipos = obtenerEquipos();
    const equipo = equipos.find(function (e) {
        return e.id === equipoId;
    });
    if (!equipo) return;
    if (equipo.pokemones.length >= 6) return;
    equipo.pokemones.push(pokemon);
    guardarEquipos(equipos);
}
