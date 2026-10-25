/**
 * Las posiciones de voleibol (en inglés, como la web).
 * Al ponerlas en una lista cerrada, si escribimos mal una, el editor nos avisa.
 */
export type Position =
  | 'Setter'
  | 'Opposite'
  | 'Middle Blocker'
  | 'Outside Hitter'
  | 'Libero';

/** Las posiciones en orden, para el desplegable del filtro. */
export const POSITIONS: readonly Position[] = [
  'Setter',
  'Opposite',
  'Outside Hitter',
  'Middle Blocker',
  'Libero',
];

/** Con qué brazo ataca y saca. */
export type Hand = 'Right' | 'Left';

/**
 * La «ficha» de una jugadora: qué datos tiene cada una.
 * Los que llevan `?` son opcionales: aún no los tenemos de todas,
 * y en la página salen como «Pending» en vez de inventarlos.
 */
export interface Player {
  id: number;
  nombre: string;
  apellidos: string;
  dorsal?: number;
  posicion: Position;
  brazo: Hand;
  /**
   * Ponlo en `false` para esconderla de la página sin borrarla.
   * Si no pones nada, sale normal.
   */
  activa?: boolean;
  edad?: number;
  /** Altura en centímetros. */
  altura?: number;
  /** Hasta dónde llega saltando para atacar, en centímetros. */
  alcanceAtaque?: number;
  /** Hasta dónde llega saltando para bloquear, en centímetros. */
  alcanceBloqueo?: number;
  nacionalidad?: string;
  descripcion?: string;
  /** Dónde está su foto (dentro de public/assets). */
  foto: string;
  /** Dónde está su vídeo de presentación (dentro de public/assets). */
  video: string;
}
