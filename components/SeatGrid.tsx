'use client';

import type { SeatZone } from '@/lib/types';

const ZONES: SeatZone[] = [
  'front-left', 'front-center', 'front-right',
  'middle-left', 'middle-center', 'middle-right',
  'back-left', 'back-center', 'back-right',
];

const LABELS: Record<SeatZone, string> = {
  'front-left': 'Front L', 'front-center': 'Front C', 'front-right': 'Front R',
  'middle-left': 'Mid L', 'middle-center': 'Mid C', 'middle-right': 'Mid R',
  'back-left': 'Back L', 'back-center': 'Back C', 'back-right': 'Back R',
};

export function SeatGrid({ value, onChange }: { value?: SeatZone; onChange: (z: SeatZone) => void }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-center">
        <div className="rounded-md border border-ink/20 px-4 py-1 text-xs uppercase tracking-wider text-ink/60">
          Lecturer / Screen
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {ZONES.map((zone) => {
          const selected = value === zone;
          return (
            <button
              key={zone}
              type="button"
              onClick={() => onChange(zone)}
              className={`rounded-xl border px-3 py-4 text-sm transition ${
                selected
                  ? 'border-ripple bg-ripple text-white shadow-sm'
                  : 'border-ink/15 bg-white hover:border-ripple/60 hover:bg-soft'
              }`}
            >
              {LABELS[zone]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
