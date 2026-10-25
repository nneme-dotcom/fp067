import { Player } from '../models/player';

const photo = (slug: string) => `assets/img/plantilla/${slug}.webp`;
const video = (slug: string) => `assets/videos/plantilla/${slug}.mp4`;

/**
 * La plantilla del VBE Eagles Echternach.
 *
 * - De cada jugadora ponemos el nombre y la inicial del apellido, nada más.
 * - Si una tiene `activa: false`, no sale en la página, pero sigue guardada aquí.
 * - Edad, altura y alcances los iremos rellenando; mientras tanto la ficha dice «Pending».
 * - En el Producto 2 esta lista se mudará a la base de datos (Firestore).
 */
export const PLAYERS: Player[] = [
  {
    id: 1,
    nombre: 'Lina',
    apellidos: 'H.',
    activa: false, // no sale en la página, pero la guardamos
    posicion: 'Outside Hitter',
    brazo: 'Right',
    foto: photo('lina-h'),
    video: video('lina-h'),
  },
  {
    id: 2,
    nombre: 'Juliana',
    apellidos: 'G.',
    posicion: 'Opposite',
    brazo: 'Right',
    foto: photo('juliana-g'),
    video: video('juliana-g'),
  },
  {
    id: 3,
    nombre: 'Elena',
    apellidos: 'R.',
    posicion: 'Setter',
    brazo: 'Right',
    foto: photo('elena-r'),
    video: video('elena-r'),
  },
  {
    id: 4,
    nombre: 'Yara',
    apellidos: 'S.',
    activa: false, // no sale en la página, pero la guardamos
    posicion: 'Middle Blocker',
    brazo: 'Right',
    foto: photo('yara-s'),
    video: video('yara-s'),
  },
  {
    id: 5,
    nombre: 'Beatriz',
    apellidos: 'L.',
    posicion: 'Middle Blocker',
    brazo: 'Right',
    foto: photo('beatriz-l'),
    video: video('beatriz-l'),
  },
  {
    id: 6,
    nombre: 'Sarah',
    apellidos: 'H.',
    activa: false, // no sale en la página, pero la guardamos
    posicion: 'Outside Hitter',
    brazo: 'Right',
    foto: photo('sarah-h'),
    video: video('sarah-h'),
  },
  {
    id: 7,
    nombre: 'Lina',
    apellidos: 'M.',
    posicion: 'Libero',
    brazo: 'Right',
    foto: photo('lina-m'),
    video: video('lina-m'),
  },
  {
    id: 8,
    nombre: 'Lucie',
    apellidos: 'W.',
    posicion: 'Outside Hitter',
    brazo: 'Right',
    foto: photo('lucie-w'),
    video: video('lucie-w'),
  },
  {
    id: 9,
    nombre: 'Ketti',
    apellidos: 'K.',
    posicion: 'Middle Blocker',
    brazo: 'Right',
    foto: photo('ketti-k'),
    video: video('ketti-k'),
  },
];
