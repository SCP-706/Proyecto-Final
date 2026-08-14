const URL_BASE_POKEAPI = "https://pokeapi.co/api/v2";
// Se usa "_v2" porque ahora guardamos datos nuevos (tipo del Pokémon y PP del
// movimiento) que las cachés viejas no tenían. Así evitamos usar datos incompletos.
function obtenerCachePokemon() {
    const datos = localStorage.getItem("pokebattle_cache_pokemon_v2");
    return datos ? JSON.parse(datos) : {};
}
function guardarCachePokemon(cache) {
    localStorage.setItem("pokebattle_cache_pokemon_v2", JSON.stringify(cache));
}
function obtenerCacheMovimientos() {
    const datos = localStorage.getItem("pokebattle_cache_movimientos_v2");
    return datos ? JSON.parse(datos) : {};
}
function guardarCacheMovimientos(cache) {
    localStorage.setItem("pokebattle_cache_movimientos_v2", JSON.stringify(cache));
}
function extraerStat(statsApi, nombreStat) {
    const encontrado = statsApi.find(function (item) {
        return item.stat.name === nombreStat;
    });
    return encontrado ? encontrado.base_stat : 0;
}
async function obtenerMovimiento(nombreMovimiento) {
    const cache = obtenerCacheMovimientos();
    if (cache[nombreMovimiento]) {
        return cache[nombreMovimiento];
    }
    const respuesta = await fetch(`${URL_BASE_POKEAPI}/move/${nombreMovimiento}`);
    if (!respuesta.ok) {
        throw new Error(`No se pudo obtener el movimiento "${nombreMovimiento}".`);
    }
    const datos = await respuesta.json();
    const movimiento = {
        nombre: datos.name,
        poder: datos.power === null ? 40 : datos.power,
        tipo: datos.type.name,
        pp: datos.pp === null || datos.pp === undefined ? 15 : datos.pp
    };
    cache[nombreMovimiento] = movimiento;
    guardarCacheMovimientos(cache);

    return movimiento;
}
async function obtenerPokemon(busqueda) {
    const clave = busqueda.toString().toLowerCase().trim();
    const cache = obtenerCachePokemon();
    if (cache[clave]) {
        return cache[clave];
    }
    const respuesta = await fetch(`${URL_BASE_POKEAPI}/pokemon/${clave}`);
    if (!respuesta.ok) {
        throw new Error(`No se encontró ningún Pokémon con el nombre o número "${busqueda}".`);
    }
    const datos = await respuesta.json();
    const primerosCuatroMovimientos = datos.moves.slice(0, 4);
    const movimientos = [];

    for (const movimientoApi of primerosCuatroMovimientos) {
        const movimiento = await obtenerMovimiento(movimientoApi.move.name);
        movimientos.push(movimiento);
    }
    const pokemon = {
        id: datos.id,
        nombre: datos.name,
        sprite: datos.sprites.front_default,
        tipos: datos.types.map(function (t) {
            return t.type.name;
        }),
        stats: {
            hp: extraerStat(datos.stats, "hp"),
            attack: extraerStat(datos.stats, "attack"),
            defense: extraerStat(datos.stats, "defense"),
            speed: extraerStat(datos.stats, "speed")
        },
        movimientos: movimientos
    };
    cache[clave] = pokemon;
    guardarCachePokemon(cache);
    return pokemon;
}
