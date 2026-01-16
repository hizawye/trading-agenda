import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as Sentry from 'sentry-expo';
import Navigation from './src/navigation';
import { useSettingsStore } from './src/stores/settingsStore';

Sentry.init({
  dsn: 'https://4d5aabc9c1d9d227d9d69bfe4fbdeada@o4510721403715584.ingest.us.sentry.io/4510721406992384',
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
