"use client";

import { useEffect, useState } from "react";
import { pauseAt, targetShabbat, type Pause } from "@/lib/chabbat";

type State = { now: Date; target: ReturnType<typeof targetShabbat>; pause: Pause | null; weekShifted: boolean };

/** État du calendrier de commande, recalculé côté navigateur toutes les minutes (null avant le montage). */
export function useShabbat() {
  const [state, setState] = useState<State | null>(null);
  useEffect(() => {
    const compute = () => {
      const now = new Date();
      const target = targetShabbat(now);
      // La commande vise le Chabbat suivant si le vendredi visé est à plus de 7 jours ou si l'heure limite de la semaine est passée
      const days = (new Date(`${target.friday}T12:00:00Z`).getTime() - now.getTime()) / 86_400_000;
      setState({ now, target, pause: pauseAt(now), weekShifted: days > 6.5 });
    };
    compute();
    const id = setInterval(compute, 60_000);
    return () => clearInterval(id);
  }, []);
  return state;
}
