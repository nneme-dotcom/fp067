import { Pipe, PipeTransform } from '@angular/core';
import { Player, Position } from '../models/player';

/**
 * El filtro de la lista. Recibe dos cosas:
 *  1. lo que escribes en el buscador → busca en el nombre (y en el dorsal, si lo tiene)
 *  2. la posición del desplegable    → vacío = todas
 *
 * Angular solo lo vuelve a ejecutar cuando cambia algo de eso,
 * así que no hace trabajo de más.
 *
 * Se usa así: players | playerFilter : texto : posicion
 */
@Pipe({ name: 'playerFilter' })
export class PlayerFilterPipe implements PipeTransform {
  transform(players: readonly Player[], search = '', position: Position | '' = ''): Player[] {
    const term = this.normalize(search.trim());

    return players.filter((p) => {
      const matchesText =
        !term ||
        this.normalize(`${p.nombre} ${p.apellidos}`).includes(term) ||
        (p.dorsal !== undefined && String(p.dorsal) === term);

      const matchesPosition = !position || p.posicion === position;

      return matchesText && matchesPosition;
    });
  }

  /** Quita mayúsculas y tildes, para que «libero» encuentre «Líbero». */
  private normalize(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');
  }
}
