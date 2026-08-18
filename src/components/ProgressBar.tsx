'use client';

import { useI18n } from '../i18n';

export default function ProgressBar({ percent }: { percent: number }) {
  const { t } = useI18n();
  return (
    <div
      className="progress"
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={t('progress.aria')}
    >
      <div className="progress-fill" style={{ width: `${percent}%` }} />
    </div>
  );
}
