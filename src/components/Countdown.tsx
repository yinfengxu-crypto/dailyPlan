'use client';

import { useNow } from '../hooks/useNow';
import { useI18n } from '../i18n';

interface Props {
  dateKey: string;
  timeStart?: string;
  timeEnd?: string;
  completed: boolean;
}

const pad = (n: number) => String(n).padStart(2, '0');

export default function Countdown({ dateKey, timeStart, timeEnd, completed }: Props) {
  const now = useNow(1000);
  const { t } = useI18n();

  if (completed) {
    return (
      <div className="countdown">
        <span className="cd-state done">{t('cd.done')}</span>
      </div>
    );
  }

  const deadlineTime = timeEnd ?? timeStart;
  if (!deadlineTime) {
    return (
      <div className="countdown">
        <span className="cd-state">{t('cd.noTime')}</span>
      </div>
    );
  }

  const deadline = new Date(`${dateKey}T${deadlineTime}:00`).getTime();
  const diff = deadline - now;

  if (diff <= 0) {
    return (
      <div className="countdown">
        <span className="cd-state overdue">{t('cd.overdue')}</span>
      </div>
    );
  }

  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff / 3600000) % 24;
  const m = Math.floor(diff / 60000) % 60;
  const s = Math.floor(diff / 1000) % 60;

  const segs = [
    ...(d > 0 ? [{ label: t('cd.day'), value: d }] : []),
    { label: t('cd.hour'), value: h },
    { label: t('cd.min'), value: m },
    { label: t('cd.sec'), value: s },
  ];

  const rangeText =
    timeStart && timeEnd ? `${timeStart} – ${timeEnd}` : timeStart || timeEnd || '';
  const label = timeEnd ? t('cd.untilEnd') : t('cd.untilStart');

  return (
    <div className="countdown">
      <div className="cd-info">
        <span className="cd-range">🕐 {rangeText}</span>
        <span className="cd-label">⏳ {label}</span>
      </div>
      <div className="cd-segs">
        {segs.map(seg => (
          <div key={seg.label} className="cd-seg">
            <span className="cd-num">{pad(seg.value)}</span>
            <span className="cd-unit">{seg.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
