// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: {
          hello: 'Hello',
        },
      },
      es: {
        translation: {
          hello: 'Hola',
        },
      },
      // Add more languages and translations as needed
    },
    lng: 'es',
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
