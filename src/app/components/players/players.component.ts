import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PLAYERS } from '../../data/players.data';
import { Player, POSITIONS, Position } from '../../models/player';
import { PlayerFilterPipe } from '../../pipes/player-filter.pipe';

@Component({
  selector: 'app-players',
  imports: [FormsModule, PlayerFilterPipe],
  templateUrl: './players.component.html',
  styleUrl: './players.component.scss',
})
export class PlayersComponent {
  /**
   * Las jugadoras, que vienen de su propio fichero (players.data.ts).
   * Solo enseñamos las activas; las demás siguen guardadas ahí por si vuelven.
   */
  protected readonly players: Player[] = PLAYERS.filter((p) => p.activa !== false);
  protected readonly positions = POSITIONS;

  /** Lo que has escrito en el buscador y la posición elegida. */
  protected readonly search = signal('');
  protected readonly position = signal<Position | ''>('');

  /** Qué jugadora está elegida (para pintarla en lima). */
  readonly selectedId = input<number | null>(null);

  /** Avisa al componente principal de que has pulsado una jugadora. */
  readonly playerSelected = output<Player>();

  protected select(player: Player): void {
    this.playerSelected.emit(player);
  }

  protected clearFilters(): void {
    this.search.set('');
    this.position.set('');
  }
}
