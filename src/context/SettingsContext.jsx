import { createContext, useContext, useState, useEffect } from 'react';
import { getSettings, DEFAULT_SETTINGS } from '../services/firestoreService';

/* ═══════════════════════════════════════════════════════════════════
   SETTINGS CONTEXT
   Fetches restaurant settings from Firebase RTDB once on mount.
   Every component that needs phone / email / social links / etc.
   can call  const settings = useSettings();
   ═══════════════════════════════════════════════════════════════════ */

const SettingsContext = createContext(DEFAULT_SETTINGS);

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    let cancelled = false;
    getSettings().then((data) => {
      if (!cancelled) setSettings(data);
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
