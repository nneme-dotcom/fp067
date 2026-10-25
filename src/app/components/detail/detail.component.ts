import { Component, ElementRef, computed, effect, inject, input, output } from '@angular/core';
import { Player } from '../../models/player';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent {
  /** La jugadora que hay que mostrar (nos la pasa el componente principal). */
  readonly player = input.required<Player>();

  /**
   * Los datos que salen en la ficha. Se actualizan solos cuando cambias de jugadora.
   * Si todavía no tenemos un dato, en pantalla aparece «Pending».
   */
  protected readonly stats = computed<{ label: string; value?: string | number; unit?: string }[]>(() => {
    const p = this.player();
    return [
      { label: 'Hand', value: p.brazo },
      { label: 'Age', value: p.edad, unit: 'y/o' },
      { label: 'Height', value: p.altura, unit: 'cm' },
      { label: 'Spike reach', value: p.alcanceAtaque, unit: 'cm' },
      { label: 'Block reach', value: p.alcanceBloqueo, unit: 'cm' },
    ];
  });

  /** Avisa al componente principal de que has pulsado la X para cerrar. */
  readonly closed = output<void>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    // Cuando cambias de jugadora, Angular no crea la ficha de nuevo, solo cambia los datos.
    // Por eso la animación de entrada solo se vería la primera vez. Aquí la repetimos
    // a mano cada vez que llega una jugadora distinta.
    effect(() => {
      this.player();
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduceMotion) return;
      this.host.nativeElement.querySelectorAll('.detail-card').forEach((card) =>
        card.animate(
          [
            { opacity: 0.25, transform: 'translateX(10px)' },
            { opacity: 1, transform: 'none' },
          ],
          { duration: 220, easing: 'ease-out' },
        ),
      );
    });
  }

  protected close(): void {
    this.closed.emit();
  }
}
