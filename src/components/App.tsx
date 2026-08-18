'use client';

import { I18nProvider } from '../i18n';
import DailyPlan from './DailyPlan';

export default function App() {
  return (
    <I18nProvider>
      <DailyPlan />
    </I18nProvider>
  );
}
