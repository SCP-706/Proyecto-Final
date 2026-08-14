const NOMBRES_EQUIPO_IA = ["charmander", "squirtle", "bulbasaur"];
const TABLA_TIPOS = {
    normal: { rock: 0.5, ghost: 0, steel: 0.5 },
    fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
    water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
    electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
    grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
    ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
    fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
    poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
    ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
    flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
    psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
    bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
    rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
    ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
    dragon: { dragon: 2, steel: 0.5, fairy: 0 },
    dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
    steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
    fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
};
const PROBABILIDAD_CRITICO = 0.15;
const MOVIMIENTO_FORCEJEO = { nombre: "forcejeo", poder: 50, tipo: "normal", pp: Infinity, ppActual: Infinity };
function calcularEfectividad(tipoMovimiento, tiposDefensor) {
    const tabla = TABLA_TIPOS[tipoMovimiento];
    if (!tabla || !tiposDefensor) return 1;
    return tiposDefensor.reduce(function (multiplicadorAcumulado, tipoDefensor) {
        const valor = tabla[tipoDefensor];
        return multiplicadorAcumulado * (valor === undefined ? 1 : valor);
    }, 1);
}
function elegirMovimientoConPP(pokemon) {
    const disponibles = pokemon.movimientos.filter(function (m) {
        return m.ppActual > 0;
    });
    if (disponibles.length === 0) return MOVIMIENTO_FORCEJEO;
    return disponibles[Math.floor(Math.random() * disponibles.length)];
}
let perfilActivo = null;
let equipoSeleccionadoId = null;
let estadoDuelo = null;
const vistaInicio = document.querySelector("#vista-inicio");
const vistaEquipos = document.querySelector("#vista-equipos");
const vistaDuelo = document.querySelector("#vista-duelo");
const navApp = document.querySelector("#nav-app");
const infoPerfilActivo = document.querySelector("#info-perfil-activo");
const listaPerfiles = document.querySelector("#lista-perfiles");
const formNuevoPerfil = document.querySelector("#form-nuevo-perfil");
const nombreEntrenadorActual = document.querySelector("#nombre-entrenador-actual");
const listaEquipos = document.querySelector("#lista-equipos");
const formNuevoEquipo = document.querySelector("#form-nuevo-equipo");
const detalleEquipo = document.querySelector("#detalle-equipo");
const nombreEquipoDetalle = document.querySelector("#nombre-equipo-detalle");
const fichasPokemon = document.querySelector("#fichas-pokemon");
const formAgregarPokemon = document.querySelector("#form-agregar-pokemon");
const inputBuscarPokemon = document.querySelector("#buscar-pokemon");
const errorAgregarPokemon = document.querySelector("#error-agregar-pokemon");
const selectEquipoDuelo = document.querySelector("#select-equipo-duelo");
const formIniciarDuelo = document.querySelector("#form-iniciar-duelo");
const mensajeDuelo = document.querySelector("#mensaje-duelo");
const zonaBatalla = document.querySelector("#zona-batalla");
const contenedorPokemonJugador = document.querySelector("#pokemon-jugador");
const contenedorPokemonIA = document.querySelector("#pokemon-ia");
const contenedorBotonesMovimientos = document.querySelector("#botones-movimientos");
const resultadoDuelo = document.querySelector("#resultado-duelo");
const logDuelo = document.querySelector("#log-duelo");
function mostrarVista(vista) {
    vistaInicio.classList.add("oculto");
    vistaEquipos.classList.add("oculto");
    vistaDuelo.classList.add("oculto");
    vista.classList.remove("oculto");
}
function irAVistaEquipos() {
    mostrarVista(vistaEquipos);
    equipoSeleccionadoId = null;
    detalleEquipo.classList.add("oculto");
    renderizarListaEquipos();
}
function irAVistaDuelo() {
    mostrarVista(vistaDuelo);
    renderizarSelectorEquiposDuelo();
}
document.querySelector("#boton-ir-equipos").addEventListener("click", irAVistaEquipos);
document.querySelector("#boton-ir-duelo").addEventListener("click", irAVistaDuelo);
document.querySelector("#boton-cambiar-perfil").addEventListener("click", function () {
    perfilActivo = null;
    navApp.classList.add("oculto");
    infoPerfilActivo.textContent = "";
    mostrarVista(vistaInicio);
    renderizarListaPerfiles();
});
function renderizarListaPerfiles() {
    listaPerfiles.innerHTML = "";
    const perfiles = obtenerPerfiles();
    if (perfiles.length === 0) {
        const mensaje = document.createElement("p");
        mensaje.textContent = "Todavía no hay perfiles. Creá el primero.";
        listaPerfiles.append(mensaje);
        return;
    }
    perfiles.forEach(function (perfil) {
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("tarjeta-perfil");
        const nombre = document.createElement("h3");
        nombre.textContent = perfil.nombre;
        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = "Entrar";
        boton.addEventListener("click", function () {
            seleccionarPerfil(perfil);
        });
        tarjeta.append(nombre, boton);
        listaPerfiles.append(tarjeta);
    });
}
function seleccionarPerfil(perfil) {
    perfilActivo = perfil;
    infoPerfilActivo.textContent = `Entrenador: ${perfil.nombre}`;
    nombreEntrenadorActual.textContent = perfil.nombre;
    navApp.classList.remove("oculto");
    irAVistaEquipos();
}
formNuevoPerfil.addEventListener("submit", function (e) {
    e.preventDefault();
    const input = document.querySelector("#nombre-perfil");
    const nombre = input.value.trim();
    if (nombre === "") return;
    const nuevoPerfil = crearPerfil(nombre);
    input.value = "";
    seleccionarPerfil(nuevoPerfil);
});
function renderizarListaEquipos() {
    listaEquipos.innerHTML = "";
    const equipos = obtenerEquiposDePerfil(perfilActivo.id);
    if (equipos.length === 0) {
        const mensaje = document.createElement("p");
        mensaje.textContent = "Todavía no tenés equipos. Creá uno.";
        listaEquipos.append(mensaje);
        return;
    }
    equipos.forEach(function (equipo) {
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("tarjeta-equipo");
        const nombre = document.createElement("h3");
        nombre.textContent = `${equipo.nombre} (${equipo.pokemones.length}/6)`;
        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = "Gestionar";
        boton.addEventListener("click", function () {
            mostrarDetalleEquipo(equipo.id);
        });
        tarjeta.append(nombre, boton);
        listaEquipos.append(tarjeta);
    });
}
formNuevoEquipo.addEventListener("submit", function (e) {
    e.preventDefault();
    const input = document.querySelector("#nombre-equipo");
    const nombre = input.value.trim();
    if (nombre === "") return;
    crearEquipo(perfilActivo.id, nombre);
    input.value = "";
    renderizarListaEquipos();
});
function mostrarDetalleEquipo(equipoId) {
    equipoSeleccionadoId = equipoId;
    detalleEquipo.classList.remove("oculto");
    renderizarDetalleEquipo();
}
function obtenerEquipoSeleccionado() {
    return obtenerEquipos().find(function (equipo) {
        return equipo.id === equipoSeleccionadoId;
    });
}
function renderizarDetalleEquipo() {
    const equipo = obtenerEquipoSeleccionado();
    if (!equipo) return;
    nombreEquipoDetalle.textContent = equipo.nombre;
    fichasPokemon.innerHTML = "";
    equipo.pokemones.forEach(function (pokemon) {
        fichasPokemon.append(crearFichaPokemon(pokemon));
    });
    if (equipo.pokemones.length >= 6) {
        formAgregarPokemon.classList.add("oculto");
    } else {
        formAgregarPokemon.classList.remove("oculto");
    }
}
function crearFichaPokemon(pokemon) {
    const ficha = document.createElement("article");
    ficha.classList.add("ficha-pokemon");
    const sprite = document.createElement("img");
    sprite.src = pokemon.sprite;
    sprite.alt = pokemon.nombre;
    const nombre = document.createElement("h4");
    nombre.textContent = pokemon.nombre;
    const tipos = document.createElement("p");
    tipos.classList.add("tipos-pokemon");
    tipos.textContent = (pokemon.tipos || []).join(" / ");
    const stats = document.createElement("ul");
    stats.classList.add("lista-stats");
    ["hp", "attack", "defense", "speed"].forEach(function (clave) {
        const li = document.createElement("li");
        li.textContent = `${clave.toUpperCase()}: ${pokemon.stats[clave]}`;
        stats.append(li);
    });
    const movimientos = document.createElement("ul");
    movimientos.classList.add("lista-movimientos");
    pokemon.movimientos.forEach(function (movimiento) {
        const li = document.createElement("li");
        li.textContent = `${movimiento.nombre} (poder ${movimiento.poder}, tipo ${movimiento.tipo}, PP ${movimiento.pp})`;
        movimientos.append(li);
    });
    ficha.append(sprite, nombre, tipos, stats, movimientos);
    return ficha;
}
formAgregarPokemon.addEventListener("submit", async function (e) {
    e.preventDefault();
    errorAgregarPokemon.classList.add("oculto");
    const busqueda = inputBuscarPokemon.value.trim();
    if (busqueda === "") return;
    try {
        const pokemon = await obtenerPokemon(busqueda);
        agregarPokemonAEquipo(equipoSeleccionadoId, pokemon);
        inputBuscarPokemon.value = "";
        renderizarDetalleEquipo();
        renderizarListaEquipos();
    } catch (error) {
        errorAgregarPokemon.textContent = error.message;
        errorAgregarPokemon.classList.remove("oculto");
    }
});
function renderizarSelectorEquiposDuelo() {
    const equipos = obtenerEquiposDePerfil(perfilActivo.id).filter(function (equipo) {
        return equipo.pokemones.length > 0;
    });
    selectEquipoDuelo.innerHTML = "";
    const botonIniciar = formIniciarDuelo.querySelector("button");
    if (equipos.length === 0) {
        const opcion = document.createElement("option");
        opcion.textContent = "No tenés equipos con Pokémon todavía";
        selectEquipoDuelo.append(opcion);
        botonIniciar.disabled = true;
        return;
    }
    botonIniciar.disabled = false;
    equipos.forEach(function (equipo) {
        const opcion = document.createElement("option");
        opcion.value = equipo.id;
        opcion.textContent = equipo.nombre;
        selectEquipoDuelo.append(opcion);
    });
}
formIniciarDuelo.addEventListener("submit", async function (e) {
    e.preventDefault();
    mensajeDuelo.classList.add("oculto");
    const equipoId = selectEquipoDuelo.value;
    const equipoJugador = obtenerEquipos().find(function (equipo) {
        return equipo.id === equipoId;
    });
    if (!equipoJugador) return;
    try {
        const pokemonesIA = [];
        for (const nombre of NOMBRES_EQUIPO_IA) {
            const pokemon = await obtenerPokemon(nombre);
            pokemonesIA.push(pokemon);
        }
        iniciarDuelo(equipoJugador.pokemones, pokemonesIA);
    } catch (error) {
        mensajeDuelo.textContent = "No se pudo preparar el equipo rival: " + error.message;
        mensajeDuelo.classList.remove("oculto");
    }
});
function clonarPokemonParaDuelo(pokemon) {
    return {
        ...pokemon,
        hpActual: pokemon.stats.hp,
        // Copia propia de los movimientos con su PP actual, para no modificar
        // los datos guardados en el equipo ni la caché.
        movimientos: pokemon.movimientos.map(function (movimiento) {
            return {
                ...movimiento,
                ppActual: movimiento.pp
            };
        })
    };
}
function iniciarDuelo(pokemonesJugador, pokemonesIA) {
    estadoDuelo = {
        jugador: {
            pokemones: pokemonesJugador.map(clonarPokemonParaDuelo),
            indiceActivo: 0
        },
        ia: {
            pokemones: pokemonesIA.map(clonarPokemonParaDuelo),
            indiceActivo: 0
        },
        terminado: false
    };
    logDuelo.innerHTML = "";
    resultadoDuelo.classList.add("oculto");
    zonaBatalla.classList.remove("oculto");
    formIniciarDuelo.classList.add("oculto");
    renderizarDuelo();
}
function pokemonActivo(bando) {
    return bando.pokemones[bando.indiceActivo];
}
function calcularDaño(movimiento, atacante, defensor) {
    const dañoBase = Math.floor((movimiento.poder * atacante.stats.attack) / defensor.stats.defense * 0.5);
    const efectividad = calcularEfectividad(movimiento.tipo, defensor.tipos);
    const esCritico = Math.random() < PROBABILIDAD_CRITICO;
    const multiplicadorCritico = esCritico ? 2 : 1;
    const dañoFinal = Math.floor(dañoBase * efectividad * multiplicadorCritico);
    return { daño: dañoFinal, efectividad: efectividad, esCritico: esCritico };
}

function descripcionEfectividad(efectividad) {
    if (efectividad === 0) return " No tuvo efecto...";
    if (efectividad > 1) return " ¡Es súper efectivo!";
    if (efectividad < 1) return " No es muy efectivo...";
    return "";
}
function agregarLog(texto) {
    const li = document.createElement("li");
    li.textContent = texto;
    logDuelo.append(li);
    logDuelo.scrollTop = logDuelo.scrollHeight;
}
function avanzarSiEstaDebilitado(bando, nombreBando) {
    if (pokemonActivo(bando).hpActual > 0) return true;
    agregarLog(`${pokemonActivo(bando).nombre} fue debilitado.`);
    const indiceSiguiente = bando.pokemones.findIndex(function (pokemon) {
        return pokemon.hpActual > 0;
    });
    if (indiceSiguiente === -1) {
        return false;
    }
    bando.indiceActivo = indiceSiguiente;
    agregarLog(`${nombreBando} envía a ${pokemonActivo(bando).nombre}.`);
    return true;
}
function jugarTurno(indiceMovimiento) {
    if (estadoDuelo.terminado) return;
    const atacanteJugador = pokemonActivo(estadoDuelo.jugador);
    const defensorIA = pokemonActivo(estadoDuelo.ia);
    const movimientoJugador = atacanteJugador.movimientos[indiceMovimiento];
    if (movimientoJugador.ppActual <= 0) return; // sin PP, no se puede usar (el botón ya debería estar deshabilitado)
    movimientoJugador.ppActual -= 1;
    const resultadoJugador = calcularDaño(movimientoJugador, atacanteJugador, defensorIA);
    defensorIA.hpActual = Math.max(0, defensorIA.hpActual - resultadoJugador.daño);
    agregarLog(
        `${atacanteJugador.nombre} usó ${movimientoJugador.nombre} e hizo ${resultadoJugador.daño} de daño a ${defensorIA.nombre} (HP: ${defensorIA.hpActual}/${defensorIA.stats.hp}).${resultadoJugador.esCritico ? " ¡Golpe crítico!" : ""}${descripcionEfectividad(resultadoJugador.efectividad)}`
    );
    const iaSigueEnPie = avanzarSiEstaDebilitado(estadoDuelo.ia, "La IA");
    if (!iaSigueEnPie) {
        terminarDuelo("¡Ganaste el duelo!");
        return;
    }
    if (pokemonActivo(estadoDuelo.ia) === defensorIA) {
        const atacanteIA = defensorIA;
        const defensorJugador = atacanteJugador;
        const movimientoIA = elegirMovimientoConPP(atacanteIA);
        if (movimientoIA.ppActual !== Infinity) {
            movimientoIA.ppActual -= 1;
        }
        const resultadoIA = calcularDaño(movimientoIA, atacanteIA, defensorJugador);
        defensorJugador.hpActual = Math.max(0, defensorJugador.hpActual - resultadoIA.daño);
        agregarLog(
            `${atacanteIA.nombre} usó ${movimientoIA.nombre} e hizo ${resultadoIA.daño} de daño a ${defensorJugador.nombre} (HP: ${defensorJugador.hpActual}/${defensorJugador.stats.hp}).${resultadoIA.esCritico ? " ¡Golpe crítico!" : ""}${descripcionEfectividad(resultadoIA.efectividad)}`
        );
        const jugadorSigueEnPie = avanzarSiEstaDebilitado(estadoDuelo.jugador, "El jugador");
        if (!jugadorSigueEnPie) {
            terminarDuelo("Perdiste el duelo. ¡La IA ganó!");
            return;
        }
    }
    renderizarDuelo();
}
function terminarDuelo(mensaje) {
    estadoDuelo.terminado = true;
    resultadoDuelo.textContent = mensaje;
    resultadoDuelo.classList.remove("oculto");
    renderizarDuelo();
}
function renderizarTarjetaCombate(contenedor, pokemon) {
    contenedor.innerHTML = "";
    const sprite = document.createElement("img");
    sprite.src = pokemon.sprite;
    sprite.alt = pokemon.nombre;
    const nombre = document.createElement("h4");
    nombre.textContent = pokemon.nombre;
    const tipos = document.createElement("p");
    tipos.classList.add("tipos-pokemon");
    tipos.textContent = (pokemon.tipos || []).join(" / ");
    const hp = document.createElement("p");
    hp.textContent = `HP: ${pokemon.hpActual}/${pokemon.stats.hp}`;
    contenedor.append(sprite, nombre, tipos, hp);
}
function renderizarDuelo() {
    renderizarTarjetaCombate(contenedorPokemonJugador, pokemonActivo(estadoDuelo.jugador));
    renderizarTarjetaCombate(contenedorPokemonIA, pokemonActivo(estadoDuelo.ia));
    contenedorBotonesMovimientos.innerHTML = "";
    const pokemonJugador = pokemonActivo(estadoDuelo.jugador);
    pokemonJugador.movimientos.forEach(function (movimiento, indice) {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = `${movimiento.nombre} (poder ${movimiento.poder}, tipo ${movimiento.tipo}) — PP: ${movimiento.ppActual}/${movimiento.pp}`;
        boton.disabled = estadoDuelo.terminado || movimiento.ppActual <= 0;
        boton.addEventListener("click", function () {
            jugarTurno(indice);
        });
        contenedorBotonesMovimientos.append(boton);
    });
}
renderizarListaPerfiles();
