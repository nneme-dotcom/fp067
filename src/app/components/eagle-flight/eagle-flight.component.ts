import { Component, DestroyRef, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';
import { EAGLE_MESH } from './eagle-mesh';

/** Los ajustes del aleteo. Si quieres que vuele distinto, se toca aquí (ángulos en grados). */
const FLIGHT = {
  period: 1.2, // cuánto tarda un aleteo completo, en segundos
  down: 0.42, // parte del aleteo que dura la bajada (baja rápido y sube despacio, como un pájaro de verdad)
  up3: -18, // cuánto gira el ala hacia atrás: arriba…
  dn3: 52, // …y abajo
  up2: -8, // cuánto sube y baja el ala de lado: arriba…
  dn2: 30, // …y abajo
  lag: 0.08, // la punta del ala va un pelín por detrás del resto
  depth: 380, // efecto de profundidad (más bajo = más 3D)
  bob: 4, // cuánto sube y baja el cuerpo con cada aleteo
};

const DEG = Math.PI / 180;
const AXIS_ORIGIN = [96, 108] as const; // un punto del lomo del águila
const SHOULDER = [90, 100] as const; // el «hombro», donde se articula el ala

/** Pasa de 0 a 1 de forma suave, sin tirones. */
const smoothstep = (a: number, b: number, x: number): number => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * El águila del club aleteando sin parar.
 *
 * Cómo funciona: unas 60 veces por segundo calculamos dónde tiene que estar
 * cada punto de las alas y movemos las líneas del dibujo. Lo hacemos directamente,
 * sin pasar por Angular, porque son unas 300 líneas y así va mucho más fluido.
 */
@Component({
  selector: 'app-eagle-flight',
  template: `<svg #svg class="eagle" viewBox="0 0 240 240" aria-hidden="true" focusable="false"></svg>`,
  styleUrl: './eagle-flight.component.scss',
})
export class EagleFlightComponent {
  private readonly svgRef = viewChild.required<ElementRef<SVGSVGElement>>('svg');

  /** Hacia dónde va el lomo (ax) y hacia dónde se abre el ala (n). */
  private axis = { ax: [0, 0], n: [0, 0] };

  constructor() {
    const destroyRef = inject(DestroyRef);

    // Esperamos a que el dibujo esté en pantalla antes de empezar a moverlo
    afterNextRender(() => {
      const svg = this.svgRef().nativeElement;
      const lines = this.createLines(svg);
      const positions: [number, number][] = EAGLE_MESH.V.map(() => [0, 0]);
      const local = this.toWingCoordinates();

      const draw = (t: number) => this.drawFrame(t, lines, positions, local);

      // Si en tu ordenador tienes activado «reducir movimiento», el águila se queda quieta
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        draw(0);
        return;
      }

      let frameId = 0;
      const start = performance.now();
      const loop = (now: number) => {
        // Si el águila no se ve (por ejemplo, en el móvil), no hacemos cálculos:
        // así no gastamos batería para nada
        if (svg.getClientRects().length > 0) {
          draw((now - start) / 1000);
        }
        frameId = requestAnimationFrame(loop);
      };
      frameId = requestAnimationFrame(loop);

      // Cuando el águila desaparece (al elegir una jugadora), paramos la animación
      destroyRef.onDestroy(() => cancelAnimationFrame(frameId));
    });
  }

  /** Crea una línea por cada trazo del dibujo. */
  private createLines(svg: SVGSVGElement): SVGLineElement[] {
    const ns = 'http://www.w3.org/2000/svg';
    return EAGLE_MESH.E.map(() => {
      const line = document.createElementNS(ns, 'line');
      // Que la línea sea igual de fina aunque el águila se vea más grande
      line.setAttribute('vector-effect', 'non-scaling-stroke');
      return svg.appendChild(line);
    });
  }

  /**
   * Para cada punto, calcula dónde está respecto al cuerpo:
   * u = a lo largo del lomo, v = cuánto se aleja hacia la punta del ala.
   */
  private toWingCoordinates(): { u: number; v: number }[] {
    const len = Math.hypot(-0.74, -0.67);
    const ax = [-0.74 / len, -0.67 / len];
    let n = [-ax[1], ax[0]];
    if (n[0] * 130 + n[1] * -100 < 0) n = [-n[0], -n[1]];
    this.axis = { ax, n };

    return EAGLE_MESH.V.map(([x, y]) => {
      const dx = x - AXIS_ORIGIN[0];
      const dy = y - AXIS_ORIGIN[1];
      return { u: dx * ax[0] + dy * ax[1], v: dx * n[0] + dy * n[1] };
    });
  }

  /** En qué momento del aleteo estamos: 0 = ala arriba, 1 = ala abajo. */
  private wingPhase(phase: number): number {
    const p = ((phase % 1) + 1) % 1;
    return p < FLIGHT.down
      ? smoothstep(0, 1, p / FLIGHT.down)
      : 1 - smoothstep(0, 1, (p - FLIGHT.down) / (1 - FLIGHT.down));
  }

  private drawFrame(
    t: number,
    lines: SVGLineElement[],
    pos: [number, number][],
    local: { u: number; v: number }[],
  ): void {
    const { ax, n } = this.axis;
    const phase = t / FLIGHT.period;
    const k0 = this.wingPhase(phase);
    const k1 = this.wingPhase(phase - FLIGHT.lag);
    const bob = FLIGHT.bob * Math.cos(2 * Math.PI * (phase - FLIGHT.down * 0.9));

    EAGLE_MESH.V.forEach(([x0, y0], i) => {
      const group = EAGLE_MESH.G[i];
      if (!group) {
        pos[i] = [x0, y0 + bob]; // el cuerpo no aletea, solo sube y baja un poco
        return;
      }

      const { u, v } = local[i];
      const tip = smoothstep(50, 130, v); // 0 cerca del cuerpo, 1 en la punta
      const weight = smoothstep(3, 35, v); // lo que está pegado al cuerpo casi no se mueve
      const k = k0 + (k1 - k0) * tip; // la punta llega un poquito tarde

      let a3 = (FLIGHT.up3 + (FLIGHT.dn3 - FLIGHT.up3) * k) * DEG * weight;
      let a2 = (FLIGHT.up2 + (FLIGHT.dn2 - FLIGHT.up2) * k) * DEG * weight;
      if (group === 2) {
        a3 = -a3 * 0.9; // el ala de atrás se mueve al revés
        a2 = a2 * 0.6;
      }

      // Giramos el ala en 3D y le damos algo de perspectiva
      const c = Math.cos(a3);
      const z = v * Math.sin(a3);
      let lx = AXIS_ORIGIN[0] + u * ax[0] + v * c * n[0];
      let ly = AXIS_ORIGIN[1] + u * ax[1] + v * c * n[1];
      const s = FLIGHT.depth / (FLIGHT.depth - z);
      lx = AXIS_ORIGIN[0] + (lx - AXIS_ORIGIN[0]) * s;
      ly = AXIS_ORIGIN[1] + (ly - AXIS_ORIGIN[1]) * s;

      // Y además la bajamos y subimos, girando desde el hombro
      const dx = lx - SHOULDER[0];
      const dy = ly - SHOULDER[1];
      const cs = Math.cos(a2);
      const sn = Math.sin(a2);
      pos[i] = [SHOULDER[0] + dx * cs - dy * sn, SHOULDER[1] + dx * sn + dy * cs + bob];
    });

    EAGLE_MESH.E.forEach(([a, b], q) => {
      const line = lines[q];
      line.setAttribute('x1', pos[a][0].toFixed(2));
      line.setAttribute('y1', pos[a][1].toFixed(2));
      line.setAttribute('x2', pos[b][0].toFixed(2));
      line.setAttribute('y2', pos[b][1].toFixed(2));
    });
  }
}
