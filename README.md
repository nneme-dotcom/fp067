# VBE Eagles Echternach · Producto 1 (FP067)

Una web para conocer a las jugadoras del **VBE Eagles Echternach**, el equipo de voleibol del club. Eliges una jugadora de la lista y ves su ficha y su vídeo de presentación.

Es el Producto 1 de la asignatura FP.451 *Desarrollo front-end con frameworks avanzados en entornos móviles* (CFGS DAW, UOC). Lo hago yo solo: Nadir Neme Rodriguez.

- La web está en **inglés**, porque en el club se habla de todo un poco.
- Las jugadoras, las fotos y los vídeos son **de verdad**, y salen aquí con su permiso.
- Los logos, los colores y las letras son los de la web del club: [volleyball-echternach.lu](https://volleyball-echternach.lu/).

## Qué necesitas para abrirlo

- **Node.js 22.22.3 o más nuevo** (o la versión 24). Angular 22 no arranca con versiones más viejas.
- npm, que viene con Node.

## Cómo arrancarlo

```bash
npm install          # descarga lo necesario (solo la primera vez)
npm start            # abre la web en http://localhost:4200
npm run build        # prepara la versión final en la carpeta dist/
```

**En CodeSandbox** no hay que hacer nada: el proyecto ya trae la configuración para usar Node 24, instalar todo y arrancar la web solo.

## Qué hace la web

| Lo que pide la rúbrica | Cómo está hecho |
|---|---|
| **La lista** (`PlayersComponent`) | Cada jugadora sale con su foto, nombre, posición y brazo dominante. La que eliges se pinta en verde lima. Los datos están en su propio fichero (`players.data.ts`). |
| **La ficha** (`DetailComponent`) | Arriba, la foto, el nombre y la posición. Al lado del vídeo, los datos: brazo, edad, altura y alcances. Los que aún no tenemos salen como *Pending*. Con la X se cierra. |
| **El reproductor** (`MediaComponent`) | Play, pausa, stop, una barra para avanzar o retroceder y el volumen. Los botones los hice yo y van encima del vídeo. |
| **El buscador** (pipe `playerFilter`) | Puedes buscar por nombre y filtrar por posición con un desplegable. |

**Y además:**
- Se ve bien en el móvil, en la tablet y en el ordenador.
- Piensa en todo el mundo:
  - se puede usar solo con el teclado,
  - los botones son grandes para el dedo,
  - si tu ordenador tiene activado «reducir movimiento», no hay animaciones.
- Mientras no eliges a nadie, sale el águila del club aleteando.

## Dónde está cada cosa

```
src/app/
├── models/player.ts                 Qué datos tiene cada jugadora
├── data/players.data.ts             La plantilla (para esconder a alguien: activa: false)
├── pipes/player-filter.pipe.ts      El filtro del buscador
├── components/
│   ├── header/                      La cabecera con el logo y el lema #goeagles
│   ├── players/                     La lista de jugadoras con los filtros
│   ├── detail/                      La ficha de la jugadora
│   ├── media/                       El reproductor de vídeo
│   └── eagle-flight/                El águila animada
└── app.ts / app.html / app.scss     La página que lo junta todo
public/assets/
├── club/                            Logos del club
├── fonts/                           La letra de los títulos (Bebas Neue, libre)
├── img/plantilla/                   Las fotos de perfil (sacadas de cada vídeo)
└── videos/plantilla/                Los vídeos de presentación
```

## Cómo se pasan la información las piezas

```
La lista ──(«he elegido a esta»)──▶ La página ──(«enseña a esta»)──▶ La ficha
    ▲                                  │        ──(«enseña a esta»)──▶ El reproductor
    └────────(«esta es la elegida»)────┘ ◀──────(«cierra»)────────── La ficha
```

La página principal hace de intermediaria: se entera de a quién eliges en la lista y se lo pasa a la ficha y al reproductor.

## Algunas decisiones

- **Angular 22, la última versión.** Por eso uso `@for` y `@if` en vez de `*ngFor` y `*ngIf`, que hacen lo mismo pero ya están anticuados.
- **Los vídeos.** El iPhone graba en un formato (HEVC con HDR) que muchos navegadores no reproducen bien, y además se veían quemados de luz. Los pasé a un formato normal (H.264) corrigiendo la luz y bajando el tamaño a 720 p. Han pasado de 212 MB a 24 MB.

## Hitos

| Etiqueta | Qué incluye |
|---|---|
| `v0.1-setup` | La base del proyecto: Angular, Bootstrap, letras y configuración |
| `v0.2-datos` | Los datos de las jugadoras, sus fotos y sus vídeos |
| `v0.3-componentes` | La lista, la ficha, el reproductor, el buscador y el diseño |
| `v1.0-p1` | La versión que se entrega del Producto 1 |
