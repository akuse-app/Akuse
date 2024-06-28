import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Store from 'electron-store';

// Import translation files
import en from './locales/en.json';
import hu from './locales/hu.json'; // Hungarian translations

const STORE = new Store();
const storedLanguage = STORE.get('language') as string || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hu: { translation: hu },
    },
    lng: storedLanguage, // Set initial language from store
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
