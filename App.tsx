import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import Navigation from './src/navigation';
import { useSettingsStore } from './src/stores/settingsStore';

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
