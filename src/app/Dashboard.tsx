import { useEffect, useRef, useState } from 'react';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';
import { getPostsBetween, localDateString } from '../db';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

const DAY = 24 * 60 * 60 * 1000;

/** Placeholder dashboard: posts analyzed per day over the last 7 days. Score trends come with AI scoring. */
export function Dashboard() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    let chart: Chart | undefined;
    let cancelled = false;
    (async () => {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() - 6 * DAY;
      const posts = await getPostsBetween(start, start + 7 * DAY);
      if (cancelled) return;
      const days = Array.from({ length: 7 }, (_, i) => new Date(start + i * DAY));
      const counts = days.map((d) => posts.filter((p) => localDateString(new Date(p.firstSeen)) === localDateString(d)).length);
      setTotal(posts.length);
      if (canvas.current) {
        chart = new Chart(canvas.current, {
          type: 'bar',
          data: {
            labels: days.map((d) => d.toLocaleDateString(undefined, { weekday: 'short' })),
            datasets: [{ label: 'Posts analyzed', data: counts, backgroundColor: '#2f6fed' }],
          },
          options: { scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } },
        });
      }
    })();
    return () => {
      cancelled = true;
      chart?.destroy();
    };
  }, []);

  return (
    <>
      <h1>Weekly dashboard</h1>
      <p className="muted">
        {total === null ? 'Loading…' : `${total} posts analyzed in the last 7 days.`} Alignment trends will appear once
        AI scoring is enabled.
      </p>
      <div className="card">
        <canvas ref={canvas} />
      </div>
    </>
  );
}
