import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as Sentry from 'sentry-expo';
import Navigation from './src/navigation';
import { useSettingsStore } from './src/stores/settingsStore';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  enableInExpoDevelopment: false,
  debug: false,
});

export default function App() {
  const loadSettings = useSettingsStore((state) => state.loadSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <>
      <Navigation />
      <StatusBar style="light" />
    </>
  );
}
