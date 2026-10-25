import { Component, signal } from '@angular/core';
import { DetailComponent } from './components/detail/detail.component';
import { EagleFlightComponent } from './components/eagle-flight/eagle-flight.component';
import { HeaderComponent } from './components/header/header.component';
import { MediaComponent } from './components/media/media.component';
import { PlayersComponent } from './components/players/players.component';
import { Player } from './models/player';

/** Por debajo de este ancho (móvil) la lista y la ficha van una debajo de la otra. */
const STACKED_LAYOUT = '(max-width: 767.98px)';

/**
 * El componente principal hace de intermediario:
 * la lista le avisa de qué jugadora has elegido, y él se la pasa
 * a la ficha y al reproductor.
 */
@Component({
  selector: 'app-root',
  imports: [HeaderComponent, PlayersComponent, DetailComponent, MediaComponent, EagleFlightComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly selectedPlayer = signal<Player | null>(null);

  protected onPlayerSelected(player: Player): void {
    this.selectedPlayer.set(player);

    // En el móvil la ficha queda debajo de la lista, así que bajamos hasta ella
    // automáticamente (esperamos un instante a que esté dibujada).
    if (window.matchMedia(STACKED_LAYOUT).matches) {
      requestAnimationFrame(() =>
        document.getElementById('player-zone')?.scrollIntoView({ behavior: 'smooth' }),
      );
    }
  }

  protected onDetailClosed(): void {
    const closedId = this.selectedPlayer()?.id;
    this.selectedPlayer.set(null);

    // Al cerrar, volvemos a dejar el cursor del teclado sobre la jugadora que estaba abierta.
    // Si no, quien usa el teclado o un lector de pantalla tendría que empezar desde arriba.
    requestAnimationFrame(() =>
      document.querySelector<HTMLElement>(`[data-player-id="${closedId}"]`)?.focus(),
    );
  }
}
