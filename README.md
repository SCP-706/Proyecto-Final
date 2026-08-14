PokéBattle
Aplicación web de simulación de batallas Pokémon desarrollada como proyecto final del curso Diseño y Programación Web.
El proyecto permite crear perfiles de entrenador, crear equipos de hasta 6 Pokémon utilizando información real obtenida mediante la **PokéAPI**, consultar sus estadísticas y movimientos, y enfrentarse contra un equipo controlado por una IA en una batalla por turnos.
La aplicación está desarrollada utilizando **HTML5, CSS3 y JavaScript puro**, sin frameworks ni backend. La información de perfiles, equipos y datos almacenados en caché se conserva mediante `localStorage`.

## 🚀 Funcionalidades

* Creación de perfiles de entrenador.
* Selección de perfiles existentes.
* Creación y gestión de equipos.
* Equipos de hasta 6 Pokémon.
* Búsqueda de Pokémon por nombre o número.
* Consulta de información real mediante PokéAPI.
* Visualización del sprite, nombre, tipos, estadísticas y movimientos.
* Batallas Pokémon por turnos contra una IA.
* Selección de movimientos durante el combate.
* Cálculo de daño mediante la fórmula establecida en el proyecto.
* Cambio automático de Pokémon cuando uno queda debilitado.
* Registro de los acontecimientos de la batalla.
* Persistencia de información mediante `localStorage`.
* Sistema de caché para evitar consultas innecesarias a la PokéAPI.
* Manejo de errores cuando un Pokémon no existe o la API presenta problemas.
* Diseño responsive para diferentes tamaños de pantalla.

## 🛠️ Tecnologías utilizadas

* HTML5
* CSS3
* JavaScript
* PokéAPI
* Web Storage API (`localStorage`)

No se utilizan frameworks, librerías externas ni backend.

## 📁 Estructura del proyecto

```text
Proyecto/
│
├── index.html
├── Estilos.css
├── api.js
├── almacenamiento.js
├── app.js
└── README.md
```

### Descripción de los archivos

**`index.html`**
Contiene la estructura HTML de la aplicación y las tres vistas principales: selección de perfil, gestión de equipos y pantalla de duelo.

**`Estilos.css`**
Contiene todos los estilos visuales de la aplicación, utilizando CSS propio, Flexbox, Grid y reglas responsive.

**`api.js`**
Se encarga de realizar las consultas a la PokéAPI y procesar la información obtenida de los Pokémon y sus movimientos. También implementa el sistema de caché.

**`almacenamiento.js`**
Administra la información almacenada en `localStorage`, incluyendo perfiles, equipos y Pokémon pertenecientes a cada equipo.

**`app.js`**
Contiene la lógica principal de la aplicación, navegación entre vistas, gestión de equipos y funcionamiento de las batallas.

## ▶️ Cómo ejecutar el proyecto

El proyecto no requiere instalación de dependencias ni herramientas de compilación.

### Requisitos

* Un navegador web moderno.
* Conexión a Internet para consultar la PokéAPI.

### Pasos

1. Descargar o clonar el repositorio.
2. Entrar a la carpeta del proyecto.
3. Abrir el archivo `index.html` en un navegador.

No es necesario ejecutar `npm install` ni instalar ningún framework.

## 🌐 PokéAPI

El proyecto utiliza la API pública de Pokémon:

`https://pokeapi.co/api/v2/`

### Endpoint de Pokémon

```text
GET /pokemon/{nombre|id}
```

Ejemplo:

```text
https://pokeapi.co/api/v2/pokemon/pikachu
```

Este endpoint permite obtener información como:

* Nombre.
* Sprite.
* HP.
* Ataque.
* Defensa.
* Velocidad.
* Tipos.
* Movimientos.

### Endpoint de movimientos

```text
GET /move/{nombre}
```

Ejemplo:

```text
https://pokeapi.co/api/v2/move/thunderbolt
```

Se utiliza para obtener información del movimiento, principalmente:

* Poder (`power`).
* Tipo (`type`).
* PP (`pp`).

Cuando el campo `power` de un movimiento es `null`, se utiliza un valor de **40**, según lo establecido en el enunciado del proyecto.

### Endpoint de listado

La PokéAPI también dispone del endpoint:

```text
GET /pokemon?limit=20&offset=0
```

Sin embargo, este endpoint no es utilizado por la aplicación, ya que el sistema de búsqueda permite encontrar Pokémon directamente mediante su nombre o número.

## 💾 Almacenamiento y caché

La aplicación no utiliza un backend. Los datos se almacenan utilizando `localStorage`.

Se almacenan principalmente:

* Perfiles de entrenador.
* Equipos creados.
* Pokémon pertenecientes a los equipos.
* Datos consultados de Pokémon.
* Datos consultados de movimientos.

La aplicación implementa una caché para los datos obtenidos mediante la PokéAPI.

Antes de realizar una nueva consulta, se verifica si la información ya se encuentra almacenada localmente. Si existe, se utiliza la información guardada en lugar de realizar otro `fetch`.

Esto permite reducir las consultas realizadas a la PokéAPI y cumplir con el requisito de caché establecido para el proyecto.

## ⚔️ Mecánica de batalla

La batalla se desarrolla por turnos.

El jugador selecciona uno de los movimientos disponibles de su Pokémon activo y posteriormente la IA selecciona un movimiento.

El daño se calcula utilizando la fórmula establecida en el proyecto:

```text
daño = Math.floor((poder_del_movimiento * ataque) / defensa * 0.5)
```

Donde:

* `poder_del_movimiento` corresponde al poder del movimiento.
* `ataque` corresponde al ataque del Pokémon atacante.
* `defensa` corresponde a la defensa del Pokémon defensor.

El HP inicial de cada Pokémon se obtiene directamente desde la PokéAPI.

Cuando un Pokémon llega a **0 HP**, queda debilitado y entra automáticamente el siguiente Pokémon disponible de su equipo.

La batalla termina cuando todos los Pokémon de uno de los dos equipos han sido derrotados.

## 🎁 Puntos extra implementados

### Ventaja por tipos

Se implementó un sistema de efectividad entre tipos Pokémon.

Los ataques pueden causar:

* Daño aumentado.
* Daño reducido.
* Ningún daño.

Cuando un ataque es especialmente efectivo, reducido o no tiene efecto, esta información se muestra en el registro de batalla.

### PP limitados

Cada movimiento posee una cantidad limitada de PP.

Cada vez que se utiliza un movimiento, su PP disminuye en uno. Cuando llega a cero, el movimiento queda deshabilitado.

La IA también selecciona únicamente movimientos que todavía tengan PP disponible.

Si un Pokémon se queda sin PP en todos sus movimientos, utiliza **Forcejeo** para evitar que la batalla quede bloqueada.

### Golpes críticos

Cada ataque tiene una probabilidad del **15 %** de convertirse en golpe crítico.

Cuando ocurre un golpe crítico, el daño final se duplica y se muestra un mensaje en el registro de batalla.

## 📱 Diseño responsive

La interfaz fue diseñada para adaptarse a diferentes tamaños de pantalla.

El proyecto utiliza CSS Grid, Flexbox y media queries para permitir su funcionamiento en dispositivos con diferentes resoluciones, incluyendo aproximadamente desde **375px hasta 1440px de ancho**.

## 👨‍💻 Autor

Proyecto desarrollado por José David Mena Gómez

**SOFT-06C2 — Diseño y Programación Web**

## 📄 Licencia

Proyecto académico desarrollado con fines educativos.
